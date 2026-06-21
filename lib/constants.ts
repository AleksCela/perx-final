export const REACTION_EMOJIS = ["🔥", "😍", "💪", "🙌", "🎉"];

// Weekly-spin prize wheel. Shared between the server action that picks a prize
// and the client wheel that animates to the matching segment, so they never
// disagree. Order here == order of the wedges drawn clockwise from the top.
export const SPIN_PRIZES = [
  { label: "Double-points Friday", points: 120 },
  { label: "Lucky points", points: 80 },
  { label: "Mega bonus", points: 200 },
  { label: "Small win", points: 40 },
  { label: "Steady streak", points: 60 },
  { label: "Jackpot!", points: 300 },
] as const;

export const GIFT_OPTIONS = [
  { label: "Coffee", amount: 4, emoji: "☕" },
  { label: "Lunch", amount: 12, emoji: "🥗" },
  { label: "Sweet treat", amount: 6, emoji: "🧁" },
];

// Roughly how much extra a company would spend paying the same value as taxed
// salary instead of as a benefit — drives the tax-savings story.
export function taxSaving(amount: number, taxRate: number) {
  return Math.round(amount * taxRate);
}
