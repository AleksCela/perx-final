import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, display, body, EASE_OUT } from "../theme";
import { SectionHeader, WindowStage } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { AppTopNav } from "../components/AppTopNav";
import { Camera } from "../components/Camera";
import { Cursor } from "../components/Cursor";
import { Icon } from "../components/Icon";

const SETTLE = 130;

const Confetti: React.FC = () => {
  const frame = useCurrentFrame();
  const cols = [C.orange, C.blue, C.gold, C.blueD, C.orangeD];
  return (
    <>
      {Array.from({ length: 26 }).map((_, i) => {
        const a = (i / 26) * Math.PI * 2;
        const p = interpolate(frame, [SETTLE, SETTLE + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const dist = 60 + (i % 5) * 36;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 180 + Math.cos(a) * dist * p,
              top: 180 + Math.sin(a) * dist * p + p * p * 120,
              width: 12,
              height: 16,
              borderRadius: 3,
              background: cols[i % cols.length],
              opacity: 1 - p,
              transform: `rotate(${i * 40 + frame * 6}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

export const Spin: React.FC = () => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [44, SETTLE], [0, 5 * 360 + 210], {
    easing: EASE_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const landed = frame >= SETTLE - 4;
  const resultIn = interpolate(frame, [SETTLE, SETTLE + 16], [0, 1], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Lightweight inline wheel (drawn here so the confetti can sit over it).
  const SEG = 60;
  const COLORS = [C.orange, C.blue, C.ink, C.gold, C.blueD, C.orangeD];
  const TEXT = ["#fff", "#fff", "#fff", C.ink, "#fff", "#fff"];
  const PRIZES = [120, 80, 200, 40, 60, 300];
  const pt = (r: number, deg: number): [number, number] => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [100 + r * Math.cos(a), 100 + r * Math.sin(a)];
  };
  const slice = (i: number) => {
    const [x0, y0] = pt(96, i * SEG);
    const [x1, y1] = pt(96, (i + 1) * SEG);
    return `M100 100 L${x0.toFixed(2)} ${y0.toFixed(2)} A96 96 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
  };

  return (
    <AbsoluteFill>
      <SectionHeader eyebrow="05 · Weekly Spin" title={<>Turn perks into a habit</>} />
      <Camera focus={[700, 560]} zoom={[1, 1.08]} range={[20, 150]}>
        <WindowStage>
          <BrowserFrame width={1480} height={760} url="app.perx.com/play">
            <AppTopNav active="Play" points={landed ? 2340 : 2140} />
            <div style={{ padding: "40px 56px", display: "flex", gap: 50, alignItems: "center", height: 600 }}>
              {/* wheel */}
              <div style={{ width: 420, flex: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
                <div style={{ position: "relative", width: 360, height: 360 }}>
                  <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", zIndex: 3, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `26px solid ${C.ink}` }} />
                  <svg viewBox="0 0 200 200" width={360} height={360} style={{ filter: "drop-shadow(0 16px 34px rgba(26,22,16,.35))" }}>
                    <circle cx="100" cy="100" r="99" fill="#fffdf8" />
                    <g style={{ transformBox: "fill-box", transformOrigin: "center", transform: `rotate(${rotation}deg)` }}>
                      {PRIZES.map((p, i) => {
                        const [lx, ly] = pt(62, i * SEG + SEG / 2);
                        return (
                          <g key={i}>
                            <path d={slice(i)} fill={COLORS[i]} stroke="#fffdf8" strokeWidth={2} />
                            <text x={lx} y={ly} fill={TEXT[i]} fontSize="21" fontWeight="800" textAnchor="middle" dominantBaseline="central" fontFamily={display}>+{p}</text>
                          </g>
                        );
                      })}
                    </g>
                    <circle cx="100" cy="100" r="32" fill="#fffdf8" stroke="rgba(26,22,16,.12)" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: display, fontSize: landed ? 46 : 34, fontWeight: 800, color: C.orange, lineHeight: 1 }}>{landed ? "+200" : "SPIN"}</span>
                    <span style={{ fontSize: 14, color: C.muted, letterSpacing: ".14em" }}>{landed ? "POINTS" : "TO WIN"}</span>
                  </div>
                  {frame >= SETTLE && <Confetti />}
                </div>
                <div style={{ width: 320, textAlign: "center", padding: "15px 0", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 19, transform: frame >= 38 && frame < 46 ? "scale(0.97)" : "scale(1)" }}>
                  {landed ? "Collected ✓" : "Spin now"}
                </div>
              </div>

              {/* result */}
              <div style={{ flex: 1 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, background: C.orange, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 16 }}>
                  <Icon name="sparkles" size={16} fill color="#fff" /> Weekly check-in
                </span>
                <div style={{ fontFamily: display, fontSize: 60, fontWeight: 800, color: C.ink, lineHeight: 1, margin: "16px 0 8px", opacity: resultIn, transform: `translateY(${(1 - resultIn) * 24}px)` }}>
                  {landed ? "Mega bonus!" : "Spin to win"}
                </div>
                <div style={{ fontFamily: body, fontSize: 22, color: C.muted, opacity: resultIn }}>
                  <Icon name="flame" size={20} color={C.orange} style={{ display: "inline", verticalAlign: "-3px" }} /> 6-week streak · come back next week
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 22, opacity: resultIn }}>
                  <span style={{ padding: "10px 18px", borderRadius: 999, background: "rgba(255,106,31,.14)", color: C.orangeD, fontFamily: body, fontWeight: 700, fontSize: 16 }}>+200 points added</span>
                  <span style={{ padding: "10px 18px", borderRadius: 999, background: "rgba(31,91,224,.12)", color: C.blueD, fontFamily: body, fontWeight: 700, fontSize: 16 }}>Badge: Lucky 7</span>
                </div>
              </div>
            </div>
          </BrowserFrame>
        </WindowStage>

        <Cursor
          appearAt={20}
          path={[
            { f: 20, x: 1100, y: 980 },
            { f: 40, x: 560, y: 858 },
            { f: 50, x: 560, y: 858 },
            { f: 150, x: 620, y: 820 },
          ]}
          clicks={[42]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
