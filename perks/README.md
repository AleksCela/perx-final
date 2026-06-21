# Perks marketplace — screen components

Seven self-contained design screens for the Perks marketplace demo, plus a combined
gallery. Visual language: warm paper background, **Bricolage Grotesque** display +
**Hanken Grotesk** UI, orange (`#FF6A1F`, primary/action) and blue (`#1F5BE0`,
secondary/data) as the only accent colours, iOS-style frosted "Liquid Glass" chrome.

## What's here

| File | Export | Screen |
|------|--------|--------|
| `LandingScreen.tsx` | `LandingScreen` | Marketplace landing (hero, Friday drop, AI bundle, dept race, spin, mystery) |
| `EarnScreen.tsx` | `EarnScreen` | Earn & wallet — stamp card, ways to earn, badges, championship |
| `PlannerScreen.tsx` | `PlannerScreen` | AI vibe planner — cross-provider combo with reasoning |
| `AdminScreen.tsx` | `AdminScreen` | Admin/HR — running tax-savings counter + analytics |
| `DropsMysteryScreen.tsx` | `DropsMysteryScreen` | Friday drops + mystery box reveal |
| `SocialScreen.tsx` | `SocialScreen` | Perk detail (reviews/hype) + gifting + pool + referral |
| `GamificationScreen.tsx` | `GamificationScreen` | Spin wheel + team-vs-team + 24-badge wall |
| `PerksScreens.tsx` | `PerksScreens` | All screens stacked in a centred gallery |
| `index.ts` | barrel | Re-exports everything |

## Usage

Each screen is a standalone React component — no props, no `"use client"`, works as a
server component. Fonts (Google Fonts) and icons (Tabler webfont) are loaded via `@import`
inside each component, so there's **nothing else to install or configure**.

```tsx
import { LandingScreen } from "@/components/perks";

export default function Page() {
  return <LandingScreen />;
}
```

Show the whole set:

```tsx
import { PerksScreens } from "@/components/perks";

export default function Page() {
  return <PerksScreens />;        // optional props: maxWidth (default 760), showLabels
}
```

Render one screen by key (e.g. for a switcher):

```tsx
import { PERKS_SCREENS } from "@/components/perks";

const { Component } = PERKS_SCREENS.find((s) => s.key === "admin")!;
return <Component />;
```

## Copying into another project

1. Copy the whole `components/perks/` folder.
2. Import from wherever you put it (adjust the path / alias).

Notes:
- The screens were designed at ~680–760px wide. Constrain the container (the gallery
  does this with `maxWidth`) for the intended proportions; they reflow narrower but the
  multi-column grids look best above ~640px.
- Styling is fully self-contained (scoped `<style>` per screen + inline styles), so it
  won't collide with your app's CSS and needs no Tailwind/global setup.
- Markup is delivered via `dangerouslySetInnerHTML` with **static, hard-coded content**
  (no user input), so there's no XSS surface. To make a screen dynamic, replace the
  HTML string with JSX and feed it props.
- Requires network access to `fonts.googleapis.com`, `fonts.gstatic.com` and
  `cdn.jsdelivr.net` for fonts/icons. To self-host, download the Bricolage Grotesque /
  Hanken Grotesk / Tabler webfonts and swap the three `@import` URLs.
