import { interpolate, Easing } from "remotion";

/** Typewriter: returns the visible substring at the current frame. */
export function typed(text: string, frame: number, start: number, charsPerSec = 26, fps = 30): string {
  const chars = Math.floor(((frame - start) / fps) * charsPerSec);
  return text.slice(0, Math.max(0, Math.min(text.length, chars)));
}

/** Eased count-up from 0 (or `from`) to `to` across a frame range. */
export function countUp(
  frame: number,
  range: [number, number],
  to: number,
  from = 0,
): number {
  const v = interpolate(frame, range, [from, to], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.round(v);
}

/** Staggered entrance progress (0..1) for the i-th item. */
export function stagger(frame: number, start: number, i: number, step = 5, dur = 16): number {
  return interpolate(frame, [start + i * step, start + i * step + dur], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
