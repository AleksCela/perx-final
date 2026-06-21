import { requireRole } from "@/lib/session";
import { redirect } from "next/navigation";
import ScanClient from "./ScanClient";

export const dynamic = "force-dynamic";

export default async function ScanPage() {
  const user = await requireRole("PROVIDER");
  if (!user.providerId) redirect("/");
  return <ScanClient />;
}
