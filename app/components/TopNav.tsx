"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../actions";
import { money } from "@/lib/money";

export type NavLink = { href: string; label: string; icon: string };

export default function TopNav({
  brandHref,
  links,
  user,
  budgetRemaining,
  currency,
  points,
  cartCount,
}: {
  brandHref: string;
  links: NavLink[];
  user: { name: string; initials: string; color: string; role: string };
  budgetRemaining: number | null;
  currency: string;
  points: number | null;
  cartCount: number;
}) {
  const pathname = usePathname();
  return (
    <nav className="nav g">
      <Link href={brandHref} className="logo" style={{ marginRight: 8 }}>
        perx<span>.</span>
      </Link>
      <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== brandHref && pathname.startsWith(l.href));
          return (
            <Link key={l.href} href={l.href} className={`navlink${active ? " active" : ""}`}>
              {l.label}
            </Link>
          );
        })}
      </div>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
        {points !== null && (
          <span className="pill" style={{ background: "rgba(31,91,224,.12)", color: "var(--blue-d)" }}>
            <i className="ti ti-bolt" /> {points.toLocaleString("en-US")}
          </span>
        )}
        {budgetRemaining !== null && (
          <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}>
            <i className="ti ti-ticket" /> {money(budgetRemaining, currency)} left
          </span>
        )}
        {cartCount > 0 && (
          <Link
            href="/cart"
            className="pill"
            style={{ background: "var(--ink)", color: "#fff" }}
            aria-label={`${cartCount} in combo`}
          >
            <i className="ti ti-shopping-bag" /> {cartCount}
          </Link>
        )}
        <span
          className="av"
          title={user.name}
          style={{ width: 34, height: 34, background: user.color, fontSize: 12 }}
        >
          {user.initials}
        </span>
        <form action={logout}>
          <button
            type="submit"
            className="btn btn-ghost"
            style={{ padding: "7px 10px" }}
            title="Switch persona"
          >
            <i className="ti ti-logout" />
          </button>
        </form>
      </div>
    </nav>
  );
}
