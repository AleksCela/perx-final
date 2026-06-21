import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { EASE_IN_OUT } from "../theme";

export type Waypoint = { f: number; x: number; y: number };

// An animated macOS-style pointer that glides between waypoints and emits a
// click ripple at given frames. Authored in stage coordinates; place it inside
// the Camera so it tracks the zoom.
export const Cursor: React.FC<{
  path: Waypoint[];
  clicks?: number[];
  appearAt?: number;
}> = ({ path, clicks = [], appearAt = 0 }) => {
  const frame = useCurrentFrame();

  const fs = path.map((p) => p.f);
  const x = interpolate(frame, fs, path.map((p) => p.x), {
    easing: EASE_IN_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, fs, path.map((p) => p.y), {
    easing: EASE_IN_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const appear = interpolate(frame, [appearAt, appearAt + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // closest click → press scale + ripple
  let press = 0;
  let ripple = 0;
  for (const c of clicks) {
    const d = frame - c;
    if (d >= -4 && d <= 18) {
      press = Math.max(press, interpolate(Math.abs(d), [0, 4], [1, 0], { extrapolateRight: "clamp" }));
      if (d >= 0) ripple = Math.max(ripple, interpolate(d, [0, 18], [0, 1], { extrapolateRight: "clamp" }));
    }
  }
  const pressScale = 1 - press * 0.22;

  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: appear, zIndex: 50, pointerEvents: "none" }}>
      {ripple > 0 && ripple < 1 && (
        <div
          style={{
            position: "absolute",
            left: 2,
            top: 2,
            width: 70 * ripple,
            height: 70 * ripple,
            marginLeft: -35 * ripple,
            marginTop: -35 * ripple,
            borderRadius: "50%",
            border: "3px solid rgba(255,106,31,.9)",
            opacity: 1 - ripple,
          }}
        />
      )}
      <svg
        width={40}
        height={40}
        viewBox="0 0 24 24"
        style={{ transform: `scale(${pressScale})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 3px 6px rgba(0,0,0,.4))" }}
      >
        <path
          d="M5 2.5l13 7.5-5.4 1.2 3 6.2-2.6 1.2-3-6.2L5 16.5z"
          fill="#fff"
          stroke="#1a1610"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
