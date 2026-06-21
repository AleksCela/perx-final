import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getDeptStandings } from "@/lib/insights";
import SpinWheel from "../../components/SpinWheel";
import BadgeWall from "../../components/BadgeWall";
import StepChallenge from "../../components/StepChallenge";
import WorldCup from "../../components/WorldCup";

export const dynamic = "force-dynamic";

export default async function Play() {
  const user = await requireUser();
  const weekMs = 7 * 24 * 3600 * 1000;
  const canSpin = !user.lastSpinAt || Date.now() - new Date(user.lastSpinAt).getTime() >= weekMs;

  const [standings, allBadges, earned, stepUsers] = await Promise.all([
    getDeptStandings(user.companyId!),
    prisma.badge.findMany(),
    prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true } }),
    prisma.user.findMany({
      where: { companyId: user.companyId!, role: "EMPLOYEE" },
      select: { id: true, name: true, initials: true, color: true, stepsThisWeek: true, department: { select: { name: true } } },
      orderBy: { stepsThisWeek: "desc" },
    }),
  ]);
  const earnedSlugs = new Set(earned.map((e) => e.badge.slug));
  const topPts = standings[0]?.points || 1;
  const myDept = user.department?.name;

  const stepEntries = stepUsers.map((u) => ({
    id: u.id,
    name: u.name,
    initials: u.initials,
    color: u.color,
    dept: u.department?.name ?? "—",
    steps: u.stepsThisWeek,
    isMe: u.id === user.id,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div className="kick" style={{ color: "var(--orange-d)" }}>Play · earn · compete</div>
        <h1 className="d" style={{ fontSize: 36, fontWeight: 700, margin: "4px 0 0" }}>Make it a habit, not a chore</h1>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1.15fr", alignItems: "stretch" }}>
        <SpinWheel canSpin={canSpin} />

        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span className="kick">Team vs team · this week</span>
            <span className="pill" style={{ background: "rgba(255,106,31,.14)", color: "var(--orange-d)" }}><i className="ti ti-trophy" /> 500 PX pool</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13, fontSize: 13 }}>
            {standings.map((d, i) => {
              const medal = ["🥇", "🥈", "🥉"][i] ?? `${i + 1} ·`;
              const mine = d.name === myDept;
              return (
                <div key={d.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: i < 3 ? "var(--ink)" : "var(--muted)" }}>
                    <span style={{ fontWeight: mine ? 700 : 400 }}>{medal} {d.name}{mine ? " (you)" : ""}</span>
                    <b>{d.points.toLocaleString("en-US")} pts</b>
                  </div>
                  <div className="meter" style={{ height: 10 }}>
                    <span style={{ width: `${Math.round((d.points / topPts) * 100)}%`, background: i % 2 ? "var(--blue)" : "var(--orange)" }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 13, borderTop: "1px solid var(--line)", paddingTop: 10 }}>
            <i className="ti ti-flag" style={{ color: "var(--orange)" }} /> Winning team splits a 500 PX shared perk pool
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
          <span className="kick">Achievement wall · {earnedSlugs.size} of {allBadges.length} earned</span>
          <span className="pill" style={{ background: "rgba(255,106,31,.14)", color: "var(--orange-d)" }}>{user.points.toLocaleString("en-US")} pts</span>
        </div>
        <BadgeWall badges={allBadges} earned={earnedSlugs} columns={8} />
      </div>

      <StepChallenge entries={stepEntries} />

      <WorldCup />
    </div>
  );
}
