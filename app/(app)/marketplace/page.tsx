import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getBudget } from "@/lib/budget";
import { getCartIds } from "@/lib/cart";
import { getOfferLikes, ratingOf } from "@/lib/catalog";
import { getDeptStandings } from "@/lib/insights";
import { buildCombo } from "@/lib/planner";
import { money } from "@/lib/money";
import OfferCard, { type CardOffer } from "../../components/OfferCard";
import Countdown from "../../components/Countdown";

export const dynamic = "force-dynamic";

export default async function Marketplace({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const user = await requireUser();
  const currency = user.company?.currency ?? "EUR";
  const taxRate = user.company?.taxRate ?? 0.41;
  const budget = await getBudget(user.id);
  const cartIds = new Set(await getCartIds());
  const firstName = user.name.split(" ")[0];

  const [categories, offers, offerLikes, standings, badgeCount] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.offer.findMany({
      where: { active: true, ...(cat ? { category: { slug: cat } } : {}) },
      include: {
        provider: true,
        category: true,
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    getOfferLikes(),
    getDeptStandings(user.companyId!),
    user.companyId
      ? prisma.userBadge.count({ where: { userId: user.id } })
      : Promise.resolve(0),
  ]);

  const headline = await prisma.drop.findFirst({
    where: { headline: true },
    include: { offer: { include: { provider: true } } },
  });

  const cardOffers: CardOffer[] = offers.map((o) => ({
    id: o.id,
    title: o.title,
    icon: o.icon,
    price: o.price,
    originalPrice: o.originalPrice,
    providerName: o.provider.name,
    providerColor: o.provider.color,
    categoryName: o.category.name,
    location: o.location,
    distanceKm: o.distanceKm,
    rating: ratingOf(o.reviews),
    reviewCount: o._count.reviews,
  }));

  // Featured AI bundle (computed live by the planner engine).
  const bundle = buildCombo(offerLikes, "friday wind-down, calm and social", Math.min(70, budget.remaining || 70), taxRate);

  // Live activity — department-level social proof.
  const recentOrders = await prisma.order.findMany({
    where: { status: { in: ["PAID", "PENDING"] }, user: { companyId: user.companyId! } },
    include: { user: { include: { department: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const top = standings[0];
  const second = standings[1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Hero */}
      <div>
        <div className="kick" style={{ color: "var(--orange-d)", marginBottom: 10 }}>
          Good day, {firstName} — {badgeCount} badges · {money(budget.remaining, currency)} to spend
        </div>
        <h1 className="d" style={{ fontSize: 56, lineHeight: 0.92, fontWeight: 700, margin: 0, maxWidth: 640 }}>
          Don&apos;t browse perks.
          <br />
          <span style={{ color: "var(--orange)" }}>Describe a feeling.</span>
        </h1>

        <form action="/planner" method="get" className="card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px 8px 20px", margin: "22px 0 4px", maxWidth: 660, borderRadius: 999 }}>
          <i className="ti ti-sparkles" style={{ color: "var(--orange)", fontSize: 20 }} />
          <input
            name="q"
            defaultValue=""
            placeholder="“cosy Sunday reset, under €40”…"
            className="input"
            style={{ border: "none", background: "transparent", padding: "10px 0", flex: 1 }}
          />
          <button type="submit" className="btn btn-ink">
            Build my combo <i className="ti ti-arrow-right" />
          </button>
        </form>
      </div>

      {/* Drop + AI bundle */}
      <div className="grid" style={{ gridTemplateColumns: "1.45fr 1fr" }}>
        {headline && (
          <div style={{ background: "var(--orange)", borderRadius: 22, padding: 24, position: "relative", overflow: "hidden", color: "#fff" }}>
            <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.13)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
              <span className="pill" style={{ background: "#fff", color: "var(--orange-d)" }}>
                <i className="ti ti-bolt" /> Friday drop
              </span>
              <span className="d" style={{ fontSize: 26, fontWeight: 600 }}>
                <Countdown expires={headline.expiresAt.toISOString()} />
              </span>
            </div>
            <div className="d" style={{ fontSize: 34, fontWeight: 700, lineHeight: 0.98, margin: "26px 0 8px", position: "relative" }}>
              {headline.offer.title}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.88)", position: "relative" }}>
              {headline.quantityTotal - headline.quantityClaimed} left · expires tonight
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 13, marginTop: 20, position: "relative" }}>
              <span className="d" style={{ fontSize: 42, fontWeight: 800 }}>{money(headline.dropPrice, currency)}</span>
              <span style={{ fontSize: 15, textDecoration: "line-through", color: "rgba(255,255,255,.6)" }}>
                {money(headline.offer.price, currency)}
              </span>
              <Link href="/drops" className="btn btn-ink" style={{ marginLeft: "auto" }}>
                Claim now
              </Link>
            </div>
          </div>
        )}

        <div style={{ background: "var(--blue)", borderRadius: 22, padding: 22, display: "flex", flexDirection: "column", color: "#fff" }}>
          <span className="pill" style={{ background: "rgba(255,255,255,.2)", color: "#fff", alignSelf: "flex-start" }}>
            <i className="ti ti-wand" /> AI bundle
          </span>
          <div className="d" style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.02, margin: "16px 0 9px" }}>
            The “{bundle.name}” pack
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)" }}>
            {bundle.items.map((i) => i.title.split(" · ")[0]).join(" + ")} — picked for your vibe.
          </div>
          <div style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 11, paddingTop: 18 }}>
            <span className="d" style={{ fontSize: 32, fontWeight: 800 }}>{money(bundle.total, currency)}</span>
            <span style={{ fontSize: 12.5, color: "rgba(255,255,255,.85)" }}>saves {money(bundle.taxSaving, currency)} vs taxed</span>
            <Link href="/planner?q=friday+wind-down" className="btn" style={{ marginLeft: "auto", background: "#fff", color: "var(--blue-d)" }}>
              See logic
            </Link>
          </div>
        </div>
      </div>

      {/* Live activity */}
      {recentOrders.length > 0 && (
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", flexWrap: "wrap" }}>
          <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}>
            <i className="ti ti-activity" /> Live
          </span>
          {recentOrders.slice(0, 3).map((o, idx) => (
            <span key={o.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {idx > 0 && <span style={{ color: "rgba(26,22,16,.25)" }}>/</span>}
              <span style={{ fontSize: 14 }}>
                <b>{o.user.department?.name ?? "Someone"}</b> just {o.status === "PAID" ? "booked" : "selected"} {o.title.split(" +")[0]}
              </span>
            </span>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--blue-d)", fontWeight: 500 }}>
            per team · never per person
          </span>
        </div>
      )}

      {/* Dept race · spin · mystery */}
      <div className="grid" style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="kick" style={{ color: "var(--blue-d)", marginBottom: 14 }}>Dept race · this week</div>
          {top && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 600 }}>
                <span>{top.name}</span>
                <span>{top.points.toLocaleString("en-US")}</span>
              </div>
              <div className="meter" style={{ margin: "7px 0 14px" }}>
                <span style={{ width: "100%", background: "var(--orange)" }} />
              </div>
            </>
          )}
          {second && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, color: "var(--muted)" }}>
                <span>{second.name}</span>
                <span>{second.points.toLocaleString("en-US")}</span>
              </div>
              <div className="meter" style={{ marginTop: 7 }}>
                <span style={{ width: `${Math.round((second.points / (top?.points || 1)) * 100)}%`, background: "var(--blue)" }} />
              </div>
            </>
          )}
          <Link href="/play" className="navlink" style={{ display: "inline-block", marginTop: 12, color: "var(--blue-d)", padding: 0 }}>
            See the leaderboard →
          </Link>
        </div>

        <Link href="/play" style={{ background: "var(--ink)", borderRadius: 20, padding: 20, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
          <div style={{ fontSize: 32, color: "var(--orange)" }}>
            <i className="ti ti-ferris-wheel" />
          </div>
          <div className="d" style={{ fontSize: 22, fontWeight: 700, margin: "9px 0 5px" }}>Weekly spin</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 15 }}>
            {user.lastSpinAt ? "Come back for next week" : "Your check-in is ready"}
          </div>
          <span className="pill" style={{ background: "var(--orange)", color: "#fff", width: "100%", justifyContent: "center", padding: 12 }}>
            Spin now
          </span>
        </Link>

        <Link href="/drops#mystery" className="card" style={{ padding: 20, display: "block" }}>
          <div className="kick" style={{ color: "var(--orange-d)", marginBottom: 10 }}>Mystery box</div>
          <div style={{ fontSize: 44, textAlign: "center" }}>🎁</div>
          <div style={{ fontSize: 13.5, color: "var(--muted)", textAlign: "center", margin: "10px 0 15px" }}>
            A wrapped perk within budget
          </div>
          <span className="pill" style={{ background: "var(--blue)", color: "#fff", width: "100%", justifyContent: "center", padding: 12 }}>
            Unwrap
          </span>
        </Link>
      </div>

      {/* Browse */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0 16px", flexWrap: "wrap" }}>
          <span className="section-label" style={{ margin: 0 }}>Browse the marketplace</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 7, flexWrap: "wrap" }}>
            <Link href="/marketplace" className="pill" style={chip(!cat)}>All</Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/marketplace?cat=${c.slug}`} className="pill" style={chip(cat === c.slug)}>
                <i className={`ti ${c.icon}`} /> {c.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {cardOffers.map((o) => (
            <OfferCard key={o.id} offer={o} currency={currency} inCart={cartIds.has(o.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function chip(active: boolean): React.CSSProperties {
  return active
    ? { background: "var(--ink)", color: "#fff" }
    : { background: "rgba(26,22,16,.06)", color: "var(--muted)" };
}
