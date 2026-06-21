import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C, display, body, EASE_OUT } from "../theme";
import { SectionHeader, WindowStage } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { AppTopNav } from "../components/AppTopNav";
import { Camera } from "../components/Camera";
import { Cursor } from "../components/Cursor";
import { Icon } from "../components/Icon";
import { Avatar } from "../components/ui";
import { countUp } from "../helpers";

const CONNECT = 46;
const MEDAL = ["#e8b23a", "#a7aeb8", "#c08457"];
const ENTRIES = [
  { name: "Kedi K.", dept: "Design", color: C.blue, steps: 84210, me: true },
  { name: "Priya A.", dept: "Design", color: C.orange, steps: 81540, me: false },
  { name: "Megi L.", dept: "Sales", color: C.orangeD, steps: 60100, me: false },
  { name: "Erion H.", dept: "Design", color: C.blueD, steps: 52300, me: false },
  { name: "Sara K.", dept: "Engineering", color: C.blue, steps: 49500, me: false },
];
const TOP = ENTRIES[0].steps;
const SOURCES = ["Apple Health", "Google Fit", "Fitbit"];

export const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const connected = frame >= CONNECT;
  const sharp = interpolate(frame, [CONNECT, CONNECT + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SectionHeader eyebrow="06 · Step Challenge" title={<>Connect your health app & compete</>} />
      <Camera focus={[960, 580]} zoom={[1, 1.07]} range={[30, 150]}>
        <WindowStage>
          <BrowserFrame width={1480} height={760} url="app.perx.com/play">
            <AppTopNav active="Play" />
            <div style={{ padding: "30px 44px" }}>
              {/* connect panel */}
              <div style={{ borderRadius: 18, padding: "20px 24px", background: "linear-gradient(135deg, #1a1610, #2c2616)", color: "#FBF6EC", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 15, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <Icon name={connected ? "check" : "heart"} size={28} color="#fff" fill={connected} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: display, fontSize: 24, fontWeight: 700 }}>{connected ? "Health app connected" : "Connect your health app"}</div>
                  <div style={{ display: "flex", gap: 9, marginTop: 9 }}>
                    {SOURCES.map((s) => (
                      <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 999, background: "rgba(255,255,255,.1)", fontFamily: body, fontWeight: 600, fontSize: 15 }}>
                        <Icon name="activity" size={15} color="#fff" /> {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 24px", borderRadius: 999, background: connected ? "rgba(40,200,64,.2)" : C.orange, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 18, transform: frame >= 40 && frame < 46 ? "scale(0.96)" : "scale(1)" }}>
                  {connected ? <><Icon name="check" size={18} color="#fff" /> Synced</> : <><Icon name="plug" size={18} color="#fff" /> Connect</>}
                </div>
              </div>

              {/* leaderboard */}
              <div style={{ marginTop: 22, filter: `blur(${(1 - sharp) * 5}px)`, opacity: 0.4 + sharp * 0.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontFamily: body, fontSize: 14, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: C.muted }}>This week&apos;s step leaderboard</span>
                  <span style={{ padding: "7px 14px", borderRadius: 999, background: "rgba(255,106,31,.14)", color: C.orangeD, fontFamily: body, fontWeight: 700, fontSize: 15 }}>Top walker wins +300 pts</span>
                </div>
                {ENTRIES.map((e, i) => {
                  const pct = (e.steps / TOP) * 100;
                  const w = interpolate(frame, [CONNECT + 4 + i * 3, CONNECT + 30 + i * 3], [0, pct], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const n = countUp(frame, [CONNECT + 4, CONNECT + 30], e.steps);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 12px", borderRadius: 12, marginBottom: 6, background: e.me ? "rgba(255,106,31,.1)" : "transparent", border: e.me ? "1px solid rgba(255,106,31,.35)" : "1px solid transparent" }}>
                      <span style={{ width: 28, height: 28, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: body, fontSize: 15, fontWeight: 700, color: i < 3 ? "#fff" : C.muted, background: i < 3 ? MEDAL[i] : "rgba(26,22,16,.08)" }}>{i + 1}</span>
                      <Avatar initials={e.name.split(" ").map((p) => p[0]).join("")} color={e.color} size={36} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: body, fontSize: 17, fontWeight: e.me ? 700 : 500 }}>
                          {e.name}{e.me ? " (you)" : ""} <span style={{ color: C.muted, fontWeight: 400 }}>· {e.dept}</span>
                        </div>
                        <div style={{ height: 8, background: "#ede4d2", borderRadius: 9, marginTop: 5, overflow: "hidden" }}>
                          <div style={{ width: `${w}%`, height: "100%", borderRadius: 9, background: i % 2 ? C.blue : C.orange }} />
                        </div>
                      </div>
                      <span style={{ fontFamily: display, fontSize: 19, fontWeight: 700, fontVariantNumeric: "tabular-nums", width: 110, textAlign: "right" }}>{n.toLocaleString("en-US")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </BrowserFrame>
        </WindowStage>

        <Cursor
          appearAt={26}
          path={[
            { f: 26, x: 1200, y: 980 },
            { f: 42, x: 1500, y: 430 },
            { f: 48, x: 1500, y: 430 },
            { f: 150, x: 1300, y: 600 },
          ]}
          clicks={[44]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
