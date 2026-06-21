"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, SESSION_COOKIE } from "@/lib/session";
import { getCartIds, CART_COOKIE } from "@/lib/cart";
import { getBudget } from "@/lib/budget";
import { addPoints, awardBadge } from "@/lib/points";
import { SPIN_PRIZES } from "@/lib/constants";

function ref() {
  return "PX-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function revalidateApp() {
  for (const p of ["/marketplace", "/planner", "/cart", "/orders", "/wallet", "/drops", "/play", "/admin", "/provider"]) {
    revalidatePath(p);
  }
}

// --------------------------------------------------------------------------
// Session / persona
// --------------------------------------------------------------------------

export async function setPersona(formData: FormData) {
  const userId = String(formData.get("userId") || "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const store = await cookies();
  store.set(SESSION_COOKIE, user.id, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 30 });
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "PROVIDER") redirect("/provider");
  redirect("/marketplace");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(CART_COOKIE);
  redirect("/");
}

// --------------------------------------------------------------------------
// Cart (combo in progress)
// --------------------------------------------------------------------------

async function writeCart(ids: string[]) {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify([...new Set(ids)]), { path: "/", sameSite: "lax" });
}

export async function addToCart(formData: FormData) {
  const offerId = String(formData.get("offerId") || "");
  if (!offerId) return;
  const ids = await getCartIds();
  if (!ids.includes(offerId)) ids.push(offerId);
  await writeCart(ids);
  revalidateApp();
}

export async function removeFromCart(formData: FormData) {
  const offerId = String(formData.get("offerId") || "");
  const ids = (await getCartIds()).filter((id) => id !== offerId);
  await writeCart(ids);
  revalidatePath("/cart");
  revalidateApp();
}

export async function clearCart() {
  await writeCart([]);
  revalidatePath("/cart");
}

// --------------------------------------------------------------------------
// Orders: create selections (pending) — the start of the core loop
// --------------------------------------------------------------------------

async function createOrder(opts: {
  userId: string;
  offerIds: string[];
  source?: string;
  title?: string;
  reasoning?: string;
  priceOverride?: Record<string, number>; // for drops
}) {
  const offers = await prisma.offer.findMany({ where: { id: { in: opts.offerIds } } });
  if (!offers.length) return null;
  // preserve requested order
  const ordered = opts.offerIds
    .map((id) => offers.find((o) => o.id === id))
    .filter((o): o is (typeof offers)[number] => Boolean(o));
  const items = ordered.map((o) => ({
    offerId: o.id,
    title: o.title,
    price: opts.priceOverride?.[o.id] ?? o.price,
    qty: 1,
  }));
  const total = items.reduce((s, i) => s + i.price, 0);
  const title =
    opts.title ||
    (items.length > 1 ? `${items[0].title} +${items.length - 1} more` : items[0].title);
  return prisma.order.create({
    data: {
      userId: opts.userId,
      status: "PENDING",
      source: opts.source ?? "MANUAL",
      title,
      total,
      reasoning: opts.reasoning ?? "",
      items: { create: items },
    },
  });
}

export async function bookOffer(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const offerId = String(formData.get("offerId") || "");
  if (!offerId) return;
  await createOrder({ userId: user.id, offerIds: [offerId], source: "MANUAL" });
  revalidateApp();
  redirect("/orders?submitted=1");
}

export async function submitCart() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const ids = await getCartIds();
  if (!ids.length) redirect("/marketplace");
  await createOrder({ userId: user.id, offerIds: ids, source: "MANUAL" });
  await writeCart([]);
  revalidateApp();
  redirect("/orders?submitted=1");
}

export async function bookCombo(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const offerIds = String(formData.get("offerIds") || "").split(",").filter(Boolean);
  const title = String(formData.get("title") || "");
  const reasoning = String(formData.get("reasoning") || "");
  if (!offerIds.length) redirect("/planner");
  await createOrder({ userId: user.id, offerIds, source: "PLANNER", title, reasoning });
  revalidateApp();
  redirect("/orders?submitted=1");
}

export async function claimDrop(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const offerId = String(formData.get("offerId") || "");
  const drop = await prisma.drop.findUnique({ where: { offerId } });
  if (!drop) return;
  if (drop.quantityClaimed >= drop.quantityTotal) redirect("/drops?soldout=1");
  await prisma.drop.update({
    where: { id: drop.id },
    data: { quantityClaimed: { increment: 1 } },
  });
  await createOrder({
    userId: user.id,
    offerIds: [offerId],
    source: "DROP",
    priceOverride: { [offerId]: drop.dropPrice },
  });
  revalidateApp();
  redirect("/orders?submitted=1");
}

