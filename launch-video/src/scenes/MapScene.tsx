import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C, display, body, EASE_OUT } from "../theme";
import { SectionHeader, WindowStage } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { AppTopNav } from "../components/AppTopNav";
import { Camera } from "../components/Camera";
import { Cursor } from "../components/Cursor";
import { Icon } from "../components/Icon";

// Manually placed for a clean, legible spread (x/y are % of the square map).
const SPOTS = [
  { name: "Mon Café", icon: "ti-coffee", color: C.orangeD, km: 0.4, x: 58, y: 42, offer: "Specialty coffee · 10 cups", price: 18 },
  { name: "Studio Lila", icon: "ti-yoga", color: C.orange, km: 0.8, x: 38, y: 36, offer: "Restorative yoga", price: 22 },
  { name: "PoolHouse", icon: "ti-barbell", color: C.orange, km: 1.2, x: 66, y: 60, offer: "Gym monthly pass", price: 30 },
  { name: "WineVault", icon: "ti-glass", color: C.blueD, km: 1.5, x: 30, y: 62, offer: "Natural wine tasting", price: 30 },
  { name: "Aqua Spa", icon: "ti-bath", color: C.blue, km: 2.1, x: 72, y: 28, offer: "Thermal bath · 2hr pass", price: 24 },
  { name: "Mullixhiu", icon: "ti-chef-hat", color: C.orange, km: 3.0, x: 22, y: 30, offer: "Tasting menu for two", price: 58 },
  { name: "CineCity", icon: "ti-movie", color: C.blue, km: 5.0, x: 80, y: 72, offer: "Cinema · 5 tickets", price: 25 },
  { name: "Clay Studio", icon: "ti-bowl", color: C.orangeD, km: 1.1, x: 44, y: 70, offer: "Pottery class", price: 20 },
];
const SEL = 4; // Aqua Spa — the cursor opens this one
// Map area on the stage (for cursor targeting): window left 220 + padding.
const MAP = { left: 264, top: 372, size: 530 };
const px = (s: (typeof SPOTS)[number]) => ({ x: MAP.left + (s.x / 100) * MAP.size, y: MAP.top + (s.y / 100) * MAP.size });

const Pin: React.FC<{ s: (typeof SPOTS)[number]; i: number; active: boolean }> = ({ s, i, active }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - (14 + i * 4), fps, config: { damping: 11, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, transform: `translate(-50%,-100%) scale(${interpolate(drop, [0, 1], [0, active ? 1.18 : 1])})`, transformOrigin: "bottom center", zIndex: active ? 6 : 3, opacity: drop }}>
      <div style={{ width: 38, height: 38, borderRadius: "50% 50% 50% 3px", transform: "rotate(45deg)", background: s.color, border: "2px solid #fff", boxShadow: active ? "0 10px 20px -4px rgba(0,0,0,.5)" : "0 5px 12px -3px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className={`ti ${s.icon}`} style={{ transform: "rotate(-45deg)", color: "#fff", fontSize: 18 }} />
      </div>
    </div>
  );
};

