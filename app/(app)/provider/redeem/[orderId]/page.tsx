import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { money } from "@/lib/money";
import { redeemOrder } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function RedeemPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const user = await requireRole("PROVIDER");
  if (!user.providerId) redirect("/");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { include: { company: true, department: true } },
      items: { include: { offer: { include: { provider: true } } } },
    },
  });

  if (!order) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", paddingTop: 48 }}>
        <div style={{ fontSize: 56 }}>❌</div>
        <h2 className="d" style={{ fontSize: 22, margin: "12px 0 8px" }}>Order not found</h2>
        <p style={{ color: "var(--muted)" }}>This QR code is invalid or has expired.</p>
      </div>
    );
  }

  const myItems = order.items.filter((it) => it.offer.providerId === user.providerId);
  if (myItems.length === 0) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", paddingTop: 48 }}>
        <div style={{ fontSize: 56 }}>🚫</div>
        <h2 className="d" style={{ fontSize: 22, margin: "12px 0 8px" }}>Not your booking</h2>
        <p style={{ color: "var(--muted)" }}>This order doesn&apos;t contain any items from your store.</p>
      </div>
    );
  }

  if (order.status !== "PAID") {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", paddingTop: 48 }}>
        <div style={{ fontSize: 56 }}>⏳</div>
        <h2 className="d" style={{ fontSize: 22, margin: "12px 0 8px" }}>Not approved yet</h2>
        <p style={{ color: "var(--muted)" }}>
          This order is still <b>{order.status.toLowerCase()}</b>. Only paid orders can be redeemed.
        </p>
      </div>
    );
  }

  const alreadyRedeemed = Boolean(order.redeemedAt);
  const myTotal = myItems.reduce((s, it) => s + it.price, 0);
  const currency = order.user.company?.currency ?? "EUR";

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="kick" style={{ color: "var(--orange-d)", marginBottom: 8 }}>Redemption</div>
      <h1 className="d" style={{ fontSize: 28, fontWeight: 700, margin: "0 0 20px" }}>{order.title}</h1>

      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <div className="kick" style={{ marginBottom: 10 }}>Customer</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            className="av"
            style={{ width: 40, height: 40, background: order.user.color, fontSize: 13, flexShrink: 0 }}
          >
            {order.user.initials}
          </span>
          <div>
            <div style={{ fontWeight: 600 }}>{order.user.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
              {order.user.department?.name ?? ""}{order.user.company ? ` · ${order.user.company.name}` : ""}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <div className="kick" style={{ marginBottom: 10 }}>Items from your store</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {myItems.map((it) => (
            <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
              <span
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: it.offer.provider.color, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <i className={`ti ${it.offer.icon}`} />
              </span>
              <span style={{ flex: 1 }}>{it.title}</span>
              <span className="d" style={{ fontWeight: 600 }}>
                {it.price === 0 ? "Free" : money(it.price, currency)}
              </span>
            </div>
          ))}
        </div>
        <div style={{
          borderTop: "1px solid var(--line)", marginTop: 12, paddingTop: 12,
          display: "flex", justifyContent: "space-between", fontWeight: 700,
        }}>
          <span>Your total</span>
          <span className="d">{myTotal === 0 ? "Free" : money(myTotal, currency)}</span>
        </div>
      </div>

      {alreadyRedeemed ? (
        <div
          className="card"
          style={{ padding: 20, textAlign: "center", background: "rgba(33,160,90,.08)", border: "1.5px solid rgba(33,160,90,.3)" }}
        >
          <i className="ti ti-discount-check" style={{ fontSize: 40, color: "#1f7a4d" }} />
          <div style={{ fontWeight: 700, fontSize: 17, marginTop: 8, color: "#1f7a4d" }}>Already redeemed</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
            Redeemed on {new Date(order.redeemedAt!).toLocaleString()}
          </div>
        </div>
      ) : (
        <form action={redeemOrder}>
          <input type="hidden" name="orderId" value={orderId} />
          <button
            type="submit"
            className="btn"
            style={{ width: "100%", padding: "15px 0", fontSize: 16, fontWeight: 700 }}
          >
            <i className="ti ti-check" /> Confirm redemption
          </button>
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 10 }}>
            Tap to mark this booking as used. This cannot be undone.
          </p>
        </form>
      )}
    </div>
  );
}
