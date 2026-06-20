import { prisma } from "./prisma";

/** Append to the points ledger and keep the cached total on the user in sync. */
export async function addPoints(userId: string, amount: number, reason: string) {
  await prisma.pointsEntry.create({ data: { userId, amount, reason } });
  await prisma.user.update({
    where: { id: userId },
    data: { points: { increment: amount } },
  });
}

/** Award a badge once; awards its points too. Returns the badge if newly earned. */
export async function awardBadge(userId: string, slug: string) {
  const badge = await prisma.badge.findUnique({ where: { slug } });
  if (!badge) return null;
  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (existing) return null;
  await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
  await addPoints(userId, badge.points, `Badge: ${badge.name}`);
  return badge;
}

export function tierForPoints(points: number) {
  if (points >= 5000) return { name: "Diamond", next: null as number | null };
  if (points >= 2500) return { name: "Platinum", next: 5000 };
  if (points >= 1500) return { name: "Gold", next: 2500 };
  if (points >= 750) return { name: "Silver", next: 1500 };
  return { name: "Bronze", next: 750 };
}
