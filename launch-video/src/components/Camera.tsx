import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { EASE_IN_OUT } from "../theme";

// A "camera" that performs a slow Ken-Burns push toward a focus point. Wrap a
// scene's content (and its cursor) so both zoom together and stay aligned.
export const Camera: React.FC<{
  children: React.ReactNode;
  focus?: [number, number]; // px in the 1920x1080 stage
  zoom?: [number, number]; // start -> end scale
  range?: [number, number]; // frame range for the push
  pan?: [number, number]; // extra translate at the end (px)
}> = ({
  children,
  focus = [960, 540],
  zoom = [1, 1.12],
  range = [0, 150],
  pan = [0, 0],
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, range, [0, 1], {
    easing: EASE_IN_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = zoom[0] + (zoom[1] - zoom[0]) * t;
  const tx = pan[0] * t;
  const ty = pan[1] * t;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${focus[0]}px ${focus[1]}px`,
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