export const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const selected = SPOTS[SEL];
  const popIn = interpolate(frame, [54, 66], [0, 1], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SectionHeader eyebrow="03 · Map view" title={<>See what&apos;s on around you</>} />
      <Camera focus={[700, 600]} zoom={[1, 1.08]} range={[20, 150]}>
        <WindowStage>
          <BrowserFrame width={1480} height={760} url="app.perx.com/map">
            <AppTopNav active="Map" />
            <div style={{ padding: "26px 32px", display: "flex", gap: 24 }}>
              {/* map */}
              <div style={{ width: 560, height: 560, flex: "none", borderRadius: 18, overflow: "hidden", position: "relative", border: `1px solid ${C.line}` }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                  <rect width="100" height="100" fill="#eef3ea" />
                  <ellipse cx="22" cy="26" rx="13" ry="10" fill="#dcebd2" />
                  <ellipse cx="80" cy="76" rx="16" ry="12" fill="#dcebd2" />
                  <path d="M-5 64 C 25 56, 40 80, 65 70 S 95 58, 110 66 L110 80 L-5 82 Z" fill="#cfe3f2" />
                  {[18, 38, 58, 78].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#e3dccb" strokeWidth="2.2" />)}
                  {[20, 44, 68, 88].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#e3dccb" strokeWidth="2.2" />)}
                  {[20, 32, 44].map((r) => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(26,22,16,.13)" strokeDasharray="1.4 2.4" strokeWidth="0.4" />)}
                </svg>
                {/* you */}
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", textAlign: "center", zIndex: 4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.blue, border: "3px solid #fff", boxShadow: "0 0 0 6px rgba(31,91,224,.18)", margin: "0 auto" }} />
                  <div style={{ fontFamily: body, fontSize: 12, fontWeight: 700, color: C.blueD, marginTop: 3, background: "rgba(255,255,255,.75)", borderRadius: 6, padding: "1px 6px" }}>You</div>
                </div>
                {SPOTS.map((s, i) => <Pin key={s.name} s={s} i={i} active={i === SEL} />)}

                {/* popup */}
                {popIn > 0 && (
                  <div style={{ position: "absolute", left: `${selected.x - 4}%`, top: `${selected.y - 34}%`, width: 214, zIndex: 9, background: "#fffdf8", border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, boxShadow: "0 18px 38px -12px rgba(26,22,16,.5)", opacity: popIn, transform: `scale(${interpolate(popIn, [0, 1], [0.85, 1])})`, transformOrigin: "bottom left" }}>
                    <div style={{ fontFamily: display, fontSize: 17, fontWeight: 700 }}>{selected.name}</div>
                    <div style={{ fontFamily: body, fontSize: 13, color: C.muted, marginBottom: 8 }}>Liqeni · {selected.km}km away</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: body, fontSize: 14 }}>
                      <span>{selected.offer}</span><b style={{ fontFamily: display }}>{selected.price} PX</b>
                    </div>
                    <div style={{ marginTop: 10, textAlign: "center", padding: "9px 0", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 14 }}>View perk</div>
                  </div>
                )}
                <span style={{ position: "absolute", left: 12, top: 12, display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 999, background: "rgba(255,253,248,.92)", color: C.ink, fontFamily: body, fontWeight: 700, fontSize: 14 }}>
                  <Icon name="pin" size={15} color={C.orange} /> Perks near you · Tirana
                </span>
              </div>

              {/* sidebar */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
                <div style={{ fontFamily: body, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "#9a8f7a", marginLeft: 4 }}>Nearest to you</div>
                {[...SPOTS].sort((a, b) => a.km - b.km).slice(0, 6).map((s, i) => {
                  const p = interpolate(frame, [24 + i * 5, 40 + i * 5], [0, 1], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const active = s.name === selected.name && frame >= 54;
                  return (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, background: active ? "rgba(255,106,31,.08)" : C.card, border: active ? `1px solid ${C.orange}` : `1px solid ${C.line}`, opacity: p, transform: `translateX(${(1 - p) * 30}px)` }}>
                      <span style={{ width: 40, height: 40, borderRadius: 11, background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                        <i className={`ti ${s.icon}`} style={{ fontSize: 19 }} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: display, fontSize: 17, fontWeight: 700 }}>{s.name}</div>
                        <div style={{ fontFamily: body, fontSize: 13, color: C.muted }}>{s.offer}</div>
                      </div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 999, background: "rgba(31,91,224,.12)", color: C.blueD, fontFamily: body, fontWeight: 700, fontSize: 14 }}>
                        <Icon name="pin" size={13} color={C.blueD} /> {s.km}km
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </BrowserFrame>
        </WindowStage>

        <Cursor
          appearAt={28}
          path={[
            { f: 28, x: 1000, y: 980 },
            { f: 50, x: px(selected).x, y: px(selected).y },
            { f: 150, x: px(selected).x + 30, y: px(selected).y + 20 },
          ]}
          clicks={[52]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
