// Perx AI planner — turns a free-text "feeling + budget" into a cross-provider
// combo with a human explanation. Fully deterministic and offline: a mood lexicon
// scores the catalog, then a budget-aware bundler picks complementary offers from
// distinct providers. (Structured so a hosted LLM could be swapped in later.)

export type OfferLike = {
  id: string;
  title: string;
  price: number;
  icon: string;
  moodTags: string; // CSV
  location: string;
  distanceKm: number | null;
  rating: number;
  categorySlug: string;
  categoryName: string;
  providerId: string;
  providerName: string;
};

export type Combo = {
  query: string;
  budget: number;
  name: string;
  moods: string[];
  items: OfferLike[];
  total: number;
  taxSaving: number;
  underBudget: number;
  rating: number;
  reasoning: string[];
};

// keyword -> mood tags. Order doesn't matter; all matching synonyms contribute.
const LEXICON: Record<string, string[]> = {
  calm: ["calm", "relax"],
  relax: ["calm", "relax"],
  relaxing: ["calm", "relax"],
  stress: ["calm", "relax"],
  stressed: ["calm", "relax"],
  wired: ["calm", "relax"],
  unwind: ["calm", "relax", "weekend"],
  "wind down": ["calm", "relax"],
  decompress: ["calm", "relax"],
  cosy: ["calm", "relax"],
  reset: ["calm", "relax", "solo"],
  spa: ["relax", "wellness"],
  energetic: ["energetic", "fitness"],
  energy: ["energetic", "fitness"],
  active: ["energetic", "fitness"],
  workout: ["energetic", "fitness"],
  fit: ["energetic", "fitness"],
  fitness: ["fitness", "energetic"],
  move: ["energetic", "fitness"],
  social: ["social"],
  friends: ["social"],
  team: ["social"],
  together: ["social"],
  fun: ["social", "energetic"],
  learn: ["learning", "growth"],
  learning: ["learning", "growth"],
  skill: ["learning", "growth"],
  study: ["learning"],
  language: ["learning"],
  grow: ["growth", "learning"],
  adventure: ["adventure", "nature"],
  outdoor: ["adventure", "nature"],
  outdoors: ["adventure", "nature"],
  nature: ["nature", "adventure"],
  thrill: ["thrill", "adventure"],
  hike: ["adventure", "nature"],
  food: ["food"],
  foodie: ["food"],
  eat: ["food"],
  dinner: ["food", "date"],
  lunch: ["food", "social"],
  coffee: ["coffee", "food"],
  wine: ["food", "celebrate"],
  date: ["date", "social"],
  romantic: ["date"],
  partner: ["date"],
  two: ["date"],
  celebrate: ["celebrate", "social"],
  treat: ["celebrate"],
  family: ["family"],
  kids: ["family"],
  weekend: ["weekend"],
  saturday: ["weekend"],
  sunday: ["weekend", "calm"],
  morning: ["morning"],
  creative: ["creative", "learning"],
  solo: ["solo"],
};

const COMBO_NAMES: { mood: string; name: string }[] = [
  { mood: "calm", name: "Decompress" },
  { mood: "relax", name: "Decompress" },
  { mood: "energetic", name: "Recharge" },
  { mood: "fitness", name: "Recharge" },
  { mood: "social", name: "Get-together" },
  { mood: "learning", name: "Level-up" },
  { mood: "growth", name: "Level-up" },
  { mood: "adventure", name: "Adventure" },
  { mood: "nature", name: "Adventure" },
  { mood: "food", name: "Tasting" },
  { mood: "celebrate", name: "Celebration" },
  { mood: "date", name: "Date night" },
];

export function parseBudget(query: string, fallback: number): number {
  const matches = query.match(/(\d{1,4})/g);
  if (matches && matches.length) {
    const nums = matches.map(Number).filter((n) => n >= 5 && n <= 5000);
    if (nums.length) return Math.min(...nums.length > 1 ? nums : [nums[0]], fallback || Infinity) || nums[0];
  }
  return fallback || 60;
}

