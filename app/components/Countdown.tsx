"use client";

import { useEffect, useState } from "react";

function fmt(ms: number) {
  if (ms <= 0) return "00:00:00";
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export default function Countdown({ expires }: { expires: string }) {
  const target = new Date(expires).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Render a stable placeholder on the server / first paint to avoid hydration mismatch.
  const label = now === null ? "––:––:––" : fmt(target - now);
  return <span className="tnum">{label}</span>;
}
