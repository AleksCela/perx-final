import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { money } from "@/lib/money";
import { addMarketplaceOffer, removeMarketplaceOffer, restoreMarketplaceOffer } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function MarketplaceManagement() {
  await requireRole("ADMIN");

  const [offers, categories, providers] = await Promise.all([
    prisma.offer.findMany({
      include: {
        provider: true,
        category: true,
        _count: { select: { orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.provider.findMany({ orderBy: { name: "asc" } }),
  ]);

  const active = offers.filter((o) => o.active);
  const hidden = offers.filter((o) => !o.active);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="g" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
        <span className="pill" style={{ background: "var(--ink)", color: "#fff" }}>
          <i className="ti ti-building-store" /> Marketplace management
        </span>
        <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--muted)" }}>
          {active.length} live · {hidden.length} hidden
        </span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1.4fr", alignItems: "start", gap: 16 }}>
        {/* Add a suggested place */}
        <div className="card" style={{ padding: 18, position: "sticky", top: 12 }}>
          <div className="d" style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Suggest a place</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            Add an offer to the employee marketplace.
          </div>

          <form action={addMarketplaceOffer} style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <Field label="Offer title">
              <input name="title" required placeholder="e.g. Painting class for two" style={inputStyle} />
            </Field>

            <div style={{ display: "flex", gap: 11 }}>
              <Field label="Price (PX)" style={{ flex: 1 }}>
                <input name="price" type="number" min={0} defaultValue={20} required style={inputStyle} />
              </Field>
              <Field label="Category" style={{ flex: 1.4 }}>
                <select name="categoryId" required defaultValue="" style={inputStyle}>
                  <option value="" disabled>Choose…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Place (existing)">
              <select name="providerId" defaultValue="" style={inputStyle}>
                <option value="">— pick an existing place —</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>

            <Field label="…or add a new place">
              <input name="newProvider" placeholder="New place name (overrides above)" style={inputStyle} />
            </Field>

            <div style={{ display: "flex", gap: 11 }}>
              <Field label="Location" style={{ flex: 1 }}>
                <input name="location" placeholder="Blloku, Tirana" style={inputStyle} />
              </Field>
              <Field label="Mood tags" style={{ flex: 1 }}>
                <input name="moodTags" placeholder="calm,creative,date" style={inputStyle} />
              </Field>
            </div>

            <button type="submit" className="btn btn-ink" style={{ marginTop: 4 }}>
              <i className="ti ti-plus" /> Add to marketplace
            </button>
          </form>
        </div>

        {/* Current offers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span className="d" style={{ fontSize: 18, fontWeight: 700 }}>Live offers</span>
              <span className="pill" style={{ background: "rgba(33,160,90,.14)", color: "#1f7a4d" }}>{active.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {active.length === 0 && (
                <div style={{ fontSize: 13, color: "var(--muted)" }}>No live offers — add one on the left.</div>
              )}
              {active.map((o) => (
                <Row
                  key={o.id}
                  o={o}
                  action={removeMarketplaceOffer}
                  actionLabel={o._count.orderItems > 0 ? "Hide" : "Remove"}
                  actionIcon={o._count.orderItems > 0 ? "ti-eye-off" : "ti-trash"}
                />
              ))}
            </div>
          </div>

          {hidden.length > 0 && (
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span className="d" style={{ fontSize: 18, fontWeight: 700 }}>Hidden</span>
                <span className="pill" style={{ background: "rgba(26,22,16,.06)", color: "var(--muted)" }}>{hidden.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {hidden.map((o) => (
                  <Row key={o.id} o={o} action={restoreMarketplaceOffer} actionLabel="Restore" actionIcon="ti-restore" muted />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type OfferRow = {
  id: string;
  title: string;
  price: number;
  icon: string;
  provider: { name: string; color: string };
  category: { name: string };
  _count: { orderItems: number };
};

function Row({
  o, action, actionLabel, actionIcon, muted,
}: {
  o: OfferRow;
  action: (fd: FormData) => void;
  actionLabel: string;
  actionIcon: string;
  muted?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13.5, opacity: muted ? 0.6 : 1 }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: o.provider.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <i className={`ti ${o.icon}`} />
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.title}</div>
        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
          {o.provider.name} · {o.category.name}
          {o._count.orderItems > 0 && ` · ${o._count.orderItems} booked`}
        </div>
      </div>
      <span className="d" style={{ fontWeight: 700, width: 70, textAlign: "right" }}>{money(o.price)}</span>
      <form action={action}>
        <input type="hidden" name="offerId" value={o.id} />
        <button type="submit" className="btn btn-ghost" style={{ padding: "6px 11px", fontSize: 12.5 }}>
          <i className={`ti ${actionIcon}`} /> {actionLabel}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <span className="kick" style={{ fontSize: 10.5 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--line)",
  borderRadius: 10,
  padding: "9px 11px",
  fontSize: 13.5,
  fontFamily: "inherit",
  background: "#fff",
  color: "var(--ink)",
  outline: "none",
};