export function detectMoods(query: string): string[] {
  const q = ` ${query.toLowerCase()} `;
  const found = new Set<string>();
  for (const [kw, moods] of Object.entries(LEXICON)) {
    if (q.includes(kw)) moods.forEach((m) => found.add(m));
  }
  return [...found];
}

function tagList(csv: string): string[] {
  return csv.split(",").map((t) => t.trim()).filter(Boolean);
}

function scoreOffer(offer: OfferLike, moods: string[]): number {
  const tags = tagList(offer.moodTags);
  const overlap = tags.filter((t) => moods.includes(t)).length;
  const distancePenalty = offer.distanceKm ? Math.min(offer.distanceKm, 40) * 0.04 : 0;
  return overlap * 10 + offer.rating - distancePenalty;
}

/** Build a cross-provider combo from the catalog for a vibe + budget. */
export function buildCombo(
  offers: OfferLike[],
  query: string,
  budgetCap: number,
  taxRate = 0.41
): Combo {
  const moods = detectMoods(query);
  const budget = parseBudget(query, budgetCap);

  const ranked = [...offers]
    .map((o) => ({ o, score: scoreOffer(o, moods) }))
    .sort((a, b) => b.score - a.score || a.o.price - b.o.price);

  // Greedy: prefer distinct providers AND distinct categories, up to 3, under budget.
  const pick = (requireDistinctCategory: boolean, requireDistinctProvider: boolean) => {
    const chosen: OfferLike[] = [];
    const provIds = new Set<string>();
    const catSlugs = new Set<string>();
    let total = 0;
    for (const { o } of ranked) {
      if (chosen.length >= 3) break;
      if (requireDistinctProvider && provIds.has(o.providerId)) continue;
      if (requireDistinctCategory && catSlugs.has(o.categorySlug)) continue;
      if (total + o.price > budget) continue;
      chosen.push(o);
      provIds.add(o.providerId);
      catSlugs.add(o.categorySlug);
      total += o.price;
    }
    return chosen;
  };

  // Relax constraints until we have at least 2 items (or take the single best affordable).
  let items =
    pick(true, true).length >= 2
      ? pick(true, true)
      : pick(false, true).length >= 2
      ? pick(false, true)
      : pick(false, false);

  if (items.length === 0) {
    const cheapest = [...offers].sort((a, b) => a.price - b.price)[0];
    if (cheapest) items = [cheapest];
  }

  const total = items.reduce((s, i) => s + i.price, 0);
  const taxSaving = Math.round(total * taxRate);
  const underBudget = budget - total;
  const rating =
    items.length > 0
      ? Math.round((items.reduce((s, i) => s + i.rating, 0) / items.length) * 10) / 10
      : 0;

  const providerCount = new Set(items.map((i) => i.providerId)).size;
  const maxDist = Math.max(0, ...items.map((i) => i.distanceKm ?? 0));

  const name =
    COMBO_NAMES.find((c) => moods.includes(c.mood))?.name ?? "Curated";

  const reasoning: string[] = [];
  reasoning.push(
    moods.length
      ? `Read your vibe as ${moods.slice(0, 3).join(", ")} — decompress, not adrenaline`
      : `No strong vibe detected, so I leaned on the team's top-rated picks`
  );
  if (providerCount > 1)
    reasoning.push(`${providerCount} providers stitched into one booking`);
  if (rating > 0) reasoning.push(`People like you rate this combo ${rating.toFixed(1)}/5`);
  if (maxDist > 0) reasoning.push(`Everything within ${maxDist.toFixed(1)}km`);
  reasoning.push(
    underBudget >= 0
      ? `${underBudget === 0 ? "Right on" : "€" + underBudget + " under"} your €${budget} budget`
      : `Slightly over — swap one to fit €${budget}`
  );

  return {
    query,
    budget,
    name,
    moods: moods.slice(0, 3),
    items,
    total,
    taxSaving,
    underBudget,
    rating,
    reasoning,
  };
}
