import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are "Perx Assistant", the friendly in-app guide for Perx — a two-sided
employee benefits marketplace built in Albania (currency is PX, the in-app points currency).

Who you help and what they do:
- Employees browse a marketplace of local perks (wellness, spa, food, learning, travel),
  build combos across several providers, and submit them for employer approval. They also
  use an AI planner ("describe a feeling + budget"), Friday drops, a mystery box, a weekly
  spin, points, badges, a wallet, and they redeem booked perks by showing a QR code at the venue.
- Employers (HR/admins) approve selections in one click, which routes a simulated payment to
  each provider, and they see analytics: tax saved vs. taxed salary, adoption, and spend.
- Providers see their offers, bookings, incoming payments, ratings, and scan a customer's QR
  code to redeem a booking.

Your job: answer questions about how Perx works, suggest perks or combos, explain the points
and approval flow, and help users get the most out of their benefits budget. Be concise,
warm, and practical. Keep answers short (1-3 short paragraphs or a tight list). If asked
something unrelated to Perx, answer briefly but steer back to how Perx can help.`;

type ClientMessage = { role: "user" | "model"; text: string };

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Chat is not configured (missing API key)." }, { status: 500 });
  }

  let messages: ClientMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // keep only the last 12 turns to stay light for the demo
  const trimmed = messages.slice(-12).filter((m) => m && m.text?.trim());
  const contents = trimmed.map((m) => ({
    role: m.role === "model" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
      // gemini-2.5 is a "thinking" model — disable the thinking budget so it
      // can't consume the token allowance and return empty text.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  // The free-tier key intermittently returns 429 (rate limit) or 503 (overloaded).
  // These are transient, so retry a few times with backoff before giving up.
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const MAX_ATTEMPTS = 4;
  let lastStatus = 0;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: payload,
      });

      if (res.ok) {
        const data = await res.json();
        const reply =
          data?.candidates?.[0]?.content?.parts?.map((pt: { text?: string }) => pt.text).join("") ??
          "Sorry, I didn't catch that — could you rephrase?";
        return NextResponse.json({ reply });
      }

      lastStatus = res.status;
      const detail = await res.text();
      console.error(`Gemini error (attempt ${attempt}/${MAX_ATTEMPTS})`, res.status, detail);

      // Retry transient failures; bail immediately on anything else (e.g. 400/403).
      const transient = res.status === 429 || res.status === 503 || res.status >= 500;
      if (!transient || attempt === MAX_ATTEMPTS) break;
      await sleep(attempt * 700); // 0.7s, 1.4s, 2.1s
    } catch (e) {
      console.error(`Gemini fetch failed (attempt ${attempt}/${MAX_ATTEMPTS})`, e);
      if (attempt === MAX_ATTEMPTS) {
        return NextResponse.json({ error: "Could not reach the assistant." }, { status: 502 });
      }
      await sleep(attempt * 700);
    }
  }

  const msg =
    lastStatus === 429
      ? "I'm getting a lot of requests right now — give me a few seconds and try again."
      : "The assistant is briefly unavailable — please try again in a moment.";
  return NextResponse.json({ error: msg }, { status: 502 });
}
