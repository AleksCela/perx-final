import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C, display, body, EASE_OUT } from "../theme";
import { SectionHeader, WindowStage } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { AppTopNav } from "../components/AppTopNav";
import { Camera } from "../components/Camera";
import { Cursor } from "../components/Cursor";
import { Icon } from "../components/Icon";
import { GiftBox } from "../components/GiftBox";

const OPEN_AT = 62;

const Sparkle: React.FC<{ a: number; dist: number; color: string }> = ({ a, dist, color }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [OPEN_AT, OPEN_AT + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rad = (a * Math.PI) / 180;
  return (
    <div
      style={{
        position: "absolute",
        left: 130 + Math.cos(rad) * dist * p,
        top: 120 + Math.sin(rad) * dist * p,
        width: 16,
        height: 16,
        opacity: (1 - p) * 1,
        transform: `scale(${0.5 + p})`,
        background: color,
        clipPath: "polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%)",
      }}
    />
  );
};

export const Mystery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opened = frame >= OPEN_AT;

  const shake = frame >= 52 && frame < OPEN_AT ? Math.sin(frame * 1.6) * 7 : 0;
  const popIn = spring({ frame: frame - OPEN_AT, fps, config: { damping: 9, mass: 0.6 } });
  const boxScale = opened ? interpolate(popIn, [0, 1], [0.7, 1]) : 1 + (frame >= 52 ? 0.06 : 0);
  const reveal = interpolate(frame, [OPEN_AT + 6, OPEN_AT + 24], [0, 1], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SectionHeader eyebrow="04 · Mystery Box" title={<>A free surprise, always in budget</>} />
      <Camera focus={[960, 600]} zoom={[1, 1.08]} range={[20, 130]}>
        <WindowStage>
          <BrowserFrame width={1480} height={760} url="app.perx.com/drops#mystery">
            <AppTopNav active="Drops" />
            <div style={{ padding: "40px 56px", display: "flex", gap: 36, alignItems: "center", height: 600 }}>
              {/* box column */}
              <div style={{ width: 520, flex: "none", background: C.card, border: `1px solid ${C.line}`, borderRadius: 22, padding: 30, textAlign: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, background: C.orange, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 16 }}>
                  <Icon name="gift" size={17} color="#fff" /> Mystery box
                </span>
                <div style={{ position: "relative", height: 240, display: "flex", alignItems: "center", justifyContent: "center", margin: "8px 0" }}>
                  {opened && (
                    <div style={{ position: "absolute", inset: 0 }}>
                      {[20, 70, 120, 160, 210, 250, 300, 340].map((a, i) => (
                        <Sparkle key={i} a={a} dist={120} color={[C.orange, C.blue, C.gold, C.blueD][i % 4]} />
                      ))}
                    </div>
                  )}
                  <div style={{ transform: `rotate(${shake}deg) scale(${boxScale})`, transformOrigin: "center bottom" }}>
                    <GiftBox size={200} variant={opened ? "open" : "closed"} />
                  </div>
                </div>
                <div style={{ fontFamily: body, fontSize: 16, color: C.muted, marginBottom: 16 }}>Costs you nothing this time · +75 pts</div>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "15px 0", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 19, transform: frame >= 56 && frame < 62 ? "scale(0.97)" : "scale(1)" }}>
                  {opened ? "Collected ✓" : "Unwrap"}
                </div>
              </div>

              {/* reveal column */}
              <div style={{ flex: 1, opacity: reveal, transform: `translateX(${(1 - reveal) * 40}px)` }}>
                <div style={{ fontFamily: body, fontSize: 15, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: C.muted }}>You unwrapped</div>
                <div style={{ fontFamily: display, fontSize: 56, fontWeight: 800, color: C.orange, lineHeight: 1, margin: "8px 0" }}>Spa day for two</div>
                <div style={{ fontFamily: body, fontSize: 20, color: C.muted, marginBottom: 18 }}>
                  Aqua Spa · worth <b style={{ color: C.ink }}>70 PX</b> · costs you <b style={{ color: C.ink }}>0 PX</b>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, background: "rgba(31,91,224,.12)", color: C.blueD, fontFamily: body, fontWeight: 700, fontSize: 16 }}>
                    <Icon name="trophy" size={17} color={C.blueD} /> Badge unlocked: Mystery fan
                  </span>
                  <span style={{ padding: "10px 18px", borderRadius: 999, background: "rgba(255,106,31,.14)", color: C.orangeD, fontFamily: body, fontWeight: 700, fontSize: 16 }}>+75 pts</span>
                </div>
                <div style={{ fontFamily: body, fontSize: 16, color: C.muted, marginTop: 18 }}>Added to your orders, pending a quick approval.</div>
              </div>
            </div>
          </BrowserFrame>
        </WindowStage>

        <Cursor
          appearAt={32}
          path={[
            { f: 32, x: 1200, y: 980 },
            { f: 54, x: 660, y: 812 },
            { f: 60, x: 660, y: 812 },
          ]}
          clicks={[57]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
