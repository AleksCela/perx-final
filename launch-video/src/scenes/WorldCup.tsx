import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, display, body, EASE_OUT } from "../theme";
import { SectionHeader, WindowStage } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { AppTopNav } from "../components/AppTopNav";
import { Camera } from "../components/Camera";
import { Cursor } from "../components/Cursor";
import { Icon } from "../components/Icon";
import { stagger } from "../helpers";

type T = { code: string; name: string };
const FIX: { a: T; b: T; win: "a" | "b"; pickF: number }[] = [
  { a: { code: "ar", name: "Argentina" }, b: { code: "mx", name: "Mexico" }, win: "a", pickF: 34 },
  { a: { code: "fr", name: "France" }, b: { code: "us", name: "USA" }, win: "a", pickF: 42 },
  { a: { code: "br", name: "Brazil" }, b: { code: "ca", name: "Canada" }, win: "a", pickF: 50 },
  { a: { code: "gb-eng", name: "England" }, b: { code: "es", name: "Spain" }, win: "b", pickF: 58 },
  { a: { code: "pt", name: "Portugal" }, b: { code: "nl", name: "Netherlands" }, win: "b", pickF: 66 },
  { a: { code: "de", name: "Germany" }, b: { code: "hr", name: "Croatia" }, win: "a", pickF: 74 },
];
const LOCK = 104;

const Flag: React.FC<{ code: string; w?: number }> = ({ code, w = 56 }) => (
  <div style={{ width: w, height: w * 0.67, borderRadius: 5, overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,.25)", flex: "none" }}>
    <Img src={staticFile(`flags/${code}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

const TeamBtn: React.FC<{ t: T; picked: boolean; dim: boolean }> = ({ t, picked, dim }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
      padding: "12px 4px",
      borderRadius: 12,
      border: picked ? `2px solid ${C.orange}` : "2px solid transparent",
      background: picked ? "rgba(255,106,31,.12)" : "transparent",
      opacity: dim ? 0.45 : 1,
      transform: picked ? "scale(1.04)" : "scale(1)",
    }}
  >
    <Flag code={t.code} />
    <span style={{ fontFamily: body, fontSize: 15, fontWeight: picked ? 700 : 500, color: C.ink }}>{t.name}</span>
  </div>
);

export const WorldCup: React.FC = () => {
  const frame = useCurrentFrame();
  const locked = frame >= LOCK;
  const champIn = interpolate(frame, [90, 100], [0, 1], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SectionHeader eyebrow="07 · World Cup 2026" title={<>A mini-game for matchday</>} />
      <Camera focus={[960, 580]} zoom={[1, 1.06]} range={[20, 150]}>
        <WindowStage>
          <BrowserFrame width={1480} height={760} url="app.perx.com/play">
            <AppTopNav active="Play" />
            <div style={{ padding: "26px 44px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: body, fontSize: 14, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: C.muted }}>
                  <Icon name="ball" size={18} color={C.orange} fill /> World Cup 2026 · predictor
                </span>
                <span style={{ padding: "6px 13px", borderRadius: 999, background: "rgba(26,22,16,.06)", color: C.muted, fontFamily: body, fontWeight: 600, fontSize: 14 }}>Demo · temporary</span>
              </div>
              <div style={{ fontFamily: display, fontSize: 30, fontWeight: 700, marginBottom: 16 }}>Call the knockouts</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {FIX.map((f, i) => {
                  const p = stagger(frame, 16, i, 4, 14);
                  const picked = frame >= f.pickF;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, padding: 8, borderRadius: 14, background: C.card, border: `1px solid ${C.line}`, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                      <TeamBtn t={f.a} picked={picked && f.win === "a"} dim={picked && f.win !== "a"} />
                      <span style={{ fontFamily: body, fontSize: 12, fontWeight: 800, color: C.muted, flex: "none" }}>VS</span>
                      <TeamBtn t={f.b} picked={picked && f.win === "b"} dim={picked && f.win !== "b"} />
                    </div>
                  );
                })}
              </div>

              {/* champion + lock */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: body, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, color: C.blueD }}>
                  <Icon name="trophy" size={18} color={C.gold} /> Champion
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: champIn }}>
                  <Flag code="ar" w={40} />
                  <span style={{ fontFamily: body, fontSize: 18, fontWeight: 700 }}>Argentina</span>
                </div>
                <div style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 9, padding: "13px 24px", borderRadius: 999, background: locked ? C.blue : C.ink, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 17, transform: frame >= 100 && frame < 106 ? "scale(0.97)" : "scale(1)" }}>
                  {locked ? <><Icon name="check" size={18} color="#fff" /> Locked in</> : <><Icon name="lock" size={18} color="#fff" /> Lock in predictions</>}
                </div>
              </div>
            </div>
          </BrowserFrame>
        </WindowStage>

        <Cursor
          appearAt={20}
          path={[
            { f: 20, x: 1000, y: 980 },
            { f: 33, x: 470, y: 560 },
            { f: 49, x: 950, y: 560 },
            { f: 73, x: 1430, y: 560 },
            { f: 102, x: 1470, y: 800 },
            { f: 110, x: 1470, y: 800 },
          ]}
          clicks={[34, 50, 74, 104]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
