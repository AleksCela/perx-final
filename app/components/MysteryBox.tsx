"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { openMystery } from "../actions";
import { money } from "@/lib/money";

type Reveal = {
  ok: boolean;
  title?: string;
  provider?: string;
  worth?: number;
  icon?: string;
  badge?: string | null;
};

export default function MysteryBox({ currency }: { currency: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [opening, setOpening] = useState(false);

  function open() {
    if (pending || opening) return;
    setOpening(true);
    startTransition(async () => {
      const res = await openMystery();
      setTimeout(() => {
        setReveal(res as Reveal);
        setOpening(false);
        router.refresh();
      }, 700);
    });
  }

  return (
    <div className="card" style={{ padding: 24, textAlign: "center" }}>
      <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}>
        <i className="ti ti-gift" /> Mystery box
      </span>

      {!reveal ? (
        <>
          <div style={{ fontSize: 72, margin: "16px 0 6px", transition: "transform .3s", transform: opening ? "scale(1.15) rotate(-6deg)" : "none" }}>🎁</div>
          <div className="kick">A wrapped perk within your budget</div>
          <div style={{ fontSize: 13, color: "var(--muted)", margin: "6px 0 16px" }}>Costs you nothing this time · +75 pts</div>
          <button onClick={open} disabled={pending || opening} className="btn btn-ink" style={{ width: "100%" }}>
            {opening || pending ? "Unwrapping…" : "Unwrap"}
          </button>
        </>
      ) : reveal.ok ? (
        <div className="pop">
          <div style={{ fontSize: 64, margin: "14px 0 6px" }}>🎉</div>
          <div className="kick">You unwrapped</div>
          <div className="d" style={{ fontSize: 28, fontWeight: 800, margin: "6px 0", color: "var(--orange)" }}>{reveal.title}</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
            {reveal.provider} · worth {money(reveal.worth ?? 0, currency)} · costs you <b style={{ color: "var(--ink)" }}>{money(0, currency)}</b>
          </div>
          {reveal.badge && (
            <div className="pill" style={{ background: "rgba(31,91,224,.12)", color: "var(--blue-d)", marginBottom: 12 }}>
              <i className="ti ti-award" /> Badge unlocked: {reveal.badge}
            </div>
          )}
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Added to your orders, pending approval.</div>
        </div>
      ) : (
        <div style={{ padding: 20, color: "var(--muted)" }}>No surprise available right now — try again later.</div>
      )}
    </div>
  );
}
