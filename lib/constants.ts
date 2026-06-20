export const REACTION_EMOJIS = ["🔥", "😍", "💪", "🙌", "🎉"];

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
