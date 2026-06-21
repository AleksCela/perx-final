// One-off, idempotent seeder for the Perk Wishlist (perk requests + votes).
// Safe to run against the live dev.db without wiping anything: it bails if any
// perk requests already exist. Run: node prisma/seedRequests.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REQUESTS = [
  { title: "Therapy & mental-health sessions", cat: "relax", status: "PLANNED", note: "Provider shortlisted — live next month.", votes: 9, desc: "Confidential 1:1 sessions, a few covered per quarter." },
  { title: "Coworking day passes for remote days", cat: "learning", status: "OPEN", votes: 8, desc: "Drop-in desks around town when WFH gets lonely." },
  { title: "Padel court membership", cat: "wellness", status: "PLANNED", note: "Booking a partner court for Q3.", votes: 7, desc: "The whole office is obsessed — let's make it a perk." },
  { title: "Healthy lunch delivery", cat: "food", status: "LIVE", note: "Shipped! Check the Food & coffee category.", votes: 6, desc: "Daily desk lunches from local kitchens." },
  { title: "EV charging credit", cat: "travel", status: "OPEN", votes: 5, desc: "A monthly top-up for people who drive electric." },
  { title: "Ski weekend in Brezovica", cat: "travel", status: "OPEN", votes: 4, desc: "A subsidised winter team trip to the slopes." },
  { title: "Pet-care / vet allowance", cat: "", status: "OPEN", votes: 3, desc: "Help with vet bills and pet-sitting." },
];

async function main() {
  const existing = await prisma.perkRequest.count();
  if (existing > 0) {
    console.log(`Skipping — ${existing} perk requests already exist.`);
    return;
  }
  const company = await prisma.company.findFirst();
  if (!company) throw new Error("No company found — run the main seed first.");
  const employees = await prisma.user.findMany({ where: { companyId: company.id, role: "EMPLOYEE" } });
  const categories = await prisma.category.findMany();
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  let rot = 0;
  for (const r of REQUESTS) {
    const cat = r.cat ? catBySlug[r.cat] : null;
    // rotate which employees voted so it isn't always the same people
    const voters = [];
    for (let i = 0; i < r.votes && i < employees.length; i++) {
      voters.push(employees[(rot + i) % employees.length]);
    }
    rot += 2;
    await prisma.perkRequest.create({
      data: {
        title: r.title,
        description: r.desc,
        categorySlug: r.cat,
        icon: cat?.icon ?? "ti-bulb",
        status: r.status,
        note: r.note ?? "",
        companyId: company.id,
        createdById: voters[0]?.id ?? null,
        votes: { create: voters.map((v) => ({ userId: v.id })) },
      },
    });
  }
  console.log(`Created ${REQUESTS.length} perk requests.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
