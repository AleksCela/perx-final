import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { voteRequest, submitRequest } from "../../actions";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  OPEN: { label: "Gathering votes", bg: "rgba(26,22,16,.06)", color: "var(--muted)", icon: "ti-progress" },
  PLANNED: { label: "Planned", bg: "rgba(31,91,224,.12)", color: "var(--blue-d)", icon: "ti-calendar" },
  LIVE: { label: "Now live", bg: "rgba(255,106,31,.14)", color: "var(--orange-d)", icon: "ti-circle-check" },
  DECLINED: { label: "Not right now", bg: "rgba(26,22,16,.06)", color: "var(--muted)", icon: "ti-x" },
};

export default async function Requests() {
  const user = await requireUser();

  const [requests, categories] = await Promise.all([
    prisma.perkRequest.findMany({
      where: { companyId: user.companyId! },
      include: {
        createdBy: { select: { name: true, initials: true, color: true } },
        _count: { select: { votes: true } },
        votes: { where: { userId: user.id }, select: { id: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  requests.sort((a, b) => b._count.votes - a._count.votes || a.title.localeCompare(b.title));

  const topVotes = requests[0]?._count.votes || 1;
  const liveCount = requests.filter((r) => r.status === "LIVE").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="g" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", flexWrap: "wrap" }}>
        <span className="d" style={{ fontSize: 18, fontWeight: 700 }}>Perk wishlist</span>
        <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}><i className="ti ti-bulb" /> You decide what&apos;s next</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>
          Vote for perks you want — HR sees the demand and adds the most-wanted. {liveCount > 0 ? `${liveCount} already shipped.` : ""}
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.55fr 1fr", alignItems: "start" }}>
        {/* wishlist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {requests.map((r, i) => {
            const voted = r.votes.length > 0;
            const st = STATUS[r.status] ?? STATUS.OPEN;
            return (
              <div key={r.id} className="card hover-lift" style={{ padding: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
                {/* vote */}
                <form action={voteRequest}>
                  <input type="hidden" name="requestId" value={r.id} />
                  <button
                    type="submit"
                    style={{
                      width: 64,
                      padding: "10px 0",
                      borderRadius: 14,
                      border: voted ? "1px solid var(--orange)" : "1px solid var(--line)",
                      background: voted ? "var(--orange)" : "#fffdf8",
                      color: voted ? "#fff" : "var(--ink)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      fontFamily: "inherit",
                    }}
                  >
                    <i className="ti ti-chevron-up" style={{ fontSize: 18 }} />
                    <b className="d" style={{ fontSize: 18 }}>{r._count.votes}</b>
                  </button>
                </form>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,106,31,.12)", color: "var(--orange-d)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                      <i className={`ti ${r.icon}`} style={{ fontSize: 18 }} />
                    </span>
                    <span className="d" style={{ fontSize: 18, fontWeight: 700 }}>{r.title}</span>
                    <span className="pill" style={{ background: st.bg, color: st.color }}><i className={`ti ${st.icon}`} /> {st.label}</span>
                    {i === 0 && <span className="pill" style={{ background: "var(--ink)", color: "#fff" }}>#1 most wanted</span>}
                  </div>
                  {r.description && <div style={{ fontSize: 13.5, color: "var(--muted)", margin: "8px 0 0" }}>{r.description}</div>}
                  <div className="meter" style={{ height: 6, margin: "10px 0 8px" }}>
                    <span style={{ width: `${Math.round((r._count.votes / topVotes) * 100)}%`, background: i % 2 ? "var(--blue)" : "var(--orange)" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
                    <span className="av" style={{ width: 20, height: 20, fontSize: 9, background: r.createdBy?.color ?? "var(--blue)" }}>{r.createdBy?.initials ?? "—"}</span>
                    Suggested by {r.createdBy?.name?.split(" ")[0] ?? "a teammate"}
                    {r.note && <span style={{ color: "var(--blue-d)" }}>· HR: “{r.note}”</span>}
                  </div>
                </div>
              </div>
            );
          })}
          {requests.length === 0 && (
            <div className="card" style={{ padding: 24, color: "var(--muted)" }}>No ideas yet — be the first to suggest a perk.</div>
          )}
        </div>

        {/* submit + how it works */}
        <div style={{ display: "flex", flexDirection: "column", gap: 13, position: "sticky", top: 90 }}>
          <form action={submitRequest} className="card" style={{ padding: 16 }}>
            <div className="kick" style={{ marginBottom: 10 }}>Suggest a perk</div>
            <input name="title" required maxLength={100} placeholder="e.g. Padel court membership" className="input" style={{ marginBottom: 10 }} />
            <select name="category" className="input" style={{ marginBottom: 10 }} defaultValue="">
              <option value="">Category (optional)…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <textarea name="description" maxLength={300} placeholder="Why would the team love it?" className="input" style={{ minHeight: 70, resize: "vertical", marginBottom: 10 }} />
            <button type="submit" className="btn btn-orange" style={{ width: "100%" }}>
              <i className="ti ti-send" /> Submit to employer (+20 pts)
            </button>
          </form>

          <div className="card" style={{ padding: 16 }}>
            <div className="kick" style={{ marginBottom: 10 }}>How it works</div>
            {[
              { i: "ti-bulb", t: "Anyone can suggest a perk in seconds." },
              { i: "ti-chevron-up", t: "The team upvotes the ideas they want." },
              { i: "ti-building", t: "HR sees the ranked demand on their dashboard." },
              { i: "ti-circle-check", t: "Top ideas get planned and go live." },
            ].map((s) => (
              <div key={s.t} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, margin: "9px 0" }}>
                <i className={`ti ${s.i}`} style={{ color: "var(--orange)", fontSize: 18 }} /> {s.t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