/** Mystery box — a free, employer-funded surprise within budget. Returns the offer. */
export async function openMystery() {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const };
  const budget = await getBudget(user.id);
  const candidates = await prisma.offer.findMany({
    where: { active: true, price: { lte: Math.max(30, budget.remaining) } },
    include: { provider: true },
  });
  if (!candidates.length) return { ok: false as const };
  const offer = candidates[Math.floor(Math.random() * candidates.length)];
  // Free this time: total 0 so it doesn't draw down budget.
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PENDING",
      source: "MYSTERY",
      title: `Mystery box · ${offer.title}`,
      total: 0,
      items: { create: [{ offerId: offer.id, title: offer.title, price: 0, qty: 1 }] },
    },
  });
  const badge = await awardBadge(user.id, "mystery-fan");
  await addPoints(user.id, 75, "Opened a mystery box");
  revalidateApp();
  return {
    ok: true as const,
    orderId: order.id,
    title: offer.title,
    provider: offer.provider.name,
    worth: offer.price,
    icon: offer.icon,
    badge: badge?.name ?? null,
  };
}

// --------------------------------------------------------------------------
// Approvals: employer reviews + simulated payment routing
// --------------------------------------------------------------------------

export async function approveOrder(formData: FormData) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") redirect("/");
  const orderId = String(formData.get("orderId") || "");
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { offer: { include: { category: true } } } } },
  });
  if (!order || order.status !== "PENDING") return;

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID", approvedById: admin.id, approvedAt: new Date() },
  });

  // Route a simulated payment to each provider in the package.
  const byProvider: Record<string, number> = {};
  for (const item of order.items) {
    byProvider[item.offer.providerId] = (byProvider[item.offer.providerId] || 0) + item.price;
  }
  for (const [providerId, amount] of Object.entries(byProvider)) {
    if (amount <= 0) continue;
    await prisma.payment.create({
      data: { orderId: order.id, providerId, amount, reference: ref() },
    });
  }

  // Reward the employee.
  await addPoints(order.userId, 50, "Booked a perk");
  const providerCount = Object.keys(byProvider).length;
  if (providerCount >= 3) await awardBadge(order.userId, "curator");
  if (order.source === "DROP") await awardBadge(order.userId, "drop-hunter");
  for (const item of order.items) {
    const slug = item.offer.category.slug;
    if (slug === "travel") await awardBadge(order.userId, "globetrot");
    if (slug === "learning") await awardBadge(order.userId, "linguist");
    if (item.offer.moodTags.includes("coffee")) await awardBadge(order.userId, "barista-pal");
  }
  const paidTotal = await prisma.order.aggregate({
    _sum: { total: true },
    where: { userId: order.userId, status: "PAID" },
  });
  if ((paidTotal._sum.total ?? 0) >= 200) await awardBadge(order.userId, "big-spender");

  revalidateApp();
}

export async function rejectOrder(formData: FormData) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "ADMIN") redirect("/");
  const orderId = String(formData.get("orderId") || "");
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== "PENDING") return;
  await prisma.order.update({ where: { id: order.id }, data: { status: "REJECTED" } });
  revalidateApp();
}

// --------------------------------------------------------------------------
// Engagement: spin, reactions, reviews, gifts, pools, referrals
// --------------------------------------------------------------------------

export async function spin() {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, reason: "auth" };
  const lastSpin = user.lastSpinAt ? new Date(user.lastSpinAt).getTime() : 0;
  const weekMs = 7 * 24 * 3600 * 1000;
  if (Date.now() - lastSpin < weekMs) {
    const nextIn = Math.ceil((weekMs - (Date.now() - lastSpin)) / (24 * 3600 * 1000));
    return { ok: false as const, reason: "cooldown", days: nextIn };
  }
  const prize = SPIN_PRIZES[Math.floor(Math.random() * SPIN_PRIZES.length)];
  await prisma.user.update({
    where: { id: user.id },
    data: { lastSpinAt: new Date(), streakWeeks: { increment: 1 } },
  });
  await addPoints(user.id, prize.points, `Weekly spin — ${prize.label}`);
  await awardBadge(user.id, "first-spin");
  if (prize.points >= 200) await awardBadge(user.id, "lucky-7");
  const fresh = await prisma.user.findUnique({ where: { id: user.id } });
  revalidateApp();
  return {
    ok: true as const,
    label: prize.label,
    points: prize.points,
    streak: fresh?.streakWeeks ?? user.streakWeeks + 1,
  };
}

