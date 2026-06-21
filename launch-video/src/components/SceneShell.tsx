import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { C, display, body, EASE_OUT } from "../theme";

// Fixed section header (sits above the zooming window).
export const SectionHeader: React.FC<{ eyebrow: string; title: React.ReactNode }> = ({
  eyebrow,
  title,
}) => {
  const frame = useCurrentFrame();
  const inT = interpolate(frame, [4, 24], [0, 1], {
    easing: EASE_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        width: "100%",
        textAlign: "center",
        opacity: inT,
        transform: `translateY(${(1 - inT) * -16}px)`,
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: body,
          fontSize: 18,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: C.orange,
        }}
      >
        {eyebrow}
      </div>
      <div style={{ fontFamily: display, fontSize: 46, fontWeight: 700, color: "#fff", marginTop: 8 }}>
        {title}
      </div>
    </div>
  );
};

// Spotlight + window entrance (rise + fade + subtle scale), centered below the header.
export const WindowStage: React.FC<{ children: React.ReactNode; top?: number }> = ({
  children,
  top = 198,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200, mass: 0.9 } });
  const y = interpolate(rise, [0, 1], [80, 0]);
  const scale = interpolate(rise, [0, 1], [0.93, 1]);
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(58% 52% at 50% 50%, rgba(255,240,220,.12) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top,
          left: "50%",
          transformOrigin: "top center",
          opacity,
          transform: `translate(-50%, ${y}px) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
