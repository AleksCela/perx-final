const SYMBOLS: Record<string, string> = {
  EUR: "€",
  ALL: "L",
  USD: "$",
  GBP: "£",
};

export function symbol(currency = "EUR") {
  return SYMBOLS[currency] ?? "";
}

/** Format a whole-unit amount with the currency symbol, e.g. 1204 -> "€1,204". */
export function money(amount: number, currency = "EUR") {
  return `${symbol(currency)}${Math.round(amount).toLocaleString("en-US")}`;
}