export async function toggleReaction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const offerId = String(formData.get("offerId") || "");
  const emoji = String(formData.get("emoji") || "");
  if (!offerId || !emoji) return;
  const existing = await prisma.reaction.findUnique({
    where: { offerId_userId_emoji: { offerId, userId: user.id, emoji } },
  });
  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.reaction.create({ data: { offerId, userId: user.id, emoji } });
    const count = await prisma.reaction.count({ where: { userId: user.id } });
    if (count >= 10) await awardBadge(user.id, "hype-beast");
  }
  revalidatePath(`/offer/${offerId}`);
}

export async function addReview(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const offerId = String(formData.get("offerId") || "");
  const rating = Math.max(1, Math.min(5, Number(formData.get("rating") || 5)));
  const body = String(formData.get("body") || "").slice(0, 500);
  if (!offerId || !body.trim()) return;
  await prisma.review.create({ data: { offerId, userId: user.id, rating, body } });
  await addPoints(user.id, 25, "Review with photo");
  await awardBadge(user.id, "reviewer");
  revalidatePath(`/offer/${offerId}`);
}

export async function sendGift(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const toUserId = String(formData.get("toUserId") || "");
  // gift options come from a single radio as "Label|amount"
  const combined = String(formData.get("giftValue") || "");
  let label = String(formData.get("label") || "Treat");
  let amount = Math.max(0, Number(formData.get("amount") || 0));
  if (combined.includes("|")) {
    const [l, a] = combined.split("|");
    label = l;
    amount = Math.max(0, Number(a) || 0);
  }
  const message = String(formData.get("message") || "").slice(0, 200);
  const offerId = String(formData.get("offerId") || "") || null;
  if (!toUserId || toUserId === user.id) return;
  await prisma.gift.create({
    data: { fromUserId: user.id, toUserId, label, amount, message, offerId },
  });
  await addPoints(user.id, 15, "Gifted a teammate");
  await awardBadge(user.id, "generous");
  revalidateApp();
}

export async function chipInPool(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const poolId = String(formData.get("poolId") || "");
  const amount = Math.max(1, Number(formData.get("amount") || 40));
  if (!poolId) return;
  await prisma.poolContribution.create({ data: { poolId, userId: user.id, amount } });
  await addPoints(user.id, 20, "Chipped into a team pool");
  await awardBadge(user.id, "pool-starter");
  revalidateApp();
}

// --------------------------------------------------------------------------
// Perk requests — employees vote for / submit the perks they want next
// --------------------------------------------------------------------------

export async function voteRequest(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const requestId = String(formData.get("requestId") || "");
  if (!requestId) return;
  const existing = await prisma.perkVote.findUnique({
    where: { requestId_userId: { requestId, userId: user.id } },
  });
  if (existing) {
    await prisma.perkVote.delete({ where: { id: existing.id } });
  } else {
    await prisma.perkVote.create({ data: { requestId, userId: user.id } });
  }
  revalidatePath("/requests");
}

export async function submitRequest(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const title = String(formData.get("title") || "").trim().slice(0, 100);
  const description = String(formData.get("description") || "").trim().slice(0, 300);
  const categorySlug = String(formData.get("category") || "");
  if (!title || !user.companyId) return;
  const category = categorySlug
    ? await prisma.category.findUnique({ where: { slug: categorySlug } })
    : null;
  await prisma.perkRequest.create({
    data: {
      title,
      description,
      categorySlug,
      icon: category?.icon ?? "ti-bulb",
      status: "OPEN",
      companyId: user.companyId,
      createdById: user.id,
      // back the idea you just submitted
      votes: { create: { userId: user.id } },
    },
  });
  await addPoints(user.id, 20, "Suggested a perk");
  await awardBadge(user.id, "scout");
  revalidatePath("/requests");
}

export async function redeemOrder(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "PROVIDER" || !user.providerId) redirect("/");
  const orderId = String(formData.get("orderId") || "");
  if (!orderId) return;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { offer: true } } },
  });
  if (!order || order.status !== "PAID" || order.redeemedAt) return;
  const belongsToProvider = order.items.some((it) => it.offer.providerId === user.providerId);
  if (!belongsToProvider) return;
  await prisma.order.update({ where: { id: orderId }, data: { redeemedAt: new Date() } });
  revalidatePath(`/provider/redeem/${orderId}`);
  revalidatePath("/provider");
}

export async function referProvider(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const name = String(formData.get("name") || "").trim().slice(0, 80);
  if (!name) return;
  // Simulate the spot joining the marketplace.
  await prisma.provider.create({
    data: { name, city: "Tirana", tagline: "Referred by a teammate", referredBy: user.id },
  });
  await addPoints(user.id, 200, "Referred a provider");
  await awardBadge(user.id, "scout");
  revalidateApp();
}
