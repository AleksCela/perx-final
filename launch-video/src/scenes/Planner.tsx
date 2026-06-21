import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, display, body } from "../theme";
import { SectionHeader, WindowStage } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { AppTopNav } from "../components/AppTopNav";
import { Camera } from "../components/Camera";
import { Cursor } from "../components/Cursor";
import { Icon } from "../components/Icon";
import { typed, stagger, countUp } from "../helpers";

const ITEMS = [
  { title: "Restorative yoga · Sat AM", provider: "Studio Lila", img: "perks/yoga.jpg", price: 22 },
  { title: "Thermal bath · 2hr pass", provider: "Aqua Spa", img: "perks/spa.jpg", price: 24 },
  { title: "Specialty coffee · 10 cups", provider: "Mon Café", img: "perks/coffee.jpg", price: 7 },
];
const QUERY = "cosy sunday reset, under 60 PX";

export const Planner: React.FC = () => {
  const frame = useCurrentFrame();
  const text = typed(QUERY, frame, 20, 30);
  const caret = Math.floor(frame / 8) % 2 === 0 && frame < 70;
  const clicked = frame >= 64;
  const total = countUp(frame, [72, 96], 53);

  return (
    <AbsoluteFill>
      <SectionHeader eyebrow="01 · AI Planner" title={<>Describe a feeling, get a plan</>} />
      <Camera focus={[960, 820]} zoom={[1, 1.1]} range={[60, 165]}>
        <WindowStage>
          <BrowserFrame width={1480} height={760} url="app.perx.com/planner">
            <AppTopNav active="Planner" />
            <div style={{ padding: "32px 44px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 15px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: body, fontWeight: 600, fontSize: 16 }}>
                  <Icon name="sparkles" size={16} fill color={C.orange} /> AI Planner
                </span>
                <span style={{ fontFamily: body, fontSize: 17, color: C.muted }}>
                  Type a feeling and a budget — it builds a cross-provider combo.
                </span>
              </div>

              <div style={{ fontFamily: display, fontSize: 50, fontWeight: 700, color: C.ink, margin: "20px 0 18px", lineHeight: 1 }}>
                Don&apos;t browse perks. <span style={{ color: C.orange }}>Describe a feeling.</span>
              </div>

              {/* search bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 10px 10px 22px", background: C.card, border: `1px solid ${C.line}`, borderRadius: 999, boxShadow: "0 8px 24px -16px rgba(26,22,16,.4)" }}>
                <Icon name="sparkles" size={24} color={C.orange} fill />
                <div style={{ flex: 1, fontFamily: body, fontSize: 22, color: text ? C.ink : C.muted }}>
                  {text || "a cosy reset, under 60 PX…"}
                  <span style={{ opacity: caret ? 1 : 0, color: C.orange }}>|</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 999, background: clicked ? C.orangeD : C.ink, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 18, transform: clicked ? "scale(0.97)" : "scale(1)" }}>
                  Build my combo <Icon name="arrow" size={18} color="#fff" />
                </div>
              </div>

              {/* combo result */}
              <div style={{ marginTop: 22, opacity: interpolate(frame, [66, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 20, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${C.line}` }}>
                    <span style={{ fontFamily: display, fontSize: 22, fontWeight: 700 }}>Your &ldquo;Decompress&rdquo; combo</span>
                    <span style={{ padding: "7px 14px", borderRadius: 999, background: C.orange, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 15 }}>3 providers</span>
                  </div>
                  {ITEMS.map((it, i) => {
                    const p = stagger(frame, 72, i, 6, 16);
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: i < 2 ? `1px solid ${C.line}` : "none", opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
                        <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", flex: "none" }}>
                          <Img src={staticFile(it.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: body, fontSize: 20, fontWeight: 600, color: C.ink }}>{it.title}</div>
                          <div style={{ fontFamily: body, fontSize: 15, color: C.muted }}>{it.provider}</div>
                        </div>
                        <div style={{ fontFamily: display, fontSize: 22, fontWeight: 700 }}>{it.price} PX</div>
                      </div>
                    );
                  })}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "rgba(255,106,31,.1)" }}>
                    <span style={{ fontFamily: display, fontSize: 26, fontWeight: 800 }}>{total} PX total</span>
                    <span style={{ padding: "7px 14px", borderRadius: 999, background: "rgba(31,91,224,.12)", color: C.blueD, fontFamily: body, fontWeight: 700, fontSize: 15 }}>7 PX under budget</span>
                    <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 17 }}>
                      Book all 3 <Icon name="arrow" size={17} color="#fff" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </BrowserFrame>
        </WindowStage>

        <Cursor
          appearAt={36}
          path={[
            { f: 36, x: 1640, y: 980 },
            { f: 58, x: 1470, y: 612 },
            { f: 64, x: 1470, y: 612 },
            { f: 96, x: 1150, y: 760 },
          ]}
          clicks={[64]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
