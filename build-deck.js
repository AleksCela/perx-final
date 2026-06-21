const pptxgen = require("pptxgenjs");
const p = new pptxgen();

p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";

// ---- Brand palette (informed by the Perx app) -------------------------------
const INK = "1A1610";
const INK2 = "2A2419";
const ORANGE = "FF6A1F";
const ORANGE_D = "B23C0A";
const BLUE = "1F5BE0";
const BLUE_D = "15347E";
const CREAM = "FBF6EC";
const CARD = "F5EFE3";
const WHITE = "FFFFFF";
const MUTED = "8A8174";
const MUTED_L = "C9C0B2"; // muted on dark

const HF = "Georgia";       // header font
const BF = "Calibri";       // body font

const W = 13.333, H = 7.5;

// ---- helpers ----------------------------------------------------------------
function circle(s, x, y, d, fill, emoji, sz = 18) {
  s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill } });
  s.addText(emoji, {
    x, y, w: d, h: d, align: "center", valign: "middle",
    fontSize: sz, color: WHITE, fontFace: BF,
  });
}
function kicker(s, x, y, text, color = ORANGE) {
  s.addText(text.toUpperCase(), {
    x, y, w: 8, h: 0.3, fontFace: BF, fontSize: 11, bold: true,
    color, charSpacing: 3, align: "left",
  });
}
function pageNum(s, n, dark = false) {
  s.addText(`${n}`, {
    x: W - 0.9, y: H - 0.6, w: 0.5, h: 0.3, align: "right",
    fontFace: BF, fontSize: 10, color: dark ? MUTED_L : MUTED,
  });
  s.addText("perx", {
    x: 0.5, y: H - 0.6, w: 1.2, h: 0.3, align: "left",
    fontFace: HF, fontSize: 12, bold: true, color: dark ? ORANGE : INK,
  });
}

