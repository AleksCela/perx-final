import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getBudget } from "@/lib/budget";
import { getOfferLikes } from "@/lib/catalog";
import { buildCombo } from "@/lib/planner";
import { money } from "@/lib/money";
import { bookCombo } from "../../actions";

export const dynamic = "force-dynamic";

const EXAMPLES = [
  "I'm wired and stressed before a launch — something calming this weekend under €60",
  "Fun active day out with the team, around €50",
  "Cosy Sunday reset, under €40",
  "Treat my partner to a date night, up to €80",
  "Learn something new this month, budget €50",
];

export default async function Planner({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const user = await requireUser();
  const currency = user.company?.currency ?? "EUR";
  const taxRate = user.company?.taxRate ?? 0.41;
  const budget = await getBudget(user.id);
  const offerLikes = await getOfferLikes();

  const query = (q ?? "").trim();
  const combo = query ? buildCombo(offerLikes, query, budget.remaining || 480, taxRate) : null;
  const afterRemaining = combo ? Math.max(0, budget.remaining - combo.total) : budget.remaining;
  const usedPct = budget.total ? Math.round(((budget.total - afterRemaining) / budget.total) * 100) : 0;

  return (
    <div>
      <div className="g" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", marginBottom: 18 }}>
        <span className="pill" style={{ background: "var(--ink)", color: "#fff" }}>
          <i className="ti ti-sparkles" /> AI Planner
        </span>
        <span style={{ fontSize: 13.5, color: "var(--muted)" }}>Type a feeling and a budget — I build a cross-provider combo.</span>
        <span className="pill" style={{ marginLeft: "auto", background: "var(--orange)", color: "#fff" }}>
          <i className="ti ti-ticket" /> {money(budget.remaining, currency)} budget
        </span>
      </div>

      {/* Search */}
      <form action="/planner" method="get" className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px 8px 20px", marginBottom: 18, borderRadius: 999 }}>
        <i className="ti ti-sparkles" style={{ color: "var(--orange)", fontSize: 20 }} />
        <input name="q" defaultValue={query} placeholder="“something calming this weekend, under €60”…" className="input" style={{ border: "none", background: "transparent", padding: "10px 0", flex: 1 }} autoFocus />
        <button type="submit" className="btn btn-ink">
          Build combo <i className="ti ti-arrow-right" />
        </button>
      </form>

      {!combo && (
        <div className="card" style={{ padding: 24 }}>
          <div className="kick" style={{ marginBottom: 12 }}>Try saying…</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {EXAMPLES.map((ex) => (
              <Link key={ex} href={`/planner?q=${encodeURIComponent(ex)}`} className="card hover-lift" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <i className="ti ti-message-chatbot" style={{ color: "var(--orange)" }} />
                <span style={{ fontSize: 14.5 }}>{ex}</span>
                <i className="ti ti-arrow-right" style={{ marginLeft: "auto", color: "var(--muted)" }} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {combo && (
        <div className="grid" style={{ gridTemplateColumns: "1.5fr .9fr", alignItems: "start" }}>
          <div>
            {/* user message */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <div style={{ background: "var(--ink)", color: "#FBF6EC", borderRadius: "16px 16px 4px 16px", padding: "12px 16px", maxWidth: "80%", fontSize: 14.5 }}>
                {query}
              </div>
            </div>
            {/* AI message */}
            <div style={{ display: "flex", gap: 10 }}>
              <span className="pill" style={{ background: "var(--orange)", color: "#fff", height: "fit-content", marginTop: 2 }}>
                <i className="ti ti-sparkles" />
              </span>
              <div style={{ flex: 1 }}>
                <div className="card" style={{ padding: "13px 16px", fontSize: 14, borderRadius: "4px 16px 16px 16px" }}>
                  Got it — I built a {combo.items.length}-stop {combo.name.toLowerCase()} across providers.
                  {combo.rating > 0 && <> People with a profile like yours rate this combo <b>{combo.rating.toFixed(1)}</b>.</>}
                  {combo.moods.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginTop: 9, flexWrap: "wrap" }}>
                      {combo.moods.map((m) => (
                        <span key={m} className="pill" style={{ background: "rgba(255,106,31,.14)", color: "var(--orange-d)" }}>{m}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* combo card */}
                <div className="card" style={{ marginTop: 10, overflow: "hidden" }}>
                  <div style={{ padding: "12px 15px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="d" style={{ fontSize: 17, fontWeight: 700 }}>Your “{combo.name}” combo</span>
                    <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}>
                      {new Set(combo.items.map((i) => i.providerId)).size} providers
                    </span>
                  </div>
                  {combo.items.map((it, idx) => (
                    <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 15px", borderBottom: idx < combo.items.length - 1 ? "1px solid rgba(26,22,16,.08)" : "none" }}>
                      <span style={{ width: 36, height: 36, borderRadius: 9, background: idx % 2 ? "var(--blue)" : "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                        <i className={`ti ${it.icon}`} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{it.title}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
                          {it.providerName}{it.location ? ` · ${it.location}` : ""}
                        </div>
                      </div>
                      <span className="d" style={{ fontSize: 16, fontWeight: 600 }}>{money(it.price, currency)}</span>
                    </div>
                  ))}
                  <div style={{ padding: "12px 15px", background: "rgba(255,106,31,.1)", display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
                    <span className="d" style={{ fontSize: 20, fontWeight: 700 }}>{money(combo.total, currency)} total</span>
                    {combo.underBudget >= 0 ? (
                      <span className="pill" style={{ background: "rgba(31,91,224,.12)", color: "var(--blue-d)" }}>
                        {money(combo.underBudget, currency)} under budget
                      </span>
                    ) : (
                      <span className="pill" style={{ background: "rgba(178,60,10,.14)", color: "var(--orange-d)" }}>over budget</span>
                    )}
                    <form action={bookCombo} style={{ marginLeft: "auto" }}>
                      <input type="hidden" name="offerIds" value={combo.items.map((i) => i.id).join(",")} />
                      <input type="hidden" name="title" value={`${combo.name} combo`} />
                      <input type="hidden" name="reasoning" value={combo.reasoning.join(" · ")} />
                      <button type="submit" className="btn btn-ink">
                        Book all {combo.items.length} <i className="ti ti-arrow-right" />
                      </button>
                    </form>
                  </div>
                </div>

                {/* refine */}
                <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
                  <Link href={`/planner?q=${encodeURIComponent(query + " cheaper")}`} className="pill" style={{ border: "1px solid rgba(26,22,16,.25)", color: "var(--ink)" }}>Make it cheaper</Link>
                  <Link href={`/planner?q=${encodeURIComponent(query + " social")}`} className="pill" style={{ border: "1px solid rgba(26,22,16,.25)", color: "var(--ink)" }}>More social</Link>
                  <Link href={`/planner?q=${encodeURIComponent(query + " active")}`} className="pill" style={{ border: "1px solid rgba(26,22,16,.25)", color: "var(--ink)" }}>More active</Link>
                </div>
              </div>
            </div>
          </div>

          {/* right rail */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "var(--ink)", color: "#FBF6EC", borderRadius: 18, padding: 15 }}>
              <div className="kick" style={{ color: "rgba(251,246,236,.6)", marginBottom: 6 }}>Budget after combo</div>
              <div className="d" style={{ fontSize: 28, fontWeight: 700 }}>
                {money(afterRemaining, currency)} <span style={{ fontSize: 13, color: "rgba(251,246,236,.6)" }}>left</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,.14)", borderRadius: 9, marginTop: 9 }}>
                <div style={{ width: `${usedPct}%`, height: "100%", background: "var(--orange)", borderRadius: 9 }} />
              </div>
              <div style={{ fontSize: 11, color: "rgba(251,246,236,.6)", marginTop: 6 }}>
                {money(budget.total - afterRemaining, currency)} of {money(budget.total, currency)} used
              </div>
            </div>

            <div className="card" style={{ padding: 15 }}>
              <div className="kick" style={{ marginBottom: 9 }}>Why this, for you</div>
              <div style={{ fontSize: 12.5, display: "flex", flexDirection: "column", gap: 9 }}>
                {combo.reasoning.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <i className="ti ti-circle-check" style={{ color: i % 2 ? "var(--blue)" : "var(--orange)" }} /> {r}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--orange)", color: "#fff", borderRadius: 18, padding: 15 }}>
              <div className="kick" style={{ color: "rgba(255,255,255,.85)", marginBottom: 5 }}>Earn while you relax</div>
              <div style={{ fontSize: 12.5 }}>
                Booking a {new Set(combo.items.map((i) => i.providerId)).size}-provider combo unlocks the <b>Curator</b> badge + 90 pts.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
