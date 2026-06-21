import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { C, display, body, EASE_OUT } from "../theme";
import { Icon } from "../components/Icon";

const THUMBS = [
  { src: "perks/yoga.jpg", x: 250, y: 250, r: -8, s: 200 },
  { src: "perks/coffee.jpg", x: 1480, y: 210, r: 7, s: 220 },
  { src: "perks/kayak.jpg", x: 1560, y: 640, r: -6, s: 210 },
  { src: "perks/wine.jpg", x: 230, y: 700, r: 9, s: 190 },
  { src: "perks/spa.jpg", x: 880, y: 820, r: -4, s: 180 },
];

const FloatThumb: React.FC<{ t: (typeof THUMBS)[number]; i: number }> = ({ t, i }) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [6 + i * 4, 26 + i * 4], [0, 1], {
    easing: EASE_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dy = Math.sin((frame + i * 30) / 40) * 14;
  return (
    <div
      style={{
        position: "absolute",
        left: t.x,
        top: t.y + dy,
        width: t.s,
        height: t.s * 0.7,
        transform: `rotate(${t.r}deg) scale(${interpolate(appear, [0, 1], [0.8, 1])})`,
        opacity: appear * 0.92,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 30px 60px -20px rgba(0,0,0,.7)",
        border: "1px solid rgba(255,255,255,.12)",
      }}
    >
      <Img src={staticFile(t.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame: frame - 14, fps, config: { damping: 12, mass: 0.8 } });
  const logoScale = interpolate(logoIn, [0, 1], [0.6, 1]);
  const dot = spring({ frame: frame - 26, fps, config: { damping: 9, mass: 0.6 } });

  const tagIn = interpolate(frame, [34, 54], [0, 1], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subIn = interpolate(frame, [46, 66], [0, 1], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillIn = interpolate(frame, [2, 18], [0, 1], { easing: EASE_OUT, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {THUMBS.map((t, i) => (
        <FloatThumb key={i} t={t} i={i} />
      ))}

      <AbsoluteFill style={{ background: "radial-gradient(45% 45% at 50% 50%, rgba(17,14,9,.5) 0%, rgba(17,14,9,.82) 70%)" }} />

      <div style={{ textAlign: "center", zIndex: 5 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            padding: "10px 20px",
            borderRadius: 999,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.14)",
            color: "#fff",
            fontFamily: body,
            fontWeight: 600,
            fontSize: 19,
            marginBottom: 34,
            opacity: pillIn,
            transform: `translateY(${(1 - pillIn) * -12}px)`,
          }}
        >
          <Icon name="sparkles" size={20} fill color={C.orange} /> The employee perks platform
        </div>

        <div
          style={{
            fontFamily: display,
            fontSize: 220,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 0.9,
            transform: `scale(${logoScale})`,
            opacity: logoIn,
            letterSpacing: "-0.04em",
          }}
        >
          perx
          <span style={{ color: C.orange, display: "inline-block", transform: `scale(${interpolate(dot, [0, 1], [0, 1])})` }}>.</span>
        </div>

        <div
          style={{
            fontFamily: display,
            fontSize: 52,
            fontWeight: 600,
            color: "#fff",
            marginTop: 18,
            opacity: tagIn,
            transform: `translateY(${(1 - tagIn) * 18}px)`,
          }}
        >
          Perks people <span style={{ color: C.orange }}>actually</span> use.
        </div>
        <div
          style={{
            fontFamily: body,
            fontSize: 26,
            color: "rgba(255,255,255,.65)",
            marginTop: 14,
            opacity: subIn,
          }}
        >
          A marketplace · AI planner · drops · games — one budget, zero friction.
        </div>
      </div>
    </AbsoluteFill>
  );
};
