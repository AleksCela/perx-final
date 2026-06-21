import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, display, body } from "../theme";
import { SectionHeader, WindowStage } from "../components/SceneShell";
import { BrowserFrame } from "../components/BrowserFrame";
import { AppTopNav } from "../components/AppTopNav";
import { Camera } from "../components/Camera";
import { Cursor } from "../components/Cursor";
import { Icon } from "../components/Icon";
import { stagger } from "../helpers";

const SMALL = [
  { img: "perks/kayak.jpg", title: "Sunset kayak for two", off: 50, now: 29, was: 58, time: "02:41:08" },
  { img: "perks/wine.jpg", title: "Natural wine tasting", off: 40, now: 18, was: 30, time: "01:12:55" },
  { img: "perks/pottery.jpg", title: "Pottery class", off: 30, now: 14, was: 20, time: "05:03:22" },
];

function hms(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export const Drops: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const left = 4 * 3600 + 37 * 60 + 59 - Math.floor(frame / fps);
  const claimed = frame >= 74;

  return (
    <AbsoluteFill>
      <SectionHeader eyebrow="03 · Friday Drops" title={<>Limited-time deals, every week</>} />
      <Camera focus={[960, 470]} zoom={[1, 1.1]} range={[44, 130]}>
        <WindowStage>
          <BrowserFrame width={1480} height={760} url="app.perx.com/drops">
            <AppTopNav active="Drops" />
            <div style={{ padding: "28px 36px" }}>
              {/* headline drop */}
              <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, padding: 28, background: C.orange, color: "#fff", display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ position: "absolute", right: -50, bottom: -80, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,.13)" }} />
                <div style={{ flex: 1, position: "relative" }}>
                  <div style={{ fontFamily: body, fontSize: 16, color: "rgba(255,255,255,.85)" }}>This week&apos;s headline drop</div>
                  <div style={{ fontFamily: display, fontSize: 38, fontWeight: 800, margin: "4px 0" }}>Spa day for two — half budget</div>
                  <div style={{ fontFamily: body, fontSize: 16, color: "rgba(255,255,255,.9)" }}>18 of 40 claimed · the whole office can see this</div>
                </div>
                <div style={{ textAlign: "center", position: "relative", padding: "0 14px" }}>
                  <div style={{ fontFamily: body, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.85)" }}>Expires in</div>
                  <div style={{ fontFamily: display, fontSize: 40, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{hms(left)}</div>
                </div>
                <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 9, padding: "16px 26px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 19, transform: claimed ? "scale(0.97)" : "scale(1)" }}>
                  {claimed ? <><Icon name="check" size={20} color="#fff" /> Claimed</> : <>Claim · 35 PX</>}
                </div>
              </div>

              {/* small drops */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginTop: 22 }}>
                {SMALL.map((d, i) => {
                  const p = stagger(frame, 28, i, 6, 16);
                  return (
                    <div key={i} style={{ borderRadius: 18, overflow: "hidden", background: C.card, border: `1px solid ${C.line}`, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
                      <div style={{ position: "relative", height: 110 }}>
                        <Img src={staticFile(d.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: 12, background: "linear-gradient(180deg, rgba(0,0,0,.35), transparent 60%)" }}>
                          <span style={{ padding: "6px 12px", borderRadius: 999, background: "#fff", color: C.orangeD, fontFamily: body, fontWeight: 800, fontSize: 14 }}>−{d.off}%</span>
                          <span style={{ padding: "6px 12px", borderRadius: 999, background: "rgba(0,0,0,.45)", color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>{d.time}</span>
                        </div>
                      </div>
                      <div style={{ padding: "12px 16px" }}>
                        <div style={{ fontFamily: display, fontSize: 19, fontWeight: 600 }}>{d.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                          <span style={{ fontFamily: display, fontSize: 20, fontWeight: 700 }}>{d.now} PX</span>
                          <span style={{ fontFamily: body, fontSize: 15, color: C.muted, textDecoration: "line-through" }}>{d.was} PX</span>
                          <span style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 999, background: C.orange, color: "#fff", fontFamily: body, fontWeight: 700, fontSize: 15 }}>Claim</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </BrowserFrame>
        </WindowStage>

        <Cursor
          appearAt={40}
          path={[
            { f: 40, x: 1560, y: 980 },
            { f: 68, x: 1500, y: 470 },
            { f: 74, x: 1500, y: 470 },
            { f: 120, x: 1400, y: 520 },
          ]}
          clicks={[74]}
        />
      </Camera>
    </AbsoluteFill>
  );
};
