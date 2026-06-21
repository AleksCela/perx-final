import { requireUser } from "@/lib/session";
import { getBudget } from "@/lib/budget";
import { getCartIds } from "@/lib/cart";
import TopNav, { type NavLink } from "../components/TopNav";
import ChatWidget from "../components/ChatWidget";

export const dynamic = "force-dynamic";

const EMPLOYEE_LINKS: NavLink[] = [
  { href: "/marketplace", label: "Discover", icon: "ti-compass" },
  { href: "/map", label: "Map", icon: "ti-map-2" },
  { href: "/planner", label: "Planner", icon: "ti-sparkles" },
  { href: "/drops", label: "Drops", icon: "ti-bolt" },
  { href: "/requests", label: "Wishlist", icon: "ti-bulb" },
  { href: "/play", label: "Play", icon: "ti-ferris-wheel" },
  { href: "/wallet", label: "Wallet", icon: "ti-wallet" },
  { href: "/orders", label: "Orders", icon: "ti-receipt" },
];

const ADMIN_LINKS: NavLink[] = [
  { href: "/admin", label: "Dashboard", icon: "ti-chart-bar" },
  { href: "/admin/marketplace", label: "Manage perks", icon: "ti-building-store" },
  { href: "/marketplace", label: "Marketplace", icon: "ti-compass" },
];

const PROVIDER_LINKS: NavLink[] = [
  { href: "/provider", label: "Dashboard", icon: "ti-chart-bar" },
  { href: "/provider/scan", label: "Scan QR", icon: "ti-qrcode" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const currency = user.company?.currency ?? "EUR";

  let links = EMPLOYEE_LINKS;
  let brandHref = "/marketplace";
  let budgetRemaining: number | null = null;

  if (user.role === "ADMIN") {
    links = ADMIN_LINKS;
    brandHref = "/admin";
  } else if (user.role === "PROVIDER") {
    links = PROVIDER_LINKS;
    brandHref = "/provider";
  } else {
    const budget = await getBudget(user.id);
    budgetRemaining = budget.remaining;
  }

  const cartCount = user.role === "EMPLOYEE" ? (await getCartIds()).length : 0;

  return (
    <>
      <TopNav
        brandHref={brandHref}
        links={links}
        user={{ name: user.name, initials: user.initials, color: user.color, role: user.role }}
        budgetRemaining={budgetRemaining}
        currency={currency}
        cartCount={cartCount}
      />
      <div className="shell" style={{ paddingTop: 0 }}>{children}</div>
      <ChatWidget />
    </>
  );
}
