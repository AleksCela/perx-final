import Link from "next/link";
import Stars from "./Stars";
import { money } from "@/lib/money";
import { addToCart } from "../actions";

export type CardOffer = {
  id: string;
  title: string;
  icon: string;
  price: number;
  originalPrice: number | null;
  providerName: string;
  providerColor: string;
  categoryName: string;
  location: string;
  distanceKm: number | null;
  rating: number;
  reviewCount: number;
};

export default function OfferCard({
  offer,
  currency,
  inCart,
}: {
  offer: CardOffer;
  currency: string;
  inCart?: boolean;
}) {
  return (
    <div className="card hover-lift" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            background: offer.providerColor,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flex: "none",
          }}
        >
          <i className={`ti ${offer.icon}`} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/offer/${offer.id}`} className="d" style={{ fontSize: 16, fontWeight: 600, display: "block" }}>
            {offer.title}
          </Link>
          <div style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {offer.providerName} · {offer.categoryName}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
        <Stars rating={offer.rating} size={13} />
        <span>{offer.rating.toFixed(1)}</span>
        <span style={{ color: "rgba(26,22,16,.25)" }}>·</span>
        <span>{offer.reviewCount} reviews</span>
        {offer.distanceKm != null && (
          <span style={{ marginLeft: "auto" }}>
            <i className="ti ti-map-pin" /> {offer.distanceKm}km
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
        <span className="d" style={{ fontSize: 22, fontWeight: 700 }}>
          {money(offer.price, currency)}
        </span>
        {offer.originalPrice && offer.originalPrice > offer.price && (
          <span style={{ fontSize: 13, textDecoration: "line-through", color: "var(--muted)" }}>
            {money(offer.originalPrice, currency)}
          </span>
        )}
        <form action={addToCart} style={{ marginLeft: "auto" }}>
          <input type="hidden" name="offerId" value={offer.id} />
          <button
            type="submit"
            className={`btn ${inCart ? "btn-blue" : "btn-ghost"}`}
            style={{ padding: "8px 14px", fontSize: 13 }}
          >
            {inCart ? (
              <>
                <i className="ti ti-check" /> In combo
              </>
            ) : (
              <>
                <i className="ti ti-plus" /> Combo
              </>
            )}
          </button>
        </form>
        <Link href={`/offer/${offer.id}`} className="btn btn-ink" style={{ padding: "8px 14px", fontSize: 13 }}>
          View
        </Link>
      </div>
    </div>
  );
}