// =============================================================================
// 1. TITLE  (dark)
// =============================================================================
let s = p.addSlide();
s.background = { color: INK };
// soft brand dots motif
s.addShape(p.ShapeType.ellipse, { x: 10.6, y: -1.4, w: 4.2, h: 4.2, fill: { color: INK2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.8, y: 4.9, w: 3.4, h: 3.4, fill: { color: INK2 } });
circle(s, 0.9, 0.85, 0.62, ORANGE, "✦", 20);
s.addText("perx", { x: 1.65, y: 0.78, w: 3, h: 0.7, fontFace: HF, fontSize: 30, bold: true, color: WHITE });

s.addText("The perks employees\nactually want.", {
  x: 0.9, y: 2.35, w: 9.5, h: 2.2, fontFace: HF, fontSize: 50, bold: true,
  color: WHITE, lineSpacingMultiple: 0.98,
});
s.addText("A two-sided benefits marketplace — built for Albania, ready for the world.", {
  x: 0.95, y: 4.55, w: 9.4, h: 0.6, fontFace: BF, fontSize: 18, color: MUTED_L,
});
// chips
const chips = [["Next.js 16", BLUE], ["React 19", ORANGE], ["Prisma · SQLite", ORANGE_D]];
let cx = 0.95;
chips.forEach(([t, c]) => {
  const w = 0.42 + t.length * 0.105;
  s.addShape(p.ShapeType.roundRect, { x: cx, y: 5.45, w, h: 0.5, rectRadius: 0.25, fill: { color: c } });
  s.addText(t, { x: cx, y: 5.45, w, h: 0.5, align: "center", valign: "middle", fontFace: BF, fontSize: 13, bold: true, color: WHITE });
  cx += w + 0.25;
});
pageNum(s, 1, true);

// =============================================================================
// 2. THE PROBLEM (light)
// =============================================================================
s = p.addSlide();
s.background = { color: CREAM };
kicker(s, 0.7, 0.55, "The problem");
s.addText("Benefits today are\nforgettable, taxed, unused.", {
  x: 0.7, y: 0.9, w: 8, h: 1.5, fontFace: HF, fontSize: 34, bold: true, color: INK, lineSpacingMultiple: 1.0,
});

const probs = [
  ["💸", "Eaten by tax", "Cash bonuses lose ~41% to employer + employee tax before they reach the team.", ORANGE_D],
  ["😴", "One-size-fits-none", "A gym voucher nobody uses. Perks rarely match what people actually want.", BLUE_D],
  ["🙈", "Invisible to HR", "No view of adoption, spend or ROI — benefits become a cost, not an edge.", ORANGE],
  ["🧾", "Painful to run", "Reimbursements, receipts and approvals scattered across email and chat.", BLUE],
];
let py = 2.75;
probs.forEach(([emo, h, d, c], i) => {
  const x = i % 2 === 0 ? 0.7 : 6.9;
  if (i % 2 === 0 && i > 0) py += 1.85;
  const yy = i < 2 ? 2.75 : 4.6;
  s.addShape(p.ShapeType.roundRect, { x, y: yy, w: 5.7, h: 1.65, rectRadius: 0.1, fill: { color: WHITE }, line: { color: "EAE2D2", width: 1 } });
  circle(s, x + 0.28, yy + 0.32, 0.7, c, emo, 22);
  s.addText(h, { x: x + 1.2, y: yy + 0.26, w: 4.3, h: 0.45, fontFace: HF, fontSize: 17, bold: true, color: INK });
  s.addText(d, { x: x + 1.2, y: yy + 0.72, w: 4.35, h: 0.8, fontFace: BF, fontSize: 12.5, color: MUTED });
});
pageNum(s, 2);

// =============================================================================
// 3. WHAT IS PERX (dark, big statement)
// =============================================================================
s = p.addSlide();
s.background = { color: INK };
kicker(s, 0.7, 0.6, "What is Perx", ORANGE);
s.addText(
  [
    { text: "One marketplace where employees ", options: { color: WHITE } },
    { text: "build the perks they want", options: { color: ORANGE } },
    { text: ", employers ", options: { color: WHITE } },
    { text: "approve in one click", options: { color: BLUE } },
    { text: ", and providers ", options: { color: WHITE } },
    { text: "get paid directly", options: { color: ORANGE } },
    { text: ".", options: { color: WHITE } },
  ],
  { x: 0.7, y: 1.05, w: 11.9, h: 1.9, fontFace: HF, fontSize: 30, bold: true, lineSpacingMultiple: 1.05 }
);

const stats = [
  ["3", "actor views", "employee · employer · provider", ORANGE],
  ["12", "providers", "23+ live offers across 5 categories", BLUE],
  ["24", "badges", "full points + gamification layer", ORANGE_D],
  ["41%", "tax avoided", "value delivered vs. taxed salary", BLUE_D],
];
stats.forEach(([n, l, d, c], i) => {
  const x = 0.7 + i * 3.0;
  s.addShape(p.ShapeType.roundRect, { x, y: 3.5, w: 2.75, h: 2.9, rectRadius: 0.12, fill: { color: INK2 } });
  s.addShape(p.ShapeType.rect, { x: x, y: 3.5, w: 0.12, h: 2.9, fill: { color: c } });
  s.addText(n, { x: x + 0.1, y: 3.75, w: 2.5, h: 1.1, align: "center", fontFace: HF, fontSize: 48, bold: true, color: c });
  s.addText(l.toUpperCase(), { x: x + 0.1, y: 4.85, w: 2.5, h: 0.4, align: "center", fontFace: BF, fontSize: 14, bold: true, color: WHITE, charSpacing: 1 });
  s.addText(d, { x: x + 0.25, y: 5.3, w: 2.3, h: 0.9, align: "center", fontFace: BF, fontSize: 11.5, color: MUTED_L });
});
pageNum(s, 3, true);

// =============================================================================
// 4. THREE ACTORS (light)
// =============================================================================
s = p.addSlide();
s.background = { color: CREAM };
kicker(s, 0.7, 0.55, "Three actors, one dataset");
s.addText("Same data, three points of view", {
  x: 0.7, y: 0.9, w: 11, h: 0.8, fontFace: HF, fontSize: 32, bold: true, color: INK,
});
const actors = [
  ["👩‍💻", "Employee", "Kedi, Priya, Tom…", ORANGE,
    ["Browse & build perk combos", "AI planner, drops, mystery box", "Wallet, points, badges & play", "Orders + QR redemption"]],
  ["📊", "Employer / HR", "Elira Hysa", BLUE,
    ["One-click approve & pay", "Live tax-savings counter", "Adoption & spend analytics", "Per-provider payment feed"]],
  ["🏪", "Provider", "Driton · Studio Vertigo", ORANGE_D,
    ["Their live offers & bookings", "Incoming simulated payments", "Rating & reviews", "Scan customer QR to redeem"]],
];
actors.forEach(([emo, role, who, c, items], i) => {
  const x = 0.7 + i * 4.05;
  s.addShape(p.ShapeType.roundRect, { x, y: 2.0, w: 3.75, h: 4.7, rectRadius: 0.12, fill: { color: WHITE }, line: { color: "EAE2D2", width: 1 } });
  s.addShape(p.ShapeType.roundRect, { x, y: 2.0, w: 3.75, h: 1.25, rectRadius: 0.12, fill: { color: c } });
  s.addShape(p.ShapeType.rect, { x, y: 2.6, w: 3.75, h: 0.65, fill: { color: c } });
  circle(s, x + 0.3, y_(2.35), 0.62, WHITE === WHITE ? INK : INK, emo, 22);
  s.addText(role, { x: x + 1.05, y: 2.25, w: 2.6, h: 0.45, fontFace: HF, fontSize: 19, bold: true, color: WHITE });
  s.addText(who, { x: x + 1.05, y: 2.72, w: 2.6, h: 0.4, fontFace: BF, fontSize: 12.5, italic: true, color: "FFFFFF" });
  s.addText(
    items.map((t) => ({ text: t, options: { bullet: { code: "2022", indent: 14 }, color: INK, paraSpaceAfter: 9 } })),
    { x: x + 0.32, y: 3.5, w: 3.2, h: 3.0, fontFace: BF, fontSize: 13, color: INK, valign: "top" }
  );
});
function y_(v) { return v; }
pageNum(s, 4);

// =============================================================================
// 5. THE CORE LOOP (light, process flow)
// =============================================================================
s = p.addSlide();
s.background = { color: WHITE };
kicker(s, 0.7, 0.55, "How it works");
s.addText("The core loop", { x: 0.7, y: 0.9, w: 11, h: 0.8, fontFace: HF, fontSize: 32, bold: true, color: INK });
s.addText("Money never passes through the employee's hands — it routes straight to each provider on approval.", {
  x: 0.7, y: 1.65, w: 11.5, h: 0.4, fontFace: BF, fontSize: 14, color: MUTED,
});
const steps = [
  ["🛍️", "Browse", "Discover offers, drops & the AI bundle", ORANGE],
  ["🧩", "Build a combo", "Bundle several providers into one package", BLUE],
  ["📨", "Submit", "Send the selection to the employer", ORANGE_D],
  ["✅", "Approve & pay", "One click → simulated payment per provider", BLUE_D],
  ["🎫", "Redeem", "Confirmed in Orders → show QR at the venue", ORANGE],
];
const sw = 2.25, gap = 0.18, startX = 0.7, sy = 2.7;
steps.forEach(([emo, h, d, c], i) => {
  const x = startX + i * (sw + gap);
  s.addShape(p.ShapeType.roundRect, { x, y: sy, w: sw, h: 3.2, rectRadius: 0.1, fill: { color: CARD } });
  s.addShape(p.ShapeType.rect, { x, y: sy, w: sw, h: 0.12, fill: { color: c } });
  circle(s, x + sw / 2 - 0.45, sy + 0.45, 0.9, c, emo, 28);
  s.addText(`STEP ${i + 1}`, { x, y: sy + 1.45, w: sw, h: 0.3, align: "center", fontFace: BF, fontSize: 10, bold: true, color: c, charSpacing: 2 });
  s.addText(h, { x, y: sy + 1.72, w: sw, h: 0.45, align: "center", fontFace: HF, fontSize: 18, bold: true, color: INK });
  s.addText(d, { x: x + 0.18, y: sy + 2.2, w: sw - 0.36, h: 0.9, align: "center", fontFace: BF, fontSize: 11.5, color: MUTED });
  if (i < steps.length - 1) {
    s.addText("→", { x: x + sw - 0.02, y: sy + 0.7, w: 0.25, h: 0.5, align: "center", valign: "middle", fontFace: BF, fontSize: 22, bold: true, color: c });
  }
});
pageNum(s, 5);

// =============================================================================
// 6. AI PLANNER (dark, two-column)
// =============================================================================
s = p.addSlide();
s.background = { color: INK };
kicker(s, 0.7, 0.6, "Signature feature", ORANGE);
s.addText("The AI Planner", { x: 0.7, y: 0.95, w: 7, h: 0.8, fontFace: HF, fontSize: 34, bold: true, color: WHITE });
s.addText("Type a feeling and a budget. Perx turns it into a complementary, cross-provider combo — with a human reason for every pick. Deterministic and fully offline.", {
  x: 0.7, y: 1.85, w: 6.3, h: 1.6, fontFace: BF, fontSize: 15, color: MUTED_L, lineSpacingMultiple: 1.15,
});
const feats = [
  ["🧠", "Mood lexicon", "Maps free text → tags (calm, social, active…)"],
  ["🎯", "Catalog scoring", "Ranks offers by mood, rating & distance"],
  ["💰", "Budget-aware bundler", "Fills the basket without breaking the cap"],
];
feats.forEach(([emo, h, d], i) => {
  const yy = 3.6 + i * 1.05;
  circle(s, 0.7, yy, 0.7, ORANGE, emo, 20);
  s.addText(h, { x: 1.6, y: yy - 0.02, w: 5.4, h: 0.4, fontFace: HF, fontSize: 16, bold: true, color: WHITE });
  s.addText(d, { x: 1.6, y: yy + 0.38, w: 5.4, h: 0.4, fontFace: BF, fontSize: 12.5, color: MUTED_L });
});
// mock combo card on the right
const mx = 7.7;
s.addShape(p.ShapeType.roundRect, { x: mx, y: 1.55, w: 4.95, h: 5.2, rectRadius: 0.12, fill: { color: CREAM } });
s.addText('"stressed before a launch — something calming this weekend under 60 PX"', {
  x: mx + 0.35, y: 1.85, w: 4.3, h: 0.9, fontFace: BF, fontSize: 13, italic: true, color: INK,
});
s.addShape(p.ShapeType.line, { x: mx + 0.35, y: 2.85, w: 4.25, h: 0, line: { color: "E0D8C8", width: 1 } });
const combo = [
  ["🧖", "Thermal bath · 2hr pass", "Aqua Spa", "24 PX", BLUE],
  ["🧘", "Restorative yoga · Sat AM", "Studio Lila", "22 PX", ORANGE],
  ["📖", "Audiobook credit · 1 mo", "BookClub", "9 PX", ORANGE_D],
];
combo.forEach(([emo, t, prov, price, c], i) => {
  const yy = 3.05 + i * 0.82;
  circle(s, mx + 0.35, yy, 0.55, c, emo, 16);
  s.addText(t, { x: mx + 1.05, y: yy - 0.02, w: 2.7, h: 0.35, fontFace: BF, fontSize: 12.5, bold: true, color: INK });
  s.addText(prov, { x: mx + 1.05, y: yy + 0.31, w: 2.7, h: 0.3, fontFace: BF, fontSize: 10.5, color: MUTED });
  s.addText(price, { x: mx + 3.7, y: yy + 0.05, w: 0.95, h: 0.4, align: "right", fontFace: HF, fontSize: 13, bold: true, color: INK });
});
s.addShape(p.ShapeType.roundRect, { x: mx + 0.35, y: 5.65, w: 4.25, h: 0.85, rectRadius: 0.1, fill: { color: INK } });
s.addText("Total 55 PX", { x: mx + 0.6, y: 5.78, w: 2.2, h: 0.6, valign: "middle", fontFace: HF, fontSize: 16, bold: true, color: WHITE });
s.addText("23 PX saved vs. salary", { x: mx + 2.3, y: 5.78, w: 2.1, h: 0.6, align: "right", valign: "middle", fontFace: BF, fontSize: 12, bold: true, color: ORANGE });
pageNum(s, 6, true);

// =============================================================================
// 7. ENGAGEMENT & GAMIFICATION (light grid)
// =============================================================================
s = p.addSlide();
s.background = { color: CREAM };
kicker(s, 0.7, 0.55, "Stickiness");
s.addText("Engagement & gamification", { x: 0.7, y: 0.9, w: 11, h: 0.8, fontFace: HF, fontSize: 32, bold: true, color: INK });
s.addText("Make benefits a habit, not a chore.", { x: 0.7, y: 1.62, w: 9, h: 0.4, fontFace: BF, fontSize: 14, color: MUTED });
const games = [
  ["⚡", "Friday drops", "Live countdowns & scarcity on limited deals", ORANGE],
  ["🎁", "Mystery box", "A free, employer-funded surprise within budget", BLUE],
  ["🎡", "Weekly spin", "Spin the wheel once a week for bonus points", ORANGE_D],
  ["🏅", "24 badges", "Curator, Drop-hunter, Big-spender & more", BLUE_D],
  ["👟", "Steps championship", "Team step races with a weekly winner", ORANGE],
  ["🏆", "Dept leaderboards", "Team-vs-team points & a live activity feed", BLUE],
];
games.forEach(([emo, h, d, c], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 0.7 + col * 4.05, yy = 2.25 + row * 2.15;
  s.addShape(p.ShapeType.roundRect, { x, y: yy, w: 3.75, h: 1.9, rectRadius: 0.1, fill: { color: WHITE }, line: { color: "EAE2D2", width: 1 } });
  circle(s, x + 0.3, yy + 0.32, 0.72, c, emo, 22);
  s.addText(h, { x: x + 1.2, y: yy + 0.3, w: 2.4, h: 0.45, fontFace: HF, fontSize: 16, bold: true, color: INK });
  s.addText(d, { x: x + 1.2, y: yy + 0.78, w: 2.45, h: 0.95, fontFace: BF, fontSize: 12, color: MUTED });
});
pageNum(s, 7);

// =============================================================================
// 8. SOCIAL + NEW QR REDEMPTION (dark, split)
// =============================================================================
s = p.addSlide();
s.background = { color: INK };
kicker(s, 0.7, 0.6, "Social & redemption", ORANGE);
s.addText("Shared, social, and redeemable", { x: 0.7, y: 0.95, w: 11, h: 0.7, fontFace: HF, fontSize: 32, bold: true, color: WHITE });

// left: social
s.addShape(p.ShapeType.roundRect, { x: 0.7, y: 1.95, w: 5.85, h: 4.65, rectRadius: 0.12, fill: { color: INK2 } });
s.addText("Social layer", { x: 1.05, y: 2.2, w: 5, h: 0.5, fontFace: HF, fontSize: 18, bold: true, color: ORANGE });
const social = [
  ["⭐", "Reviews & emoji reactions on every offer"],
  ["🔥", "“Trending in your office” social proof"],
  ["🎁", "Gift a perk to a teammate"],
  ["🤝", "Team pools — chip in toward a shared goal"],
  ["📣", "Refer a local spot, earn points when it joins"],
];
social.forEach(([emo, t], i) => {
  const yy = 2.85 + i * 0.74;
  circle(s, 1.05, yy, 0.5, BLUE, emo, 15);
  s.addText(t, { x: 1.72, y: yy, w: 4.7, h: 0.5, valign: "middle", fontFace: BF, fontSize: 13.5, color: WHITE });
});

// right: NEW QR feature highlighted
s.addShape(p.ShapeType.roundRect, { x: 6.85, y: 1.95, w: 5.8, h: 4.65, rectRadius: 0.12, fill: { color: CREAM } });
s.addShape(p.ShapeType.roundRect, { x: 7.15, y: 2.2, w: 1.4, h: 0.45, rectRadius: 0.22, fill: { color: ORANGE } });
s.addText("NEW", { x: 7.15, y: 2.2, w: 1.4, h: 0.45, align: "center", valign: "middle", fontFace: BF, fontSize: 12, bold: true, color: WHITE });
s.addText("QR redemption", { x: 8.7, y: 2.18, w: 3.7, h: 0.5, valign: "middle", fontFace: HF, fontSize: 18, bold: true, color: INK });
// QR glyph mock
s.addShape(p.ShapeType.roundRect, { x: 7.15, y: 2.95, w: 1.7, h: 1.7, rectRadius: 0.06, fill: { color: WHITE }, line: { color: INK, width: 1.5 } });
s.addText("▦", { x: 7.15, y: 2.95, w: 1.7, h: 1.7, align: "center", valign: "middle", fontFace: BF, fontSize: 64, color: INK });
s.addText(
  [
    { text: "Employee", options: { bold: true, color: ORANGE_D } },
    { text: " taps Show QR on a paid order.\n", options: { color: INK } },
    { text: "Provider", options: { bold: true, color: BLUE_D } },
    { text: " scans it with the camera to confirm the booking — one-time, can't be reused.", options: { color: INK } },
  ],
  { x: 9.1, y: 2.95, w: 3.25, h: 1.7, fontFace: BF, fontSize: 13, color: INK, valign: "top", lineSpacingMultiple: 1.1 }
);
s.addText("Built on a native in-browser barcode scanner — no extra app to install.", {
  x: 7.15, y: 4.95, w: 5.2, h: 0.9, fontFace: BF, fontSize: 12.5, italic: true, color: MUTED,
});
pageNum(s, 8, true);

// =============================================================================
// 9. EMPLOYER INSIGHTS (light, stat hero)
// =============================================================================
s = p.addSlide();
s.background = { color: WHITE };
kicker(s, 0.7, 0.55, "For the employer");
s.addText("Benefits become an edge, not a cost", { x: 0.7, y: 0.9, w: 11.5, h: 0.8, fontFace: HF, fontSize: 32, bold: true, color: INK });

// hero tax card
s.addShape(p.ShapeType.roundRect, { x: 0.7, y: 2.0, w: 5.6, h: 4.6, rectRadius: 0.14, fill: { color: INK } });
s.addShape(p.ShapeType.roundRect, { x: 1.0, y: 2.35, w: 2.6, h: 0.5, rectRadius: 0.25, fill: { color: ORANGE } });
s.addText("TAX SAVED THIS MONTH", { x: 1.0, y: 2.35, w: 2.6, h: 0.5, align: "center", valign: "middle", fontFace: BF, fontSize: 9.5, bold: true, color: WHITE, charSpacing: 1 });
s.addText([{ text: "€279", options: { color: WHITE } }, { text: " saved", options: { color: ORANGE, fontSize: 26 } }], {
  x: 1.0, y: 3.05, w: 5, h: 1.1, fontFace: HF, fontSize: 60, bold: true,
});
s.addText("on €680 of benefits approved this month, vs. paying the same value as taxed salary — 41% burden avoided.", {
  x: 1.0, y: 4.4, w: 4.9, h: 1.2, fontFace: BF, fontSize: 13.5, color: MUTED_L, lineSpacingMultiple: 1.15,
});
s.addText("Counter ticks live as perks are approved.", {
  x: 1.0, y: 5.95, w: 4.9, h: 0.4, fontFace: BF, fontSize: 11.5, italic: true, color: ORANGE,
});

// right: KPI list
const kpis = [
  ["Active this week", "% of employees engaging", ORANGE],
  ["Budget used", "spend vs. total allocation", BLUE],
  ["Department adoption", "ranked, with a nudge suggestion", ORANGE_D],
  ["Spend by category", "where the value goes", BLUE_D],
  ["Provider rating", "live average across reviews", ORANGE],
];
kpis.forEach(([h, d, c], i) => {
  const yy = 2.0 + i * 0.93;
  s.addShape(p.ShapeType.roundRect, { x: 6.65, y: yy, w: 6.0, h: 0.78, rectRadius: 0.08, fill: { color: CARD } });
  s.addShape(p.ShapeType.rect, { x: 6.65, y: yy, w: 0.1, h: 0.78, fill: { color: c } });
  s.addText(h, { x: 6.95, y: yy + 0.07, w: 5.5, h: 0.38, fontFace: HF, fontSize: 15.5, bold: true, color: INK });
  s.addText(d, { x: 6.95, y: yy + 0.42, w: 5.5, h: 0.3, fontFace: BF, fontSize: 11.5, color: MUTED });
});
pageNum(s, 9);

// =============================================================================
// 10. TECH & ARCHITECTURE (dark)
// =============================================================================
s = p.addSlide();
s.background = { color: INK };
kicker(s, 0.7, 0.6, "Under the hood", ORANGE);
s.addText("Architecture", { x: 0.7, y: 0.95, w: 8, h: 0.7, fontFace: HF, fontSize: 32, bold: true, color: WHITE });

const stack = [
  ["Next.js 16", "App Router · Server Actions", BLUE],
  ["React 19", "Server Components UI", ORANGE],
  ["Prisma 6", "Type-safe data layer", ORANGE_D],
  ["SQLite", "Single-file demo database", BLUE_D],
];
stack.forEach(([t, d, c], i) => {
  const x = 0.7 + i * 3.0;
  s.addShape(p.ShapeType.roundRect, { x, y: 1.95, w: 2.75, h: 1.4, rectRadius: 0.1, fill: { color: INK2 } });
  s.addText(t, { x: x + 0.2, y: 2.12, w: 2.4, h: 0.5, fontFace: HF, fontSize: 18, bold: true, color: c });
  s.addText(d, { x: x + 0.2, y: 2.68, w: 2.45, h: 0.6, fontFace: BF, fontSize: 11.5, color: MUTED_L });
});

s.addText("Layers", { x: 0.7, y: 3.7, w: 5, h: 0.4, fontFace: BF, fontSize: 12, bold: true, color: ORANGE, charSpacing: 2 });
const layers = [
  ["app/", "Persona picker, role-aware shell, page routes & one server-actions file (book, approve+pay, spin, gift, redeem…)"],
  ["lib/", "Business logic: planner, budget, points, insights, catalog, session, money"],
  ["prisma/", "16-model schema + a rich seeded demo dataset (company, people, providers, offers, drops, badges)"],
];
layers.forEach(([h, d], i) => {
  const yy = 4.2 + i * 0.85;
  s.addShape(p.ShapeType.roundRect, { x: 0.7, y: yy, w: 1.5, h: 0.62, rectRadius: 0.06, fill: { color: ORANGE } });
  s.addText(h, { x: 0.7, y: yy, w: 1.5, h: 0.62, align: "center", valign: "middle", fontFace: "Consolas", fontSize: 14, bold: true, color: WHITE });
  s.addText(d, { x: 2.4, y: yy, w: 10.2, h: 0.62, valign: "middle", fontFace: BF, fontSize: 12.5, color: MUTED_L });
});
s.addText("Cookie-based persona switch (no passwords) so one dataset is explorable from all three views. Payments are simulated — no real rail.", {
  x: 0.7, y: 6.75, w: 12, h: 0.4, fontFace: BF, fontSize: 11.5, italic: true, color: MUTED_L,
});
pageNum(s, 10, true);

// =============================================================================
// 11. CLOSING (dark)
// =============================================================================
s = p.addSlide();
s.background = { color: INK };
s.addShape(p.ShapeType.ellipse, { x: -1.5, y: 4.6, w: 4.5, h: 4.5, fill: { color: INK2 } });
s.addShape(p.ShapeType.ellipse, { x: 11.4, y: -1.6, w: 4, h: 4, fill: { color: INK2 } });
circle(s, 5.85, 1.5, 0.95, ORANGE, "✦", 30);
s.addText("Built for Albania.\nReady for the world.", {
  x: 1, y: 2.85, w: 11.3, h: 1.9, align: "center", fontFace: HF, fontSize: 44, bold: true, color: WHITE, lineSpacingMultiple: 1.0,
});
s.addText("The perks employees actually want — and the talent edge companies need — in one marketplace.", {
  x: 1.8, y: 4.85, w: 9.7, h: 0.8, align: "center", fontFace: BF, fontSize: 16, color: MUTED_L,
});
s.addText("perx", { x: 0, y: 5.95, w: W, h: 0.7, align: "center", fontFace: HF, fontSize: 30, bold: true, color: ORANGE });
pageNum(s, 11, true);

p.writeFile({ fileName: "Perx-Overview.pptx" }).then((f) => console.log("WROTE", f));
