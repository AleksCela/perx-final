import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { C } from "../theme";

// Persistent cinematic stage: deep warm gradient + slowly drifting colored
// blobs + a subtle vignette. Rendered once behind every scene so transitions
// crossfade only the content, keeping the backdrop rock-solid.
const Blob: React.FC<{ x: number; y: number; r: number; color: string; phase: number }> = ({
  x,
  y,
  r,
  color,
  phase,
}) => {
  const frame = useCurrentFrame();
  const dx = Math.sin((frame + phase) / 90) * 40;
  const dy = Math.cos((frame + phase) / 110) * 30;
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: y + dy,
        width: r,
        height: r,
        borderRadius: "50%",
        background: color,
        filter: "blur(120px)",
        opacity: 0.5,
      }}
    />
  );
};

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shimmer = interpolate(Math.sin(frame / 120), [-1, 1], [0.9, 1.05]);
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(130% 120% at 50% -10%, #2c2315 0%, #1a1610 55%, #110e09 100%)",
      }}
    >
      <Blob x={120} y={120} r={620} color={C.orange} phase={0} />
      <Blob x={1300} y={-120} r={680} color={C.blueD} phase={40} />
      <Blob x={1380} y={620} r={560} color={C.orange} phase={80} />
      <Blob x={-120} y={640} r={520} color={C.blue} phase={120} />
      {/* faint grid */}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,.45) 100%)",
          opacity: shimmer,
        }}
      />
    </AbsoluteFill>
  );
};
