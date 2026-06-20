# Perx

> The perks employees actually want, and the talent edge companies need — in one
> marketplace built for Albania and ready for the world.

A working two-sided benefits marketplace MVP. Employees browse and build perk
combos (single deals or **packages spanning several providers**), employers
approve them, and a **simulated payment routes directly to each provider** — the
money never passes through the employee's hands. Plus an AI concierge, Friday
drops, a mystery box, and a full gamification layer to make it a habit, not a chore.

Built with **Next.js 16 (App Router) · React 19 · Prisma 6 · SQLite**.

---

## Quick start

```bash
npm install
npm run db:push      # create the SQLite schema (prisma/dev.db)
npm run db:seed      # seed companies, people, providers, offers, drops, badges…
npm run dev          # http://localhost:3000
```

> Note: the Prisma CLI is pinned to v6 — run it via the npm scripts (`db:push`,
> `db:seed`, `db:reset`), not `npx prisma`, which may resolve a newer global build.
> `npm run db:reset` wipes and re-seeds for a clean demo.

## The 60-second demo

1. On the landing page, **enter as Kedi Kacorri** (an employee).
2. Open the **Concierge**, type a feeling + budget
   (e.g. *“stressed before a launch, something calming this weekend under €60”*)
   and hit **Build combo** → the AI assembles a cross-provider combo with a
   reasoning panel and a live budget meter. Click **Book all**.
3. Switch persona (top-right logout) and **enter as Elira Hysa** (HR).
4. On the **Dashboard**, find the pending selection under **Approvals** and click
   **Approve & pay** → the order flips to *Booked & paid*, **a simulated payment
   routes to each provider**, the employee earns points/badges, and the live
   **tax-savings counter** updates.
5. Back as Kedi, see it confirmed under **Orders** with the payment references.

## Three actors, one dataset

| Persona | Role | Sees |
|---|---|---|
| Kedi, Priya, Tom, Sara… | **Employee** | Marketplace, Concierge, Drops, Play, Wallet, Orders |
| Elira Hysa | **Employer / HR** | Approvals queue, tax-savings counter, adoption & category analytics, payment feed |
| Driton | **Provider** (Studio Vertigo) | Their offers, bookings, incoming payments, rating |

## What's implemented

**Core loop** — browse → build a combo (cross-provider package) → submit → employer
approves → simulated payment per provider → benefit confirmed.

**AI** — the concierge ([`lib/concierge.ts`](lib/concierge.ts)) turns a free-text
*feeling + budget* into a complementary, cross-provider combo using a mood lexicon,
a scoring pass over the catalog, and a budget-aware bundler — with a human
explanation for every pick. Deterministic and fully offline. It also powers the
"AI bundle" card on the marketplace.

**Engagement / stickiness** — Friday **drops** with live countdowns & scarcity, a
**mystery box** (free surprise within budget), **weekly spin** wheel, **points +
ledger**, a **stamp card**, **24 badges**, a **steps championship**, and
**department team-vs-team** leaderboards.

**Social** — perk reviews, emoji reactions, "trending in your office", **gifting**
to a teammate, **team pools**, and **provider referrals**.

**Employer insights** — running *“€X saved vs. taxed salary”* counter, budget used,
weekly active %, provider rating, spend-by-category, and per-department adoption
with a nudge suggestion.

**International-ready** — currency & tax rate per company, Albanian (`nameSq`)
category localisation, Tirana-local providers and offers seeded for the demo.

## Architecture

```
app/
  page.tsx              persona picker / "log in as"
  actions.ts            all server actions (book, approve+pay, spin, gift, …)
  (app)/                authenticated shell (top nav, role-aware)
    marketplace/  concierge/  offer/[id]/  cart/  orders/
    admin/  wallet/  play/  drops/  provider/
  components/           TopNav, OfferCard, SpinWheel, MysteryBox, Countdown, CountUp, BadgeWall, Stars
lib/
  prisma.ts session.ts budget.ts points.ts concierge.ts catalog.ts insights.ts cart.ts money.ts
prisma/
  schema.prisma         Company, Department, User, Provider, Category, Offer, Drop,
                        Order/OrderItem, Payment, Review, Reaction, Badge/UserBadge,
                        PointsEntry, Gift, TeamPool/PoolContribution
  seed.ts               the demo dataset
```

Auth is a lightweight cookie-based persona switch (no passwords) so the same data
can be explored from all three points of view. Money is stored as whole currency
units; payments are simulated (no real rail), as the brief allows.

The original static design mockups live in [`perks/`](perks/) for reference — every
screen there is now a live, data-driven page.
