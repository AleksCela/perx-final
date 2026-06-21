import { prisma } from "./prisma";
import type { OfferLike } from "./planner";

const BASELINE_RATING = 4.5; // assume good-but-unproven for offers without reviews yet

type OfferWithRelations = {
  id: string;
  title: string;
  price: number;
  icon: string;
  moodTags: string;
  location: string;
  distanceKm: number | null;
  providerId: string;
  provider: { name: string };
  category: { slug: string; name: string };
  reviews: { rating: number }[];
};

export function ratingOf(reviews: { rating: number }[]): number {
  if (!reviews.length) return BASELINE_RATING;
  return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
}

export function toOfferLike(o: OfferWithRelations): OfferLike {
  return {
    id: o.id,
    title: o.title,
    price: o.price,
    icon: o.icon,
    moodTags: o.moodTags,
    location: o.location,
    distanceKm: o.distanceKm,
    rating: ratingOf(o.reviews),
    categorySlug: o.category.slug,
    categoryName: o.category.name,
    providerId: o.providerId,
    providerName: o.provider.name,
  };
}

/** All active offers shaped for the planner / marketplace cards. */
export async function getOfferLikes(): Promise<OfferLike[]> {
  const offers = await prisma.offer.findMany({
    where: { active: true },
    include: {
      provider: { select: { name: true } },
      category: { select: { slug: true, name: true } },
      reviews: { select: { rating: true } },
    },
  });
  return offers.map(toOfferLike);
}
