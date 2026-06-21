// Real, topical photography for the marketplace — pulled live from the web so
// perks show an actual picture instead of a flat icon tile. Images come from
// LoremFlickr (real Creative-Commons Flickr photos) keyed by a keyword that we
// derive from each offer's Tabler icon, with a per-offer "lock" so the same
// perk always shows the same photo (and two perks sharing an icon differ).

const KEYWORD_BY_ICON: Record<string, string> = {
  "ti-yoga": "yoga",
  "ti-bath": "spa",
  "ti-massage": "massage",
  "ti-hot-tub": "spa,sauna",
  "ti-barbell": "gym",
  "ti-stretching": "pilates",
  "ti-coffee": "coffee",
  "ti-egg-fried": "brunch",
  "ti-chef-hat": "restaurant",
  "ti-glass": "wine",
  "ti-tools-kitchen-2": "cooking",
  "ti-book": "books",
  "ti-language": "library",
  "ti-microphone-2": "conference",
  "ti-kayak": "kayak",
  "ti-ripple": "surfing",
  "ti-mountain": "mountains",
  "ti-parachute": "paragliding",
  "ti-movie": "cinema",
  "ti-music": "concert",
  "ti-bowl": "pottery",
};

const KEYWORD_BY_CATEGORY: Record<string, string> = {
  wellness: "fitness",
  food: "food",
  learning: "books",
  travel: "travel",
  relax: "spa",
};

// Stable small hash so a given offer id always maps to the same photo.
function lockFor(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % 900) + 1; // 1..900
}

/** A topical photo URL for a marketplace offer. */
export function offerImage(
  opts: { icon: string; categorySlug?: string; seed: string },
  width = 640,
  height = 420
): string {
  const keyword =
    KEYWORD_BY_ICON[opts.icon] ??
    KEYWORD_BY_CATEGORY[opts.categorySlug ?? ""] ??
    "wellness";
  return `https://loremflickr.com/${width}/${height}/${keyword}?lock=${lockFor(opts.seed)}`;
}
