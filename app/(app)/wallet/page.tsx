import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { tierForPoints } from "@/lib/points";
import BadgeWall from "../../components/BadgeWall";

export const dynamic = "force-dynamic";

const WAYS_TO_EARN = [
  { pts: 50, label: "Book a perk", color: "var(--orange)" },
  { pts: 25, label: "Review with photo", color: "var(--blue)" },
  { pts: 120, label: "Weekly spin", color: "var(--orange)" },
  { pts: 15, label: "Gift a teammate", color: "var(--blue)" },
  { pts: 200, label: "Refer a provider", color: "var(--orange)" },
  { pts: 80, label: "Win a step race", color: "var(--blue)" },
];

export default async function Wallet() {
  const user = await requireUser();
  const tier = tierForPoints(user.points);

  const [allBadges, earned, ledger, paidCount, steppers] = await Promise.all([
    prisma.badge.findMany(),
    prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true } }),
    prisma.pointsEntry.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.order.count({ where: { userId: user.id, status: "PAID" } }),
    prisma.user.findMany({
      where: { companyId: user.companyId!, role: "EMPLOYEE" },
      orderBy: { stepsThisWeek: "desc" },
      take: 5,
      select: { id: true, name: true, initials: true, color: true, stepsThisWeek: true },
    }),
  ]);

  const earnedSlugs = new Set(earned.map((e) => e.badge.slug));
  const stampFilled = paidCount % 10 || (paidCount > 0 ? 10 : 0);
  const topSteps = steppers[0]?.stepsThisWeek ?? 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div className="kick" style={{ color: "var(--blue-d)" }}>Wallet · earn</div>
          <div className="d" style={{ fontSize: 40, fontWeight: 600, lineHeight: 1, marginTop: 4 }}>Stack your points</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="d" style={{ fontSize: 38, fontWeight: 700, color: "var(--orange)", lineHeight: 1 }}>
            {user.points.toLocaleString("en-US")}
          </div>
          <div style={{ fontSize: 12, color: "var(--blue-d)", fontWeight: 500 }}>
            {tier.name}{tier.next ? ` · ${(tier.next - user.points).toLocaleString("en-US")} to ${tierForPoints(tier.next).name}` : " · max tier"}
          </div>
        </div>
      </div>

      {/* stamp card + ledger */}
      <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
        <div style={{ background: "var(--ink)", borderRadius: 18, padding: 20, color: "#FBF6EC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}><i className="ti ti-stamp" /> Stamp card</span>
            <span style={{ fontSize: 12, color: "rgba(251,246,236,.65)" }}>{stampFilled} / 10 → free perk</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 11 }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const done = i < stampFilled;
              const isReward = i === 9;
              return (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 600,
                    background: done ? "var(--orange)" : isReward ? "rgba(31,91,224,.3)" : "rgba(255,255,255,.1)",
                    border: done ? "none" : "1.5px dashed rgba(255,255,255,.4)",
                    color: "#fff",
                  }}
                >
                  {done ? "✓" : isReward ? "🎁" : i + 1}
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12.5, color: "rgba(251,246,236,.7)", marginTop: 14 }}>
            {10 - stampFilled} more booking{10 - stampFilled === 1 ? "" : "s"} unlocks a free perk on the house
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="kick" style={{ color: "var(--blue-d)", marginBottom: 12 }}>Recent points</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {ledger.length === 0 && <div style={{ fontSize: 13, color: "var(--muted)" }}>Earn points by booking, reviewing & spinning.</div>}
            {ledger.map((e) => (
              <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <span className="pill" style={{ background: "rgba(255,106,31,.14)", color: "var(--orange-d)" }}>+{e.amount}</span>
                <span style={{ flex: 1, color: "var(--ink)" }}>{e.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ways to earn */}
      <div className="card" style={{ padding: 18 }}>
        <div className="kick" style={{ color: "var(--blue-d)", marginBottom: 13 }}>Ways to earn</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 11, fontSize: 13.5 }}>
          {WAYS_TO_EARN.map((w) => (
            <div key={w.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span className="pill" style={{ background: w.color, color: "#fff" }}>+{w.pts}</span> {w.label}
            </div>
          ))}
        </div>
      </div>

      {/* badges + championship */}
      <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
            <span className="kick" style={{ color: "var(--blue-d)" }}>Badge wall · {earnedSlugs.size} of {allBadges.length}</span>
          </div>
          <BadgeWall badges={allBadges} earned={earnedSlugs} columns={6} />
        </div>

        <div className="card" style={{ padding: 18 }}>
          <span className="pill" style={{ background: "var(--blue)", color: "#fff" }}><i className="ti ti-trophy" /> Step championship</span>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9, fontSize: 13.5 }}>
            {steppers.map((s, i) => {
              const medal = ["🥇", "🥈", "🥉"][i] ?? `${i + 1}`;
              const me = s.id === user.id;
              return (
                <div key={s.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: me ? "var(--ink)" : "var(--muted)" }}>
                    <span>{medal} {me ? "You" : s.name.split(" ")[0]}</span>
                    <b>{s.stepsThisWeek.toLocaleString("en-US")}</b>
                  </div>
                  <div className="meter" style={{ marginTop: 5 }}>
                    <span style={{ width: `${Math.round((s.stepsThisWeek / topSteps) * 100)}%`, background: i % 2 ? "var(--blue)" : "var(--orange)" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>Leader wins the Marathon badge + 300 pts</div>
        </div>
      </div>
    </div>
  );
}
