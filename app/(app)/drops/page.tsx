import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { money } from "@/lib/money";
import { offerImage } from "@/lib/images";
import { claimDrop } from "../../actions";
import Countdown from "../../components/Countdown";
import MysteryBox from "../../components/MysteryBox";

export const dynamic = "force-dynamic";

export default async function Drops({ searchParams }: { searchParams: Promise<{ soldout?: string }> }) {
  const { soldout } = await searchParams;
  const user = await requireUser();
  const currency = user.company?.currency ?? "EUR";

  const drops = await prisma.drop.findMany({
    include: { offer: { include: { provider: true, category: true } } },
    orderBy: [{ headline: "desc" }, { expiresAt: "asc" }],
  });

  const headline = drops.find((d) => d.headline);
  const rest = drops.filter((d) => !d.headline);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div className="g" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
        <span className="d" style={{ fontSize: 18, fontWeight: 700 }}>Friday Drops</span>
        <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}><i className="ti ti-bolt" /> Live now</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }}>Limited-time deals · a weekly reason to check back</span>
      </div>

      {soldout && (
        <div className="card" style={{ padding: 14, background: "rgba(178,60,10,.08)", fontSize: 13.5 }}>
          That drop just sold out — grab another below or come back for the next drop.
        </div>
      )}

      {headline && (
        <div style={{ background: "var(--orange)", borderRadius: 20, padding: 20, color: "#fff", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", gap: 16, flexWrap: "wrap" }}>
          <div style={{ position: "absolute", right: -30, bottom: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,.12)" }} />
          <div style={{ flex: 1, position: "relative", minWidth: 240 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)" }}>This week&apos;s headline drop</div>
            <div className="d" style={{ fontSize: 30, fontWeight: 700, margin: "4px 0" }}>{headline.offer.title} — half budget</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.85)" }}>
              {headline.quantityClaimed} of {headline.quantityTotal} claimed · everyone in the office can see this
            </div>
          </div>
          <div style={{ textAlign: "center", position: "relative", padding: "0 18px" }}>
            <div className="kick" style={{ color: "rgba(255,255,255,.8)" }}>Expires in</div>
            <div className="d" style={{ fontSize: 32, fontWeight: 800 }}>
              <Countdown expires={headline.expiresAt.toISOString()} />
            </div>
          </div>
          <form action={claimDrop} style={{ position: "relative" }}>
            <input type="hidden" name="offerId" value={headline.offerId} />
            <button type="submit" className="btn btn-ink" style={{ fontSize: 14, padding: "13px 22px" }}>
              Claim · {money(headline.dropPrice, currency)}
            </button>
          </form>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {rest.map((d) => {
          const left = d.quantityTotal - d.quantityClaimed;
          const soldOut = left <= 0;
          return (
            <div key={d.id} className="card hover-lift" style={{ padding: 0, overflow: "hidden", opacity: soldOut ? 0.65 : 1 }}>
              <div style={{ height: 96, position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: 10 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={offerImage({ icon: d.offer.icon, categorySlug: d.offer.category.slug, seed: d.offer.id })}
                  alt={d.offer.title}
                  loading="lazy"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: d.offer.provider.color, filter: soldOut ? "grayscale(1)" : "none" }}
                />
                <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 60%)" }} />
                <span className="pill" style={{ position: "relative", background: "#fff", color: d.offer.provider.color }}>−{d.discountPct}%</span>
                <span className="pill" style={{ position: "relative", background: "rgba(0,0,0,.4)", color: "#fff" }}>
                  {soldOut ? "Gone" : <Countdown expires={d.expiresAt.toISOString()} />}
                </span>
              </div>
              <div style={{ padding: 13 }}>
                <div className="d" style={{ fontSize: 16, fontWeight: 600 }}>{d.offer.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", margin: "3px 0 9px" }}>
                  {soldOut ? "Sold out · next drop soon" : `${left} left · ${d.offer.provider.name}`}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="d" style={{ fontSize: 18, fontWeight: 700, textDecoration: soldOut ? "line-through" : "none", color: soldOut ? "var(--muted)" : "var(--ink)" }}>
                    {money(d.dropPrice, currency)}
                  </span>
                  <span style={{ fontSize: 12, textDecoration: "line-through", color: "var(--muted)" }}>{money(d.offer.price, currency)}</span>
                  {soldOut ? (
                    <span className="pill" style={{ marginLeft: "auto", background: "rgba(26,22,16,.1)", color: "var(--muted)" }}>Notify me</span>
                  ) : (
                    <form action={claimDrop} style={{ marginLeft: "auto" }}>
                      <input type="hidden" name="offerId" value={d.offerId} />
                      <button type="submit" className="btn btn-orange" style={{ padding: "8px 14px", fontSize: 13 }}>Claim</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* mystery */}
      <div id="mystery" style={{ scrollMarginTop: 90 }}>
        <div className="section-label">Delight · mystery box</div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1.3fr", alignItems: "center" }}>
          <MysteryBox currency={currency} />
          <div className="card" style={{ padding: 22 }}>
            <div className="d" style={{ fontSize: 24, fontWeight: 700 }}>A wrapped surprise, always within budget</div>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>
              Open the box for a randomly selected perk you can afford — on the house this time.
              It lands in your orders, pending a quick approval, and earns you the <b>Mystery fan</b> badge.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              <span className="pill" style={{ background: "rgba(255,106,31,.14)", color: "var(--orange-d)" }}><i className="ti ti-gift" /> Free perk</span>
              <span className="pill" style={{ background: "rgba(31,91,224,.12)", color: "var(--blue-d)" }}>+75 pts</span>
              <span className="pill" style={{ background: "rgba(26,22,16,.06)", color: "var(--muted)" }}>Within your budget</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
