"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { spin } from "../actions";

type Result =
  | { ok: true; label: string; points: number; streak: number }
  | { ok: false; reason: string; days?: number };

export default function SpinWheel({ canSpin }: { canSpin: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [spinning, setSpinning] = useState(false);

  function doSpin() {
    if (spinning || pending) return;
    setSpinning(true);
    setResult(null);
    setRotation((r) => r + 1440 + Math.floor(Math.random() * 360));
    startTransition(async () => {
      const res = (await spin()) as Result;
      // let the wheel animation play out before revealing
      setTimeout(() => {
        setResult(res);
        setSpinning(false);
        router.refresh();
      }, 1300);
    });
  }

  const disabled = (!canSpin && !result) || spinning || pending;

  return (
    <div className="card" style={{ padding: 18, textAlign: "center" }}>
      <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}>
        <i className="ti ti-confetti" /> Weekly check-in
      </span>
      <div style={{ position: "relative", width: 178, height: 178, margin: "16px auto 8px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "7px solid #FFFDF8",
            background:
              "conic-gradient(#FF6A1F 0 60deg,#1F5BE0 60deg 120deg,#1A1610 120deg 180deg,#FF8A4F 180deg 240deg,#15347E 240deg 300deg,#FF6A1F 300deg 360deg)",
            boxShadow: "0 0 0 1px rgba(26,22,16,.1)",
            transform: `rotate(${rotation}deg)`,
            transition: "transform 1.25s cubic-bezier(.17,.67,.32,1.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 56,
            borderRadius: "50%",
            background: "#FFFDF8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            border: "1px solid rgba(26,22,16,.1)",
          }}
        >
          <span className="d" style={{ fontSize: 22, fontWeight: 800, color: "var(--orange)", lineHeight: 1 }}>
            {result?.ok ? `+${result.points}` : "spin"}
          </span>
          <span style={{ fontSize: 9, color: "var(--muted)" }}>{result?.ok ? "points" : "to win"}</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: -7,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "15px solid var(--ink)",
          }}
        />
      </div>

      {result?.ok ? (
        <>
          <div className="d pop" style={{ fontSize: 18, fontWeight: 700 }}>{result.label}!</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", margin: "4px 0 12px" }}>
            🔥 {result.streak}-week streak · come back next week
          </div>
        </>
      ) : result && !result.ok ? (
        <>
          <div className="d" style={{ fontSize: 16, fontWeight: 700 }}>Already spun this week</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", margin: "4px 0 12px" }}>
            Next spin in {result.days ?? 7} day{(result.days ?? 7) === 1 ? "" : "s"}
          </div>
        </>
      ) : (
        <>
          <div className="d" style={{ fontSize: 18, fontWeight: 700 }}>{canSpin ? "Your check-in is ready" : "Come back next week"}</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", margin: "4px 0 12px" }}>Spin once a week for bonus points</div>
        </>
      )}

      <button onClick={doSpin} disabled={disabled} className="btn btn-ink" style={{ width: "100%", padding: 11 }}>
        {spinning || pending ? "Spinning…" : result?.ok ? "Collected ✓" : "Spin now"}
      </button>
    </div>
  );
}
