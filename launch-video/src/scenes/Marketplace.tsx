import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, display, body } from "../theme";
import { SectionHeader, WindowStage } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { AppTopNav } from "../components/AppTopNav";
import { Camera } from "../components/Camera";
import { Cursor } from "../components/Cursor";
import { Stars } from "../components/ui";
import { stagger } from "../helpers";

const CARDS = [
  { img: "perks/yoga.jpg", title: "Restorative yoga", provider: "Studio Lila", cat: "Wellness", price: 22, color: C.orange, rating: 4.9 },
  { img: "perks/coffee.jpg", title: "Specialty coffee · 10 cups", provider: "Mon Café", cat: "Food", price: 18, color: C.orangeD, rating: 4.8 },
  { img: "perks/massage.jpg", title: "Deep tissue massage", provider: "Aqua Spa", cat: "Relax", price: 38, color: C.blue, rating: 5.0 },
  { img: "perks/kayak.jpg", title: "Sunset kayak for two", provider: "Albania Adventures", cat: "Travel", price: 58, color: C.blue, rating: 4.9 },
  { img: "perks/wine.jpg", title: "Natural wine tasting", provider: "WineVault", cat: "Food", price: 30, color: C.blueD, rating: 4.7 },
  { img: "perks/pottery.jpg", title: "Pottery class", provider: "Clay Studio", cat: "Learning", price: 20, color: C.orangeD, rating: 4.8 },
];
const HOVER = 1; // top-middle card lifts

const PerkCard: React.FC<{ c: (typeof CARDS)[number]; i: number }> = ({ c, i }) => {
  const frame = useCurrentFrame();
  const p = stagger(frame, 18, i, 5, 18);
  const lift = i === HOVER ? interpolate(frame, [52, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 18,
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 50 - lift * 16}px) scale(${1 + lift * 0.02})`,
        boxShadow: lift ? "0 26px 50px -20px rgba(26,22,16,.55)" : "0 8px 20px -16px rgba(26,22,16,.3)",
      }}
    >
      <div style={{ position: "relative", height: 132 }}>
        <Img src={staticFile(c.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,.4) 100%)" }} />
        <span style={{ position: "absolute", left: 12, top: 12, padding: "6px 13px", borderRadius: 999, background: c.color, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 14 }}>{c.cat}</span>
      </div>
      <div style={{ padding: "13px 16px" }}>
        <div style={{ fontFamily: display, fontSize: 20, fontWeight: 600, color: C.ink }}>{c.title}</div>
        <div style={{ fontFamily: body, fontSize: 14, color: C.muted, marginBottom: 8 }}>{c.provider}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Stars rating={c.rating} size={15} />
          <span style={{ fontFamily: body, fontSize: 14, color: C.muted }}>{c.rating.toFixed(1)}</span>
          <span style={{ marginLeft: "auto", fontFamily: display, fontSize: 22, fontWeight: 700 }}>{c.price} PX</span>
        </div>
      </div>
    </div>
  );
};

export const Marketplace: React.FC = () => {
  const chips = ["All", "Wellness", "Food", "Travel", "Relax"];
  return (
    <AbsoluteFill>
      <SectionHeader eyebrow="02 · Marketplace" title={<>Real local perks, not vouchers</>} />
      <Camera focus={[959, 560]} zoom={[1, 1.12]} range={[40, 150]}>
        <WindowStage>
          <BrowserFrame width={1480} height={760} url="app.perx.com/marketplace">
            <AppTopNav active="Discover" />
            <div style={{ padding: "26px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ fontFamily: body, fontSize: 14, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "#9a8f7a" }}>Browse the marketplace</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                  {chips.map((ch, i) => (
                    <span key={ch} style={{ padding: "7px 15px", borderRadius: 999, fontFamily: body, fontWeight: 600, fontSize: 15, background: i === 0 ? C.ink : "rgba(26,22,16,.06)", color: i === 0 ? "#fff" : C.muted }}>{ch}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                {CARDS.map((c, i) => (
                  <PerkCard key={i} c={c} i={i} />
                ))}
              </div>
            </div>
          </BrowserFrame>
        </WindowStage>

        <Cursor
          appearAt={30}
          path={[
            { f: 30, x: 1500, y: 980 },
            { f: 52, x: 959, y: 520 },
            { f: 150, x: 990, y: 540 },
          ]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
