import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getBudget } from "@/lib/budget";
import { getCartIds } from "@/lib/cart";
import { money } from "@/lib/money";
import { submitCart, removeFromCart, clearCart } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Cart() {
  const user = await requireUser();
  const currency = user.company?.currency ?? "EUR";
  const budget = await getBudget(user.id);
  const ids = await getCartIds();
  const offers = ids.length
    ? await prisma.offer.findMany({ where: { id: { in: ids } }, include: { provider: true, category: true } })
    : [];
  const ordered = ids.map((id) => offers.find((o) => o.id === id)).filter(Boolean) as typeof offers;
  const total = ordered.reduce((s, o) => s + o.price, 0);
  const providers = new Set(ordered.map((o) => o.providerId)).size;
  const afterRemaining = Math.max(0, budget.remaining - total);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="kick" style={{ color: "var(--orange-d)", marginBottom: 8 }}>Your selection</div>
      <h1 className="d" style={{ fontSize: 36, fontWeight: 700, margin: "0 0 6px" }}>Review your combo</h1>
      <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 0 }}>
        Submit it and your employer approves — payment then routes to each provider. The money never passes through your hands.
      </p>

      {ordered.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center", marginTop: 20 }}>
          <div style={{ fontSize: 44 }}>🛍️</div>
          <div className="d" style={{ fontSize: 20, fontWeight: 700, marginTop: 10 }}>Your combo is empty</div>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>Add perks from the marketplace or ask the concierge to build one.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14 }}>
            <Link href="/marketplace" className="btn btn-ink">Browse perks</Link>
            <Link href="/concierge" className="btn btn-ghost">Ask concierge</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="card" style={{ marginTop: 18, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="d" style={{ fontWeight: 700, fontSize: 16 }}>{ordered.length} perks · {providers} providers</span>
              <form action={clearCart}>
                <button type="submit" className="navlink" style={{ color: "var(--muted)" }}>Clear all</button>
              </form>
            </div>
            {ordered.map((o, idx) => (
              <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: idx < ordered.length - 1 ? "1px solid rgba(26,22,16,.08)" : "none" }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: o.provider.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                  <i className={`ti ${o.icon}`} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 500 }}>{o.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{o.provider.name} · {o.category.name}</div>
                </div>
                <span className="d" style={{ fontSize: 16, fontWeight: 600 }}>{money(o.price, currency)}</span>
                <form action={removeFromCart}>
                  <input type="hidden" name="offerId" value={o.id} />
                  <button type="submit" className="btn btn-ghost" style={{ padding: "6px 9px" }} aria-label="Remove">
                    <i className="ti ti-x" />
                  </button>
                </form>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: 14, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: "var(--muted)" }}>Combo total</span>
              <b className="d" style={{ fontSize: 20 }}>{money(total, currency)}</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)" }}>
              <span>Budget after approval</span>
              <span>{money(afterRemaining, currency)} of {money(budget.total, currency)}</span>
            </div>
            <div className="meter" style={{ margin: "10px 0 16px" }}>
              <span style={{ width: `${budget.total ? Math.round((afterRemaining / budget.total) * 100) : 0}%`, background: "var(--orange)" }} />
            </div>
            <form action={submitCart}>
              <button type="submit" className="btn btn-ink" style={{ width: "100%", padding: 14 }}>
                <i className="ti ti-send" /> Submit {providers > 1 ? `${providers}-provider package` : "selection"} for approval
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
