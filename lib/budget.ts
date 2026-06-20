import { prisma } from "./prisma";

export type Budget = {
  total: number;
  committed: number;
  remaining: number;
  pct: number; // percentage remaining (0-100)
};

/**
 * An employee's welfare budget. Everything that draws on it counts as committed:
 * active orders (pending/approved/paid), gifts sent, and team-pool contributions.
 */
export async function getBudget(userId: string): Promise<Budget> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const total = user?.budgetTotal ?? 0;

  const [orders, gifts, pools] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { userId, status: { in: ["PENDING", "APPROVED", "PAID"] } },
    }),
    prisma.gift.aggregate({ _sum: { amount: true }, where: { fromUserId: userId } }),
    prisma.poolContribution.aggregate({ _sum: { amount: true }, where: { userId } }),
  ]);

  const committed =
    (orders._sum.total ?? 0) + (gifts._sum.amount ?? 0) + (pools._sum.amount ?? 0);
  const remaining = Math.max(0, total - committed);
  const pct = total > 0 ? Math.round((remaining / total) * 100) : 0;

  return { total, committed, remaining, pct };
}
