import React from "react";
import LandingScreen from "./LandingScreen";
import EarnScreen from "./EarnScreen";
import PlannerScreen from "./PlannerScreen";
import AdminScreen from "./AdminScreen";
import DropsMysteryScreen from "./DropsMysteryScreen";
import SocialScreen from "./SocialScreen";
import GamificationScreen from "./GamificationScreen";

export type PerksScreenKey =
  | "landing"
  | "earn"
  | "planner"
  | "admin"
  | "drops"
  | "social"
  | "gamification";

export const PERKS_SCREENS: {
  key: PerksScreenKey;
  label: string;
  Component: React.ComponentType;
}[] = [
  { key: "landing", label: "Marketplace landing", Component: LandingScreen },
  { key: "earn", label: "Earn & wallet", Component: EarnScreen },
  { key: "planner", label: "AI vibe planner", Component: PlannerScreen },
  { key: "admin", label: "Admin · tax-savings", Component: AdminScreen },
  { key: "drops", label: "Drops & mystery box", Component: DropsMysteryScreen },
  { key: "social", label: "Social · reviews & gifting", Component: SocialScreen },
  { key: "gamification", label: "Gamification", Component: GamificationScreen },
];

export default function PerksScreens({
  maxWidth = 760,
  showLabels = true,
}: {
  maxWidth?: number;
  showLabels?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        maxWidth,
        margin: "0 auto",
        padding: "32px 16px",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
      }}
    >
      {PERKS_SCREENS.map(({ key, label, Component }) => (
        <section key={key}>
          {showLabels && (
            <div
              style={{
                fontSize: 11,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "#9a8f7a",
                margin: "0 0 10px 4px",
              }}
            >
              {label}
            </div>
          )}
          <Component />
        </section>
      ))}
    </div>
  );
}
