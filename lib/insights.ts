import { prisma } from "./prisma";

export type DeptStanding = {
  id: string;
  name: string;
  points: number;
  steps: number;
  members: number;
};

/** Department leaderboard — real sums of member points & steps. */
export async function getDeptStandings(companyId: string): Promise<DeptStanding[]> {
  const depts = await prisma.department.findMany({
    where: { companyId },
    include: { users: { where: { role: "EMPLOYEE" }, select: { points: true, stepsThisWeek: true } } },
  });
  return depts
    .map((d) => ({
      id: d.id,
      name: d.name,
      points: d.users.reduce((s, u) => s + u.points, 0),
      steps: d.users.reduce((s, u) => s + u.stepsThisWeek, 0),
      members: d.users.length,
    }))
    .sort((a, b) => b.points - a.points);
}

export async function getCompanyStats(companyId: string) {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  const taxRate = company?.taxRate ?? 0.41;

  const employees = await prisma.user.findMany({
    where: { companyId, role: "EMPLOYEE" },
    select: { id: true, budgetTotal: true },
  });
  const employeeIds = employees.map((e) => e.id);
  const headcount = employees.length;
  const budgetTotal = employees.reduce((s, e) => s + e.budgetTotal, 0);

  const paidOrders = await prisma.order.findMany({
    where: { userId: { in: employeeIds }, status: "PAID" },
    include: { items: { include: { offer: { include: { category: true } } } } },
  });

  const benefitValue = paidOrders.reduce((s, o) => s + o.total, 0);
  const perksBooked = paidOrders.length;
  const taxSaving = Math.round(benefitValue * taxRate);
  const avgSaved = headcount ? Math.round(taxSaving / headcount) : 0;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthlyOrders = paidOrders.filter((o) => new Date(o.approvedAt ?? o.createdAt) >= monthStart);
  const monthlyBenefitValue = monthlyOrders.reduce((s, o) => s + o.total, 0);
  const monthlyTaxSaving = Math.round(monthlyBenefitValue * taxRate);

  // committed (spend) across the company for budget-used %
  const committedAgg = await prisma.order.aggregate({
    _sum: { total: true },
    where: { userId: { in: employeeIds }, status: { in: ["PENDING", "APPROVED", "PAID"] } },
  });
  const budgetUsed = committedAgg._sum.total ?? 0;
  const budgetPct = budgetTotal ? Math.round((budgetUsed / budgetTotal) * 100) : 0;

  // active this week — distinct employees with an order in the last 7 days
  const weekAgo = new Date(Date.now() - 7 * 86400_000);
  const recent = await prisma.order.findMany({
    where: { userId: { in: employeeIds }, createdAt: { gte: weekAgo } },
    select: { userId: true },
    distinct: ["userId"],
  });
  const activePct = headcount ? Math.round((recent.length / headcount) * 100) : 0;

  // provider rating
  const ratingAgg = await prisma.review.aggregate({ _avg: { rating: true }, _count: true });

  // spend by category
  const byCategory: Record<string, { name: string; value: number }> = {};
  for (const o of paidOrders) {
    for (const item of o.items) {
      const c = item.offer.category;
      byCategory[c.id] = byCategory[c.id] || { name: c.name, value: 0 };
      byCategory[c.id].value += item.price;
    }
  }
  const categories = Object.values(byCategory).sort((a, b) => b.value - a.value);
  const categoryMax = Math.max(1, ...categories.map((c) => c.value));

  // department adoption — % of dept with at least one paid order
  const depts = await prisma.department.findMany({
    where: { companyId },
    include: { users: { where: { role: "EMPLOYEE" }, select: { id: true } } },
  });
  const paidUserIds = new Set(paidOrders.map((o) => o.userId));
  const adoption = depts
    .map((d) => {
      const total = d.users.length;
      const adopted = d.users.filter((u) => paidUserIds.has(u.id)).length;
      return { name: d.name, pct: total ? Math.round((adopted / total) * 100) : 0 };
    })
    .sort((a, b) => b.pct - a.pct);

  const lowest = adoption[adoption.length - 1];

  return {
    headcount,
    benefitValue,
    perksBooked,
    taxSaving,
    avgSaved,
    monthlyBenefitValue,
    monthlyTaxSaving,
    budgetTotal,
    budgetUsed,
    budgetPct,
    activePct,
    providerRating: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
    reviewCount: ratingAgg._count,
    categories,
    categoryMax,
    adoption,
    lowestDept: lowest,
    taxRate,
    currency: company?.currency ?? "EUR",
  };
}
