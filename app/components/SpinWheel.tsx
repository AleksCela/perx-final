"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { spin } from "../actions";
import { SPIN_PRIZES } from "@/lib/constants";

type Result =
  | { ok: true; label: string; points: number; streak: number }
  | { ok: false; reason: string; days?: number };

const SEG = 360 / SPIN_PRIZES.length; // equal wedges
const COLORS = ["#FF6A1F", "#1F5BE0", "#1A1610", "#E8B23A", "#15347E", "#B23C0A"];
const TEXT_ON = ["#fff", "#fff", "#fff", "#1A1610", "#fff", "#fff"];
const SPIN_MS = 3600;

// A point on the wheel, measured in degrees clockwise from the top (12 o'clock).
function pt(r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
}

function slicePath(i: number): string {
  const [x0, y0] = pt(96, i * SEG);
  const [x1, y1] = pt(96, (i + 1) * SEG);
  return `M100 100 L${x0.toFixed(2)} ${y0.toFixed(2)} A96 96 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
}

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
    startTransition(async () => {
      const res = (await spin()) as Result;
      if (res.ok) {
        const idx = Math.max(0, SPIN_PRIZES.findIndex((p) => p.label === res.label));
        const center = idx * SEG + SEG / 2;
        const landing = (360 - center) % 360; // orientation that puts this wedge under the pointer
        const jitter = (Math.random() * 2 - 1) * (SEG / 2 - 9); // land somewhere inside the wedge
        setRotation((r) => {
          const delta = (((landing + jitter) - (r % 360)) + 360) % 360;
          return r + 5 * 360 + delta; // five full turns, then settle on the prize
        });
      } else {
        setRotation((r) => r + 3 * 360 + 90);
      }
      setTimeout(() => {
        setResult(res);
        setSpinning(false);
        router.refresh();
      }, SPIN_MS);
    });
  }

  const disabled = (!canSpin && !result) || spinning || pending;

  return (
    <div className="card" style={{ padding: 18, textAlign: "center" }}>
      <span className="pill" style={{ background: "var(--orange)", color: "#fff" }}>
        <i className="ti ti-confetti" /> Weekly check-in
      </span>

      <div style={{ position: "relative", width: 192, height: 192, margin: "16px auto 10px" }}>
        {/* pointer */}
        <div
          style={{
            position: "absolute",
            top: -2,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            width: 0,
            height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "11px solid transparent",
            borderTop: "17px solid var(--ink)",
            filter: "drop-shadow(0 1px 1px rgba(0,0,0,.25))",
          }}
        />
        <svg
          viewBox="0 0 200 200"
          width={192}
          height={192}
          style={{ display: "block", filter: "drop-shadow(0 6px 16px rgba(26,22,16,.18))" }}
        >
          <circle cx="100" cy="100" r="99" fill="#FFFDF8" />
          <g
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(.16,.84,.3,1)` : "none",
            }}
          >
            {SPIN_PRIZES.map((p, i) => {
              const [lx, ly] = pt(62, i * SEG + SEG / 2);
              return (
                <g key={p.label}>
                  <path d={slicePath(i)} fill={COLORS[i]} stroke="#FFFDF8" strokeWidth={2} />
                  <text
                    x={lx}
                    y={ly}
                    fill={TEXT_ON[i]}
                    fontSize="17"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="'Bricolage Grotesque', sans-serif"
                  >
                    +{p.points}
                  </text>
                </g>
              );
            })}
          </g>
          <circle cx="100" cy="100" r="30" fill="#FFFDF8" stroke="rgba(26,22,16,.12)" strokeWidth={1} />
        </svg>

        {/* hub label (stationary) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <span className="d" style={{ fontSize: 20, fontWeight: 800, color: "var(--orange)", lineHeight: 1 }}>
            {result?.ok ? `+${result.points}` : "SPIN"}
          </span>
          <span style={{ fontSize: 8.5, color: "var(--muted)", letterSpacing: ".12em" }}>
            {result?.ok ? "POINTS" : "TO WIN"}
          </span>
        </div>
      </div>

      {result?.ok ? (
        <>
          <div className="d pop" style={{ fontSize: 18, fontWeight: 700 }}>{result.label}!</div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", margin: "4px 0 12px" }}>
            <i className="ti ti-flame" style={{ color: "var(--orange)" }} /> {result.streak}-week streak · come back next week
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
