import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { money } from "@/lib/money";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; bg: string; fg: string; icon: string }> = {
  PENDING: { label: "Awaiting employer", bg: "rgba(31,91,224,.12)", fg: "var(--blue-d)", icon: "ti-clock" },
  APPROVED: { label: "Approved", bg: "rgba(255,106,31,.14)", fg: "var(--orange-d)", icon: "ti-check" },
  PAID: { label: "Booked & paid", bg: "rgba(33,160,90,.14)", fg: "#1f7a4d", icon: "ti-circle-check" },
  REJECTED: { label: "Declined", bg: "rgba(178,60,10,.12)", fg: "var(--orange-d)", icon: "ti-x" },
};

const SOURCE: Record<string, string> = {
  PLANNER: "AI planner",
  DROP: "Friday drop",
  MYSTERY: "Mystery box",
  MANUAL: "Marketplace",
  GIFT: "Gift",
};

export default async function Orders({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const { submitted } = await searchParams;
  const user = await requireUser();
  const currency = user.company?.currency ?? "EUR";

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: { include: { offer: { include: { provider: true } } } },
      payments: { include: { provider: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div className="kick" style={{ color: "var(--orange-d)", marginBottom: 8 }}>Your benefits</div>
      <h1 className="d" style={{ fontSize: 36, fontWeight: 700, margin: "0 0 16px" }}>Orders & approvals</h1>

      {submitted && (
        <div className="card pop" style={{ padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 12, background: "rgba(31,91,224,.08)" }}>
          <span style={{ fontSize: 26 }}>📨</span>
          <div>
            <div style={{ fontWeight: 600 }}>Selection submitted</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>Your employer will review it. You&apos;ll see the payment route to each provider here once approved.</div>
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="card" style={{ padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>🧾</div>
          <p style={{ color: "var(--muted)" }}>No orders yet. <Link href="/marketplace" style={{ color: "var(--blue-d)", fontWeight: 600 }}>Browse perks →</Link></p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {orders.map((o) => {
          const st = STATUS[o.status] ?? STATUS.PENDING;
          return (
            <div key={o.id} className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span className="d" style={{ fontSize: 18, fontWeight: 700 }}>{o.title}</span>
                <span className="pill" style={{ background: st.bg, color: st.fg }}>
                  <i className={`ti ${st.icon}`} /> {st.label}
                </span>
                <span className="pill" style={{ background: "rgba(26,22,16,.06)", color: "var(--muted)" }}>{SOURCE[o.source] ?? o.source}</span>
                <span className="d" style={{ marginLeft: "auto", fontSize: 18, fontWeight: 700 }}>
                  {o.total === 0 ? "Free" : money(o.total, currency)}
                </span>
              </div>

              {o.reasoning && (
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8, fontStyle: "italic" }}>
                  <i className="ti ti-sparkles" style={{ color: "var(--orange)" }} /> {o.reasoning}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                {o.items.map((it) => (
                  <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: it.offer.provider.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className={`ti ${it.offer.icon}`} />
                    </span>
                    <span style={{ flex: 1 }}>{it.title}</span>
                    <span style={{ color: "var(--muted)" }}>{it.offer.provider.name}</span>
                    <span className="d" style={{ fontWeight: 600, width: 60, textAlign: "right" }}>{it.price === 0 ? "—" : money(it.price, currency)}</span>
                  </div>
                ))}
              </div>

              {o.payments.length > 0 && (
                <div style={{ borderTop: "1px solid var(--line)", marginTop: 12, paddingTop: 12 }}>
                  <div className="kick" style={{ marginBottom: 8 }}>Simulated payments routed</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {o.payments.map((p) => (
                      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                        <i className="ti ti-circle-check" style={{ color: "#1f7a4d" }} />
                        <span>{money(p.amount, currency)} → <b>{p.provider.name}</b></span>
                        <span className="tnum" style={{ marginLeft: "auto", color: "var(--muted)" }}>{p.reference}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
