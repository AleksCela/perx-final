import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getCartIds } from "@/lib/cart";
import { ratingOf } from "@/lib/catalog";
import { money } from "@/lib/money";
import { offerImage } from "@/lib/images";
import { REACTION_EMOJIS, GIFT_OPTIONS } from "@/lib/constants";
import Stars from "../../../components/Stars";
import {
  addToCart,
  bookOffer,
  toggleReaction,
  addReview,
  sendGift,
  chipInPool,
  referProvider,
} from "../../../actions";

export const dynamic = "force-dynamic";

export default async function OfferDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const currency = user.company?.currency ?? "EUR";

  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      provider: true,
      category: true,
      reviews: { include: { user: { include: { department: true } } }, orderBy: { createdAt: "desc" } },
      reactions: true,
      drop: true,
    },
  });
  if (!offer) notFound();

  const cartIds = new Set(await getCartIds());
  const inCart = cartIds.has(offer.id);
  const rating = ratingOf(offer.reviews);

  // reaction counts + whether the current user reacted
  const counts: Record<string, { n: number; mine: boolean }> = {};
  for (const e of REACTION_EMOJIS) counts[e] = { n: 0, mine: false };
  for (const r of offer.reactions) {
    counts[r.emoji] = counts[r.emoji] || { n: 0, mine: false };
    counts[r.emoji].n++;
    if (r.userId === user.id) counts[r.emoji].mine = true;
  }

  // trending today
  const dayAgo = new Date(Date.now() - 86400_000);
  const bookedToday = await prisma.orderItem.count({
    where: { offerId: offer.id, order: { createdAt: { gte: dayAgo } } },
  });

  const teammates = await prisma.user.findMany({
    where: { companyId: user.companyId!, role: "EMPLOYEE", id: { not: user.id } },
    include: { department: true },
    orderBy: { name: "asc" },
  });

  const pool = await prisma.teamPool.findFirst({
    where: { companyId: user.companyId! },
    include: { contributions: { include: { user: true } } },
  });
  const raised = pool?.contributions.reduce((s, c) => s + c.amount, 0) ?? 0;
  const members = pool ? new Set(pool.contributions.map((c) => c.userId)).size : 0;

  return (
    <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
      {/* detail */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ height: 180, position: "relative", display: "flex", alignItems: "flex-end", padding: 13 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={offerImage({ icon: offer.icon, categorySlug: offer.category.slug, seed: offer.id }, 960, 480)}
            alt={offer.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", background: offer.provider.color }}
          />
          <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,.5) 100%)" }} />
          {bookedToday > 0 ? (
            <span className="pill" style={{ position: "relative", background: "#fff", color: offer.provider.color }}>
              <i className="ti ti-flame" /> Trending in your office · {bookedToday} booked today
            </span>
          ) : (
            <span className="pill" style={{ position: "relative", background: "#fff", color: offer.provider.color }}>
              <i className={`ti ${offer.category.icon}`} /> {offer.category.name}
            </span>
          )}
          {offer.distanceKm != null && (
            <span className="pill" style={{ position: "absolute", top: 13, right: 13, background: "rgba(0,0,0,.4)", color: "#fff" }}>
              <i className="ti ti-map-pin" /> {offer.distanceKm}km
            </span>
          )}
        </div>

        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div className="d" style={{ fontSize: 24, fontWeight: 700 }}>{offer.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{offer.provider.name} · {offer.location || offer.provider.city}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Stars rating={rating} size={16} />
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{rating.toFixed(1)} · {offer.reviews.length} reviews</div>
            </div>
          </div>

          {offer.description && <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "12px 0 0" }}>{offer.description}</p>}

          {/* reactions */}
          <div style={{ display: "flex", gap: 8, margin: "14px 0", flexWrap: "wrap" }}>
            {REACTION_EMOJIS.map((e) => (
              <form action={toggleReaction} key={e}>
                <input type="hidden" name="offerId" value={offer.id} />
                <input type="hidden" name="emoji" value={e} />
                <button
                  type="submit"
                  className="pill"
                  style={{
                    border: counts[e].mine ? "1px solid var(--orange)" : "1px solid rgba(26,22,16,.15)",
                    background: counts[e].mine ? "rgba(255,106,31,.14)" : "transparent",
                    color: "var(--ink)",
                    cursor: "pointer",
                  }}
                >
                  {e} {counts[e].n > 0 ? counts[e].n : ""}
                </button>
              </form>
            ))}
          </div>

          {/* reviews */}
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 13 }}>
            {offer.reviews.length === 0 && (
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Be the first to review this perk.</div>
            )}
            {offer.reviews.slice(0, 4).map((r) => (
              <div key={r.id} style={{ display: "flex", gap: 11 }}>
                <span className="av" style={{ width: 28, height: 28, background: r.user.color, fontSize: 10.5 }}>{r.user.initials}</span>
                <div>
                  <div style={{ fontSize: 12.5 }}>
                    <b>{r.user.name.split(" ")[0]} {r.user.name.split(" ")[1]?.[0]}.</b>{" "}
                    <span style={{ color: "var(--muted)" }}>· {r.user.department?.name}</span>{" "}
                    <span style={{ color: "var(--orange)" }}>{"★".repeat(r.rating)}</span>
                  </div>
                  <div style={{ fontSize: 12.5, marginTop: 2 }}>{r.body}</div>
                  {r.helpfulCount > 0 && (
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                      <i className="ti ti-thumb-up" /> {r.helpfulCount} found helpful
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* add review */}
          <form action={addReview} className="card" style={{ padding: 12, marginTop: 14, display: "flex", flexDirection: "column", gap: 8, background: "#F5EFE3" }}>
            <input type="hidden" name="offerId" value={offer.id} />
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="kick">Leave a review</span>
              <select name="rating" className="input" style={{ width: "auto", marginLeft: "auto", padding: "6px 10px" }} defaultValue="5">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{"★".repeat(n)}</option>
                ))}
              </select>
            </div>
            <textarea name="body" required placeholder="How was it?" className="input" style={{ minHeight: 54, resize: "vertical" }} />
            <button type="submit" className="btn btn-blue" style={{ alignSelf: "flex-start" }}>
              <i className="ti ti-star" /> Post review (+25 pts)
            </button>
          </form>
        </div>

        {/* price footer */}
        <div style={{ margin: "0 16px 16px", display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", background: "rgba(255,106,31,.1)", borderRadius: 14, flexWrap: "wrap" }}>
          <span className="d" style={{ fontSize: 22, fontWeight: 700 }}>{money(offer.price, currency)}</span>
          <span style={{ fontSize: 11.5, color: "var(--blue-d)", fontWeight: 500 }}>employer-funded</span>
          <form action={addToCart} style={{ marginLeft: "auto" }}>
            <input type="hidden" name="offerId" value={offer.id} />
            <button type="submit" className={`btn ${inCart ? "btn-blue" : "btn-ghost"}`}>
              {inCart ? <><i className="ti ti-check" /> In combo</> : <><i className="ti ti-plus" /> Add to combo</>}
            </button>
          </form>
          <form action={bookOffer}>
            <input type="hidden" name="offerId" value={offer.id} />
            <button type="submit" className="btn btn-ink">Book now</button>
          </form>
        </div>
      </div>

      {/* social rail */}
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {/* gift */}
        <form action={sendGift} className="card" style={{ padding: 15 }}>
          <div className="kick" style={{ marginBottom: 9 }}>Gift a teammate</div>
          <input type="hidden" name="offerId" value={offer.id} />
          <select name="toUserId" required className="input" style={{ marginBottom: 10 }} defaultValue="">
            <option value="" disabled>Choose a teammate…</option>
            {teammates.map((t) => (
              <option key={t.id} value={t.id}>{t.name} · {t.department?.name}</option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
            {GIFT_OPTIONS.map((g, i) => (
              <label key={g.label} className="pill" style={{ background: i === 0 ? "rgba(255,106,31,.14)" : "rgba(31,91,224,.12)", color: i === 0 ? "var(--orange-d)" : "var(--blue-d)", cursor: "pointer" }}>
                <input type="radio" name="giftValue" value={`${g.label}|${g.amount}`} defaultChecked={i === 0} style={{ accentColor: "var(--orange)" }} />
                {g.emoji} {g.label} {money(g.amount, currency)}
              </label>
            ))}
          </div>
          <input name="message" placeholder="Add a note…" className="input" style={{ marginBottom: 10 }} />
          <button type="submit" className="btn btn-orange" style={{ width: "100%" }}>Send from my budget (+15 pts)</button>
        </form>

        {/* pool */}
        {pool && (
          <form action={chipInPool} className="card" style={{ padding: 15 }}>
            <input type="hidden" name="poolId" value={pool.id} />
            <input type="hidden" name="amount" value="40" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
              <span className="kick">Team pool · {pool.name}</span>
              <span className="pill" style={{ background: "rgba(31,91,224,.12)", color: "var(--blue-d)" }}>{members} in</span>
            </div>
            <div className="d" style={{ fontSize: 20, fontWeight: 700 }}>
              {money(raised, currency)} <span style={{ fontSize: 12, color: "var(--muted)" }}>of {money(pool.goal, currency)}</span>
            </div>
            <div className="meter" style={{ margin: "8px 0" }}>
              <span style={{ width: `${Math.min(100, Math.round((raised / pool.goal) * 100))}%`, background: "var(--orange)" }} />
            </div>
            <button type="submit" className="btn btn-ink" style={{ width: "100%" }}>Chip in {money(40, currency)}</button>
          </form>
        )}

        {/* referral */}
        <form action={referProvider} className="card" style={{ padding: 15 }}>
          <div className="kick" style={{ marginBottom: 7 }}>Refer a local spot</div>
          <div style={{ fontSize: 12.5, marginBottom: 10 }}>
            Know a great café or studio? Suggest it — earn <b style={{ color: "var(--orange-d)" }}>+200 pts</b> when they join.
          </div>
          <input name="name" required placeholder="Café name or link…" className="input" style={{ marginBottom: 10 }} />
          <button type="submit" className="btn btn-blue" style={{ width: "100%" }}>Send suggestion</button>
        </form>

        <Link href="/marketplace" className="navlink" style={{ color: "var(--blue-d)" }}>← Back to marketplace</Link>
      </div>
    </div>
  );
}
