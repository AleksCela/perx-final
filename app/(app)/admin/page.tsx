import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { getCompanyStats } from "@/lib/insights";
import { money, symbol } from "@/lib/money";
import { approveOrder, rejectOrder } from "../../actions";
import CountUp from "../../components/CountUp";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const admin = await requireRole("ADMIN");
  const companyId = admin.companyId!;
  const stats = await getCompanyStats(companyId);
  const currency = stats.currency;

  const pending = await prisma.order.findMany({
    where: { status: "PENDING", user: { companyId } },
    include: {
      user: { include: { department: true } },
      items: { include: { offer: { include: { provider: true } } } },
    },
    orderBy: { createdAt: "asc" },
  });

  const recentPayments = await prisma.payment.findMany({
    where: { order: { user: { companyId } } },
    include: { provider: true, order: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="g" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
        <span className="pill" style={{ background: "var(--ink)", color: "#fff" }}>
          <i className="ti ti-shield-half" /> Admin · People analytics
        </span>
        <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--muted)" }}>
          {admin.company?.name} · {stats.headcount} employees
        </span>
      </div>

      {/* Approvals queue */}
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span className="d" style={{ fontSize: 18, fontWeight: 700 }}>Approvals</span>
          <span className="pill" style={{ background: pending.length ? "var(--orange)" : "rgba(26,22,16,.06)", color: pending.length ? "#fff" : "var(--muted)" }}>
            {pending.length} awaiting
          </span>
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--muted)" }}>Approve to route a simulated payment to each provider</span>
        </div>

        {pending.length === 0 && (
          <div style={{ fontSize: 13.5, color: "var(--muted)", padding: "8px 0" }}>All caught up — no pending selections. 🎉</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pending.map((o) => {
            const providers = new Set(o.items.map((i) => i.offer.providerId)).size;
            return (
              <div key={o.id} className="card" style={{ padding: 14, background: "#F5EFE3" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span className="av" style={{ width: 32, height: 32, background: o.user.color, fontSize: 11 }}>{o.user.initials}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{o.user.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{o.user.department?.name} · {o.title}</div>
                  </div>
                  <span className="pill" style={{ background: "rgba(31,91,224,.12)", color: "var(--blue-d)", marginLeft: 6 }}>
                    {providers} provider{providers > 1 ? "s" : ""}
                  </span>
                  <span className="d" style={{ marginLeft: "auto", fontSize: 18, fontWeight: 700 }}>{money(o.total, currency)}</span>
                </div>

                {o.reasoning && (
                  <div style={{ fontSize: 12, color: "var(--muted)", margin: "8px 0 0", fontStyle: "italic" }}>
                    <i className="ti ti-sparkles" style={{ color: "var(--orange)" }} /> {o.reasoning}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, margin: "10px 0", flexWrap: "wrap" }}>
                  {o.items.map((it) => (
                    <span key={it.id} className="pill" style={{ background: "#fff", color: "var(--ink)", border: "1px solid var(--line)" }}>
                      <i className={`ti ${it.offer.icon}`} style={{ color: it.offer.provider.color }} /> {it.title} · {money(it.price, currency)}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <form action={approveOrder}>
                    <input type="hidden" name="orderId" value={o.id} />
                    <button type="submit" className="btn btn-ink"><i className="ti ti-check" /> Approve & pay</button>
                  </form>
                  <form action={rejectOrder}>
                    <input type="hidden" name="orderId" value={o.id} />
                    <button type="submit" className="btn btn-ghost"><i className="ti ti-x" /> Decline</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tax savings hero */}
      <div style={{ background: "var(--ink)", borderRadius: 20, padding: 22, color: "#FBF6EC", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <span className="pill" style={{ background: "var(--orange)", color: "#fff", marginBottom: 12 }}>
            <i className="ti ti-trending-up" /> Untaxed value delivered
          </span>
          <div className="d" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>
            <CountUp value={stats.taxSaving} prefix={symbol(currency)} />
            <span style={{ color: "var(--orange)", fontSize: 24, fontWeight: 700 }}> saved</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(251,246,236,.7)", marginTop: 9 }}>
            on {money(stats.benefitValue, currency)} of benefits booked, vs. paying the same value as{" "}
            <b style={{ color: "#fff" }}>taxed salary</b> · ~{(1 + stats.taxRate).toFixed(2)} of benefit per {symbol(currency)}1 of cost
          </div>
        </div>
        <div style={{ textAlign: "right", borderLeft: "1px solid rgba(255,255,255,.16)", paddingLeft: 24 }}>
          <div style={{ fontSize: 11, color: "rgba(251,246,236,.6)" }}>Avg saved / employee</div>
          <div className="d" style={{ fontSize: 30, fontWeight: 700, color: "var(--orange)" }}>{money(stats.avgSaved, currency)}</div>
          <div style={{ fontSize: 11, color: "rgba(251,246,236,.6)", marginTop: 10 }}>Counter ticks live as<br />perks are approved</div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <Kpi label="Active this week" value={`${stats.activePct}%`} sub="of employees" />
        <Kpi label="Perks booked" value={stats.perksBooked.toLocaleString("en-US")} sub="all time" />
        <Kpi label="Budget used" value={`${stats.budgetPct}%`} sub={`${money(stats.budgetUsed, currency)} of ${money(stats.budgetTotal, currency)}`} />
        <Kpi label="Provider rating" value={`${stats.providerRating || "—"}/5`} sub={`${stats.reviewCount} reviews`} />
      </div>

      {/* breakdown + adoption */}
      <div className="grid" style={{ gridTemplateColumns: "1.25fr 1fr" }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span className="kick">Where the value comes from</span>
            <span className="pill" style={{ background: "rgba(26,22,16,.06)", color: "var(--muted)" }}>by category</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13, fontSize: 13 }}>
            {stats.categories.map((c, i) => (
              <div key={c.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>{c.name}</span>
                  <b>{money(c.value, currency)}</b>
                </div>
                <div className="meter">
                  <span style={{ width: `${Math.round((c.value / stats.categoryMax) * 100)}%`, background: i % 2 ? "var(--blue)" : "var(--orange)" }} />
                </div>
              </div>
            ))}
            {stats.categories.length === 0 && <div style={{ color: "var(--muted)" }}>No spend yet.</div>}
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span className="kick">Department adoption</span>
            <span className="pill" style={{ background: "rgba(31,91,224,.12)", color: "var(--blue-d)" }}>▲ engagement</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 13 }}>
            {stats.adoption.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 16, fontWeight: 700, color: i === 0 ? "var(--orange)" : "var(--muted)" }}>{i + 1}</span>
                <span style={{ flex: 1 }}>{d.name}</span>
                <span style={{ width: 90 }} className="meter">
                  <span style={{ width: `${d.pct}%`, background: i % 2 ? "var(--blue)" : "var(--orange)" }} />
                </span>
                <b style={{ width: 36, textAlign: "right" }}>{d.pct}%</b>
              </div>
            ))}
          </div>
          {stats.lowestDept && (
            <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 13, borderTop: "1px solid var(--line)", paddingTop: 10 }}>
              <i className="ti ti-bulb" style={{ color: "var(--orange)" }} /> Nudge {stats.lowestDept.name} with a team-pool drop to lift adoption
            </div>
          )}
        </div>
      </div>

      {/* payments feed */}
      <div className="card" style={{ padding: 18 }}>
        <div className="kick" style={{ marginBottom: 12 }}>Recent simulated payments to providers</div>
        {recentPayments.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted)" }}>No payments yet — approve a selection above.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recentPayments.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <i className="ti ti-circle-check" style={{ color: "#1f7a4d" }} />
                <span><b>{money(p.amount, currency)}</b> → {p.provider.name}</span>
                <span style={{ color: "var(--muted)" }}>for {p.order.user.name}</span>
                <span className="tnum" style={{ marginLeft: "auto", color: "var(--muted)" }}>{p.reference}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card" style={{ padding: 15 }}>
      <div className="kick">{label}</div>
      <div className="d" style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{sub}</div>
    </div>
  );
}
