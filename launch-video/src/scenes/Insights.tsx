import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, display, body } from "../theme";
import { SectionHeader, WindowStage } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { AppTopNav } from "../components/AppTopNav";
import { Camera } from "../components/Camera";
import { Icon } from "../components/Icon";
import { countUp, stagger } from "../helpers";

const KPIS = [
  { label: "Benefit value booked", value: 30420, suffix: " PX", color: C.orange },
  { label: "Perks booked", value: 312, suffix: "", color: C.blue },
  { label: "Team active this week", value: 88, suffix: "%", color: C.orangeD },
];

export const Insights: React.FC = () => {
  const frame = useCurrentFrame();
  const saved = countUp(frame, [24, 64], 12480);

  return (
    <AbsoluteFill>
      <SectionHeader eyebrow="08 · Its own currency" title={<>One budget in PX — no real money</>} />
      <Camera focus={[960, 500]} zoom={[1, 1.08]} range={[18, 130]}>
        <WindowStage>
          <BrowserFrame width={1480} height={760} url="app.perx.com/admin">
            <AppTopNav active="Wallet" wallet={false} />
            <div style={{ padding: "34px 44px" }}>
              {/* hero */}
              <div style={{ borderRadius: 22, padding: 30, background: C.ink, color: "#FBF6EC", display: "flex", alignItems: "center", gap: 30 }}>
                <div style={{ width: 150, height: 150, borderRadius: "50%", flex: "none", background: `conic-gradient(${C.orange}, ${C.gold}, ${C.orange})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(255,106,31,.4)" }}>
                  <div style={{ width: 124, height: 124, borderRadius: "50%", background: C.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: display, fontSize: 52, fontWeight: 800, color: "#fff" }}>PX</span>
                    <span style={{ fontFamily: body, fontSize: 13, color: "rgba(251,246,236,.6)", letterSpacing: ".1em" }}>POINTS</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, background: C.orange, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 16 }}>
                    <Icon name="activity" size={16} color="#fff" /> Untaxed value delivered
                  </span>
                  <div style={{ fontFamily: display, fontSize: 78, fontWeight: 800, lineHeight: 1, marginTop: 12, fontVariantNumeric: "tabular-nums" }}>
                    {saved.toLocaleString("en-US")} PX <span style={{ color: C.orange, fontSize: 34 }}>saved</span>
                  </div>
                  <div style={{ fontFamily: body, fontSize: 19, color: "rgba(251,246,236,.7)", marginTop: 8 }}>
                    vs. paying the same value as taxed salary — perks run entirely on PX, the in-app points currency.
                  </div>
                </div>
              </div>

              {/* KPI tiles */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 22 }}>
                {KPIS.map((k, i) => {
                  const p = stagger(frame, 40, i, 6, 16);
                  const v = countUp(frame, [44 + i * 6, 78 + i * 6], k.value);
                  return (
                    <div key={i} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, padding: "22px 24px", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                      <div style={{ fontFamily: body, fontSize: 15, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, color: C.muted }}>{k.label}</div>
                      <div style={{ fontFamily: display, fontSize: 46, fontWeight: 800, color: k.color, marginTop: 8, fontVariantNumeric: "tabular-nums" }}>
                        {v.toLocaleString("en-US")}{k.suffix}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </BrowserFrame>
        </WindowStage>
      </Camera>
    </AbsoluteFill>
  );
};
