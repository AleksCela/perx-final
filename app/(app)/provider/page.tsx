import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { ratingOf } from "@/lib/catalog";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function ProviderDashboard() {
  const user = await requireRole("PROVIDER");
  if (!user.providerId) redirect("/");
  const currency = "EUR";

  const provider = await prisma.provider.findUnique({
    where: { id: user.providerId },
    include: {
      offers: { include: { reviews: { select: { rating: true } }, _count: { select: { orderItems: true } } } },
    },
  });
  if (!provider) redirect("/");

  const payments = await prisma.payment.findMany({
    where: { providerId: provider.id },
    include: { order: { include: { user: { include: { department: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  const revenue = payments.reduce((s, p) => s + p.amount, 0);
  const allReviews = provider.offers.flatMap((o) => o.reviews);
  const rating = ratingOf(allReviews);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="g" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
        <span className="pill" style={{ background: provider.color, color: "#fff" }}>
          <i className="ti ti-building-store" /> {provider.name}
        </span>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{provider.tagline} · {provider.city}</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <Kpi label="Revenue (paid)" value={money(revenue, currency)} sub={`${payments.length} payments`} />
        <Kpi label="Live offers" value={String(provider.offers.length)} sub="on the marketplace" />
        <Kpi label="Bookings" value={String(provider.offers.reduce((s, o) => s + o._count.orderItems, 0))} sub="all time" />
        <Kpi label="Rating" value={`${rating.toFixed(1)}/5`} sub={`${allReviews.length} reviews`} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="kick" style={{ marginBottom: 12 }}>Your offers</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {provider.offers.map((o) => (
              <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: provider.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`ti ${o.icon}`} />
                </span>
                <span style={{ flex: 1 }}>{o.title}</span>
                <span style={{ color: "var(--muted)" }}>{o._count.orderItems} booked</span>
                <span className="d" style={{ fontWeight: 600, width: 56, textAlign: "right" }}>{money(o.price, currency)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="kick" style={{ marginBottom: 12 }}>Incoming payments</div>
          {payments.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--muted)" }}>No payments yet — they land here when an employer approves a booking.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {payments.slice(0, 8).map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                  <i className="ti ti-circle-check" style={{ color: "#1f7a4d" }} />
                  <span><b>{money(p.amount, currency)}</b></span>
                  <span style={{ color: "var(--muted)" }}>· {p.order.user.department?.name ?? p.order.user.name}</span>
                  <span className="tnum" style={{ marginLeft: "auto", color: "var(--muted)" }}>{p.reference}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card" style={{ padding: 15 }}>
      <div className="kick">{label}</div>
      <div className="d" style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{sub}</div>
    </div>
  );
}
