import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// minutes/hours from now helper for drop expiries
const inHours = (h: number, m = 0) =>
  new Date(Date.now() + h * 3600_000 + m * 60_000);
const daysAgo = (d: number) => new Date(Date.now() - d * 86400_000);

async function main() {
  console.log("Clearing existing data…");
  // Delete in dependency order.
  await prisma.poolContribution.deleteMany();
  await prisma.teamPool.deleteMany();
  await prisma.gift.deleteMany();
  await prisma.pointsEntry.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.category.deleteMany();
  await prisma.provider.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.company.deleteMany();

  console.log("Creating company & departments…");
  const company = await prisma.company.create({
    data: {
      name: "TeamSystem",
      country: "Albania",
      currency: "PX", // Perx's own in-app points currency — no real money
      taxRate: 0.41,
    },
  });

  const deptNames = ["Design", "Sales", "Engineering", "Ops"];
  const depts: Record<string, string> = {};
  for (const name of deptNames) {
    const d = await prisma.department.create({
      data: { name, companyId: company.id },
    });
    depts[name] = d.id;
  }

  console.log("Creating categories…");
  const categoryData = [
    { slug: "wellness", name: "Wellness & fitness", nameSq: "Mirëqenie & fitnes", icon: "ti-yoga" },
    { slug: "food", name: "Food & coffee", nameSq: "Ushqim & kafe", icon: "ti-coffee" },
    { slug: "learning", name: "Learning & language", nameSq: "Mësim & gjuhë", icon: "ti-book" },
    { slug: "travel", name: "Travel & experiences", nameSq: "Udhëtim & përvoja", icon: "ti-plane" },
    { slug: "relax", name: "Relax & spa", nameSq: "Relaks & spa", icon: "ti-bath" },
  ];
  const cat: Record<string, string> = {};
  for (const c of categoryData) {
    const created = await prisma.category.create({ data: c });
    cat[c.slug] = created.id;
  }

  console.log("Creating providers…");
  const providerData = [
    { key: "lila", name: "Studio Lila", city: "Tirana", tagline: "Yoga & breathwork in Blloku", color: "#FF6A1F" },
    { key: "aqua", name: "Aqua Spa", city: "Tirana", tagline: "Thermal baths & massage", color: "#1F5BE0" },
    { key: "vertigo", name: "Studio Vertigo", city: "Tirana", tagline: "Bouldering & climbing", color: "#1F5BE0" },
    { key: "mon", name: "Mon Café", city: "Tirana", tagline: "Specialty coffee at Pazari i Ri", color: "#B23C0A" },
    { key: "mullixhiu", name: "Mullixhiu", city: "Tirana", tagline: "Modern Albanian kitchen", color: "#FF6A1F" },
    { key: "wine", name: "WineVault", city: "Tirana", tagline: "Natural wine tastings", color: "#15347E" },
    { key: "adventures", name: "Albania Adventures", city: "Durrës", tagline: "Sea & mountain experiences", color: "#1F5BE0" },
    { key: "lingua", name: "LinguaTirana", city: "Tirana", tagline: "Language & skills school", color: "#FF6A1F" },
    { key: "bookclub", name: "BookClub", city: "Online", tagline: "Audiobooks & e-reading", color: "#1A1610" },
    { key: "pool", name: "PoolHouse Fitness", city: "Tirana", tagline: "Gym, pilates & pool", color: "#FF6A1F" },
    { key: "cine", name: "CineCity", city: "Tirana", tagline: "Cinema & live events", color: "#1F5BE0" },
    { key: "clay", name: "Clay Studio", city: "Tirana", tagline: "Pottery & ceramics", color: "#B23C0A" },
  ];
  const prov: Record<string, string> = {};
  for (const p of providerData) {
    const created = await prisma.provider.create({
      data: { name: p.name, city: p.city, tagline: p.tagline, color: p.color },
    });
    prov[p.key] = created.id;
  }

  console.log("Creating offers…");
  // [key, providerKey, categorySlug, title, price, originalPrice|null, icon, moodTags, location, distanceKm|null, description]
  const offerData: [
    string, string, string, string, number, number | null, string, string, string, number | null, string
  ][] = [
    ["yoga", "lila", "wellness", "Restorative yoga · Sat AM", 22, null, "ti-yoga", "calm,solo,weekend,wellness,relax", "Studio Lila · Blloku", 0.8, "Slow, candle-lit restorative class to unwind the week."],
    ["vinyasa", "lila", "wellness", "Vinyasa flow class", 16, null, "ti-yoga", "energetic,wellness,morning,solo", "Studio Lila · Blloku", 0.8, "Dynamic morning flow to get the blood moving."],
    ["thermal", "aqua", "relax", "Thermal bath · 2hr pass", 24, null, "ti-bath", "calm,relax,weekend,wellness,solo", "Aqua Spa · Liqeni", 2.1, "Two hours in the thermal pools and steam room."],
    ["massage", "aqua", "relax", "Deep tissue massage · 60'", 38, null, "ti-massage", "calm,relax,wellness,solo", "Aqua Spa · Liqeni", 2.1, "Therapeutic 60-minute deep tissue massage."],
    ["spaday", "aqua", "relax", "Spa day for two", 70, 70, "ti-hot-tub", "calm,relax,weekend,date,celebrate,social", "Aqua Spa · Liqeni", 2.1, "A full spa circuit for two — pools, sauna, tea lounge."],
    ["gym", "pool", "wellness", "Gym monthly pass", 30, null, "ti-barbell", "energetic,fitness,wellness", "PoolHouse · Rr. e Kavajës", 1.2, "Unlimited gym access for a month."],
    ["pilates", "pool", "wellness", "Pilates · 5-pack", 45, null, "ti-stretching", "fitness,wellness,solo", "PoolHouse · Rr. e Kavajës", 1.2, "Five reformer pilates sessions."],
    ["coffee", "mon", "food", "Specialty coffee · 10 cups", 18, null, "ti-coffee", "social,food,coffee,morning", "Mon Café · Pazari i Ri", 0.4, "A ten-cup card for the best flat whites in town."],
    ["brunch", "mon", "food", "Weekend brunch for two", 26, null, "ti-egg-fried", "social,food,weekend,date", "Mon Café · Pazari i Ri", 0.4, "Lazy weekend brunch spread for two."],
    ["tasting", "mullixhiu", "food", "Tasting menu for two", 58, null, "ti-chef-hat", "social,food,celebrate,date", "Mullixhiu · Parku i Madh", 3.0, "Seven-course modern Albanian tasting menu."],
    ["wine", "wine", "food", "Natural wine tasting", 30, 30, "ti-glass", "social,food,weekend,celebrate", "WineVault · Blloku", 1.5, "Guided flight of six natural wines."],
    ["cooking", "mullixhiu", "learning", "Traditional cooking class", 34, null, "ti-tools-kitchen-2", "social,food,learning,family,creative", "Mullixhiu · Parku i Madh", 3.0, "Hands-on class making byrek and tave kosi."],
    ["audiobook", "bookclub", "learning", "Audiobook credit · 1 month", 9, null, "ti-book", "calm,solo,learning", "Online", null, "One month of unlimited audiobooks for the Sunday reset."],
    ["italian", "lingua", "learning", "Italian course · 8 lessons", 42, null, "ti-language", "learning,growth,social", "LinguaTirana · Qendër", 1.8, "Eight small-group Italian lessons."],
    ["speaking", "lingua", "learning", "Public speaking workshop", 28, null, "ti-microphone-2", "learning,growth,social", "LinguaTirana · Qendër", 1.8, "A confidence-building workshop for presenters."],
    ["kayak", "adventures", "travel", "Sunset kayak for two", 58, null, "ti-kayak", "adventure,nature,weekend,date,social", "Lalzit Bay", 25, "Guided sunset kayak along the bay, gear included."],
    ["surf", "adventures", "travel", "Surf lesson · 90'", 58, 58, "ti-ripple", "adventure,energetic,nature", "Durrës beach", 35, "Ninety-minute beginner surf lesson with a coach."],
    ["theth", "adventures", "travel", "Day trip to Theth", 75, null, "ti-mountain", "adventure,nature,weekend,family", "Theth NP", 70, "Guided day hike in the Albanian Alps."],
    ["paraglide", "adventures", "travel", "Paragliding tandem", 90, null, "ti-parachute", "adventure,thrill,celebrate", "Çajup", 60, "Tandem paragliding flight with a certified pilot."],
    ["bouldering", "vertigo", "wellness", "Bouldering · 10-pass", 40, null, "ti-mountain", "energetic,social,fitness,adventure", "Studio Vertigo · Don Bosko", 0.8, "Ten visits to the bouldering gym, beginners welcome."],
    ["cinema", "cine", "travel", "Cinema · 5 tickets", 25, null, "ti-movie", "social,relax,family", "CineCity · TEG", 5.0, "Five cinema tickets to share."],
    ["concert", "cine", "travel", "Live concert ticket", 35, null, "ti-music", "social,music,celebrate", "Amfiteatri", 4.0, "A ticket to this season's live shows."],
    ["pottery", "clay", "learning", "Pottery class", 20, 20, "ti-bowl", "calm,learning,creative,solo", "Clay Studio · Ish-Blloku", 1.1, "Beginner wheel-throwing pottery class."],
  ];

  const offer: Record<string, { id: string; price: number; title: string; providerId: string }> = {};
  for (const [key, pk, cs, title, price, orig, icon, tags, loc, dist, desc] of offerData) {
    const created = await prisma.offer.create({
      data: {
        title,
        description: desc,
        price,
        originalPrice: orig,
        icon,
        moodTags: tags,
        location: loc,
        distanceKm: dist,
        providerId: prov[pk],
        categoryId: cat[cs],
      },
    });
    offer[key] = { id: created.id, price, title, providerId: prov[pk] };
  }

  console.log("Creating drops…");
  await prisma.drop.create({
    data: { offerId: offer.spaday.id, headline: true, discountPct: 50, dropPrice: 35, quantityTotal: 40, quantityClaimed: 18, expiresAt: inHours(4, 12) },
  });
  await prisma.drop.create({
    data: { offerId: offer.wine.id, discountPct: 40, dropPrice: 18, quantityTotal: 20, quantityClaimed: 11, expiresAt: inHours(2, 40) },
  });
  await prisma.drop.create({
    data: { offerId: offer.surf.id, discountPct: 50, dropPrice: 29, quantityTotal: 12, quantityClaimed: 8, expiresAt: inHours(5, 55) },
  });
  await prisma.drop.create({
    data: { offerId: offer.pottery.id, discountPct: 30, dropPrice: 14, quantityTotal: 8, quantityClaimed: 8, expiresAt: inHours(6, 0) },
  });

  console.log("Creating badges…");
  const badgeData = [
    { slug: "first-spin", name: "First spin", icon: "ti-flame", points: 50, description: "Took your first weekly spin." },
    { slug: "steps-10k", name: "10k steps", icon: "ti-shoe", points: 60, description: "Logged 10,000 steps in a day." },
    { slug: "generous", name: "Generous", icon: "ti-gift", points: 75, description: "Gifted a perk to a teammate." },
    { slug: "reviewer", name: "Reviewer", icon: "ti-star", points: 50, description: "Left your first review." },
    { slug: "drop-hunter", name: "Drop hunter", icon: "ti-bolt", points: 80, description: "Claimed a Friday drop." },
    { slug: "pool-starter", name: "Pool starter", icon: "ti-users", points: 90, description: "Started or joined a team pool." },
    { slug: "barista-pal", name: "Barista pal", icon: "ti-coffee", points: 40, description: "Booked a coffee perk." },
    { slug: "streak-5", name: "5-wk streak", icon: "ti-confetti", points: 120, description: "Five-week check-in streak." },
    { slug: "curator", name: "Curator", icon: "ti-wand", points: 90, description: "Booked an AI 3-provider combo." },
    { slug: "globetrot", name: "Globetrot", icon: "ti-plane", points: 100, description: "Booked a travel experience." },
    { slug: "marathon", name: "Marathon", icon: "ti-run", points: 300, description: "Won a steps championship." },
    { slug: "big-spender", name: "Big spender", icon: "ti-coins", points: 100, description: "Spent over 200 PX in benefits." },
    { slug: "early-bird", name: "Early bird", icon: "ti-sunrise", points: 50, description: "Booked a morning perk." },
    { slug: "night-owl", name: "Night owl", icon: "ti-moon", points: 50, description: "Booked an evening perk." },
    { slug: "foodie", name: "Foodie", icon: "ti-tools-kitchen-2", points: 60, description: "Booked three food perks." },
    { slug: "zen-master", name: "Zen master", icon: "ti-lotus", points: 80, description: "Booked five wellness perks." },
    { slug: "team-captain", name: "Team captain", icon: "ti-flag", points: 150, description: "Led your department's race." },
    { slug: "hype-beast", name: "Hype beast", icon: "ti-mood-smile", points: 40, description: "Reacted to ten perks." },
    { slug: "scout", name: "Scout", icon: "ti-map-pin", points: 200, description: "Referred a provider who joined." },
    { slug: "lucky-7", name: "Lucky 7", icon: "ti-clover", points: 77, description: "Won big on the wheel." },
    { slug: "streak-12", name: "Streak 12", icon: "ti-calendar", points: 240, description: "Twelve-week streak." },
    { slug: "mystery-fan", name: "Mystery fan", icon: "ti-gift", points: 75, description: "Opened a mystery box." },
    { slug: "linguist", name: "Linguist", icon: "ti-language", points: 90, description: "Booked a language course." },
    { slug: "legend", name: "Legend", icon: "ti-crown", points: 500, description: "Earned every other badge." },
  ];
  const badge: Record<string, string> = {};
  for (const b of badgeData) {
    const created = await prisma.badge.create({ data: b });
    badge[b.slug] = created.id;
  }

  console.log("Creating users…");
  // role EMPLOYEE unless noted. [name, email, dept, initials, color, budgetTotal, points, streak, steps]
  const employeeData: [string, string, string, string, string, number, number, number, number][] = [
    ["Kedi Kacorri", "kedi@teamsystem.al", "Design", "KK", "#1F5BE0", 600, 2140, 5, 84210],
    ["Priya Anand", "priya@teamsystem.al", "Design", "PA", "#FF6A1F", 600, 1980, 4, 81540],
    ["Erion Hoxha", "erion@teamsystem.al", "Design", "EH", "#15347E", 600, 1620, 3, 52300],
    ["Megi Leka", "megi@teamsystem.al", "Sales", "ML", "#B23C0A", 600, 2010, 6, 60100],
    ["Tom Marku", "tom@teamsystem.al", "Sales", "TM", "#1F5BE0", 600, 1740, 2, 47800],
    ["Sara Kola", "sara@teamsystem.al", "Engineering", "SK", "#1F5BE0", 600, 1880, 3, 49500],
    ["Ardit Beqiri", "ardit@teamsystem.al", "Engineering", "AB", "#FF6A1F", 600, 1450, 1, 40200],
    ["Nora Dervishi", "nora@teamsystem.al", "Engineering", "ND", "#15347E", 600, 1390, 2, 38900],
    ["Blerim Shehu", "blerim@teamsystem.al", "Ops", "BS", "#B23C0A", 600, 1210, 1, 31000],
    ["Greta Prifti", "greta@teamsystem.al", "Ops", "GP", "#1F5BE0", 600, 1060, 0, 28700],
  ];
  const users: Record<string, { id: string; name: string }> = {};
  for (const [name, email, dept, initials, color, budget, points, streak, steps] of employeeData) {
    const u = await prisma.user.create({
      data: {
        name,
        email,
        role: "EMPLOYEE",
        initials,
        color,
        budgetTotal: budget,
        points,
        streakWeeks: streak,
        stepsThisWeek: steps,
        companyId: company.id,
        departmentId: depts[dept],
        lastSpinAt: name === "Kedi Kacorri" ? null : daysAgo(2),
      },
    });
    users[email] = { id: u.id, name };
  }
  const kedi = users["kedi@teamsystem.al"];

  // HR / employer admin
  const admin = await prisma.user.create({
    data: {
      name: "Elira Hysa",
      email: "elira@teamsystem.al",
      role: "ADMIN",
      initials: "EH",
      color: "#1A1610",
      companyId: company.id,
      departmentId: depts["Ops"],
      budgetTotal: 0,
    },
  });

  // A provider account (Studio Vertigo owner)
  await prisma.user.create({
    data: {
      name: "Driton (Studio Vertigo)",
      email: "vertigo@partner.al",
      role: "PROVIDER",
      initials: "DV",
      color: "#1F5BE0",
      providerId: prov.vertigo,
      budgetTotal: 0,
    },
  });

  console.log("Awarding badges to Kedi…");
  const kediBadges = ["first-spin", "steps-10k", "generous", "reviewer", "drop-hunter", "pool-starter", "barista-pal", "streak-5", "curator"];
  for (const slug of kediBadges) {
    await prisma.userBadge.create({ data: { userId: kedi.id, badgeId: badge[slug], earnedAt: daysAgo(Math.ceil(Math.random() * 30)) } });
  }
  // give a couple to others
  await prisma.userBadge.create({ data: { userId: users["priya@teamsystem.al"].id, badgeId: badge["reviewer"] } });
  await prisma.userBadge.create({ data: { userId: users["megi@teamsystem.al"].id, badgeId: badge["streak-5"] } });

  console.log("Seeding points ledger for Kedi…");
  const kediLedger = [
    { amount: 50, reason: "Booked a perk", d: 21 },
    { amount: 120, reason: "Weekly spin — Double-points Friday", d: 18 },
    { amount: 25, reason: "Review with photo", d: 16 },
    { amount: 200, reason: "Referred a provider", d: 12 },
    { amount: 90, reason: "Curator — 3-provider combo", d: 9 },
    { amount: 15, reason: "Gifted a teammate", d: 6 },
    { amount: 80, reason: "Won a step race", d: 3 },
  ];
  for (const e of kediLedger) {
    await prisma.pointsEntry.create({ data: { userId: kedi.id, amount: e.amount, reason: e.reason, createdAt: daysAgo(e.d) } });
  }

  console.log("Seeding reviews & reactions…");
  const reviewData: [string, string, number, string, number][] = [
    // offerKey, userEmail, rating, body, helpful
    ["bouldering", "priya@teamsystem.al", 5, "Went with two teammates on a Friday — our thing now. Super welcoming to beginners.", 12],
    ["bouldering", "tom@teamsystem.al", 4, "Great value with the perk budget. Gets busy after 6pm — go earlier.", 5],
    ["bouldering", "sara@teamsystem.al", 5, "Best stress relief of my week. Staff are lovely.", 3],
    ["bouldering", "ardit@teamsystem.al", 4, "Solid gym, could use more easy routes.", 1],
    ["yoga", "kedi@teamsystem.al", 5, "Exactly the Sunday reset I needed. Booked it again.", 8],
    ["yoga", "megi@teamsystem.al", 5, "Candle-lit and calming, instructor is wonderful.", 4],
    ["thermal", "kedi@teamsystem.al", 4, "Lovely thermal pools, towels included.", 2],
    ["coffee", "sara@teamsystem.al", 5, "My daily flat white sorted for the month.", 6],
    ["tasting", "priya@teamsystem.al", 5, "Special-occasion worthy. Every course landed.", 9],
    ["kayak", "tom@teamsystem.al", 5, "Sunset over the bay — unreal. Take the combo.", 7],
    ["wine", "megi@teamsystem.al", 4, "Fun guided flight, learned a lot.", 2],
    ["massage", "nora@teamsystem.al", 5, "Worked out every launch-week knot.", 3],
  ];
  for (const [ok, email, rating, body, helpful] of reviewData) {
    await prisma.review.create({
      data: { offerId: offer[ok].id, userId: users[email].id, rating, body, helpfulCount: helpful, createdAt: daysAgo(Math.ceil(Math.random() * 20)) },
    });
  }
  const reactionData: [string, string, string][] = [
    ["bouldering", "priya@teamsystem.al", "🔥"],
    ["bouldering", "tom@teamsystem.al", "🔥"],
    ["bouldering", "sara@teamsystem.al", "😍"],
    ["bouldering", "ardit@teamsystem.al", "💪"],
    ["bouldering", "megi@teamsystem.al", "💪"],
    ["yoga", "kedi@teamsystem.al", "😍"],
    ["kayak", "tom@teamsystem.al", "🔥"],
  ];
  for (const [ok, email, emoji] of reactionData) {
    await prisma.reaction.create({ data: { offerId: offer[ok].id, userId: users[email].id, emoji } });
  }

  console.log("Seeding team pool…");
  const pool = await prisma.teamPool.create({
    data: { name: "Design offsite dinner", companyId: company.id, goal: 800 },
  });
  const poolContribs: [string, number][] = [
    ["kedi@teamsystem.al", 120],
    ["priya@teamsystem.al", 120],
    ["erion@teamsystem.al", 100],
    ["megi@teamsystem.al", 100],
    ["sara@teamsystem.al", 100],
    ["tom@teamsystem.al", 100],
  ];
  for (const [email, amount] of poolContribs) {
    await prisma.poolContribution.create({ data: { poolId: pool.id, userId: users[email].id, amount } });
  }

  console.log("Seeding gift…");
  await prisma.gift.create({
    data: {
      fromUserId: kedi.id,
      toUserId: users["sara@teamsystem.al"].id,
      offerId: offer.coffee.id,
      label: "Coffee",
      amount: 4,
      message: "Thanks for covering my deploy 🙏",
      createdAt: daysAgo(6),
    },
  });

  console.log("Seeding historical orders (for analytics)…");
  // Helper to create a PAID order with items + payments.
  async function createPaidOrder(userEmail: string, offerKeys: string[], dayOffset: number, source = "MANUAL") {
    const items = offerKeys.map((k) => offer[k]);
    const total = items.reduce((s, i) => s + i.price, 0);
    const order = await prisma.order.create({
      data: {
        userId: users[userEmail].id,
        status: "PAID",
        source,
        title: items.length > 1 ? `${items[0].title} +${items.length - 1} more` : items[0].title,
        total,
        approvedById: admin.id,
        approvedAt: daysAgo(dayOffset),
        createdAt: daysAgo(dayOffset + 1),
        items: {
          create: items.map((i) => ({ offerId: i.id, title: i.title, price: i.price, qty: 1 })),
        },
      },
    });
    // group payments by provider
    const byProvider: Record<string, number> = {};
    for (const i of items) byProvider[i.providerId] = (byProvider[i.providerId] || 0) + i.price;
    for (const [providerId, amount] of Object.entries(byProvider)) {
      await prisma.payment.create({
        data: { orderId: order.id, providerId, amount, reference: "PX-" + Math.random().toString(36).slice(2, 8).toUpperCase(), createdAt: daysAgo(dayOffset) },
      });
    }
    return order;
  }

  // A spread of paid history across the team.
  const history: [string, string[], number][] = [
    ["kedi@teamsystem.al", ["coffee"], 20],
    ["kedi@teamsystem.al", ["yoga", "thermal", "audiobook"], 9], // the AI combo
    ["priya@teamsystem.al", ["tasting"], 14],
    ["priya@teamsystem.al", ["bouldering"], 7],
    ["erion@teamsystem.al", ["gym"], 11],
    ["megi@teamsystem.al", ["wine", "brunch"], 8],
    ["tom@teamsystem.al", ["kayak"], 6],
    ["tom@teamsystem.al", ["bouldering"], 25],
    ["sara@teamsystem.al", ["coffee", "pilates"], 5],
    ["ardit@teamsystem.al", ["gym"], 13],
    ["nora@teamsystem.al", ["massage"], 4],
    ["blerim@teamsystem.al", ["cinema"], 10],
    ["greta@teamsystem.al", ["italian"], 16],
    ["megi@teamsystem.al", ["concert"], 2],
    ["sara@teamsystem.al", ["surf"], 3],
    ["erion@teamsystem.al", ["cooking"], 18],
  ];
  for (const [email, keys, day] of history) {
    await createPaidOrder(email, keys, day, keys.length >= 3 ? "PLANNER" : "MANUAL");
  }

  console.log("Seeding a pending approval (live demo)…");
  // One pending order awaiting the admin so the dashboard has something to approve.
  const pendingItems = [offer.massage, offer.wine];
  const pendingTotal = pendingItems.reduce((s, i) => s + i.price, 0);
  await prisma.order.create({
    data: {
      userId: users["priya@teamsystem.al"].id,
      status: "PENDING",
      source: "PLANNER",
      title: "Decompress combo",
      total: pendingTotal,
      reasoning: "A calming wind-down across two providers, chosen to fit a single weekend within budget.",
      items: { create: pendingItems.map((i) => ({ offerId: i.id, title: i.title, price: i.price, qty: 1 })) },
    },
  });

  console.log("✅ Seed complete.");
  const counts = {
    companies: await prisma.company.count(),
    users: await prisma.user.count(),
    providers: await prisma.provider.count(),
    offers: await prisma.offer.count(),
    drops: await prisma.drop.count(),
    orders: await prisma.order.count(),
    badges: await prisma.badge.count(),
  };
  console.log(counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
