import { cookies } from "next/headers";

export const CART_COOKIE = "perx_cart";

/** The cart is a cookie holding a list of offer ids (a "combo" in progress). */
export async function getCartIds(): Promise<string[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
