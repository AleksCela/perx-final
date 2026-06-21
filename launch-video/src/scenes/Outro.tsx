import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { C, display, body, EASE_OUT } from "../theme";
import { Icon } from "../components/Icon";
import { stagger } from "../helpers";

const FEATURES = ["AI Planner", "Marketplace", "Friday Drops", "Mystery box", "Weekly spin", "Step challenge", "World Cup '26"];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame: frame - 4, fps, config: { damping: 13, mass: 0.7 } });
  const lineIn = interpolate(frame, [16, 38], [0, 1], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ctaIn = spring({ frame: frame - 56, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: "radial-gradient(50% 50% at 50% 45%, rgba(255,106,31,.12) 0%, transparent 70%)" }} />
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: display,
            fontSize: 150,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 0.9,
            transform: `scale(${interpolate(logoIn, [0, 1], [0.7, 1])})`,
            opacity: logoIn,
            letterSpacing: "-0.04em",
          }}
        >
          perx<span style={{ color: C.orange }}>.</span>
        </div>

        <div
          style={{
            fontFamily: display,
            fontSize: 58,
            fontWeight: 600,
            color: "#fff",
            marginTop: 18,
            opacity: lineIn,
            transform: `translateY(${(1 - lineIn) * 18}px)`,
          }}
        >
          Perks worth <span style={{ color: C.orange }}>showing up</span> for.
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", maxWidth: 1100, margin: "28px auto 0" }}>
          {FEATURES.map((f, i) => {
            const p = stagger(frame, 30, i, 4, 14);
            return (
              <span
                key={f}
                style={{
                  padding: "11px 20px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.14)",
                  color: "#fff",
                  fontFamily: body,
                  fontWeight: 600,
                  fontSize: 21,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 16}px)`,
                }}
              >
                {f}
              </span>
            );
          })}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            marginTop: 44,
            padding: "20px 38px",
            borderRadius: 999,
            background: C.orange,
            color: "#fff",
            fontFamily: body,
            fontWeight: 700,
            fontSize: 28,
            transform: `scale(${interpolate(ctaIn, [0, 1], [0.8, 1])})`,
            opacity: ctaIn,
            boxShadow: "0 20px 50px -16px rgba(255,106,31,.6)",
          }}
        >
          Start your perks marketplace <Icon name="arrow" size={26} color="#fff" />
        </div>
        <div style={{ fontFamily: body, fontSize: 22, color: "rgba(255,255,255,.5)", marginTop: 22, opacity: ctaIn }}>app.perx.com</div>
      </div>
    </AbsoluteFill>
  );
};
