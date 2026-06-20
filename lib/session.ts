import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "perx_uid";

export type SessionUser = Awaited<ReturnType<typeof getCurrentUser>>;

export async function getCurrentUser() {
  const store = await cookies();
  const uid = store.get(SESSION_COOKIE)?.value;
  if (!uid) return null;
  return prisma.user.findUnique({
    where: { id: uid },
    include: { company: true, department: true, provider: true },
  });
}

/** Use in pages that require a signed-in user; redirects to the persona picker. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  return user;
}

/** Require a specific role, else redirect to the marketplace. */
export async function requireRole(role: string) {
  const user = await requireUser();
  if (user.role !== role) redirect("/marketplace");
  return user;
}
