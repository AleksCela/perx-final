// Perx runs entirely on its own in-app points currency — "PX". There is no
// real-world money anywhere in the product: budgets, perk prices, drops, gifts
// and team pools are all denominated in PX. The optional `currency` argument is
// kept only so existing call sites compile; it is intentionally ignored.

export const PX = "PX";

/** Format a whole-unit PX amount, e.g. 1204 -> "1,204 PX". */
export function money(amount: number, _currency?: string) {
  return `${Math.round(amount).toLocaleString("en-US")} ${PX}`;
}
