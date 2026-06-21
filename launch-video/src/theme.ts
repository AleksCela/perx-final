import { Easing } from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadBody } from "@remotion/google-fonts/HankenGrotesk";

// Perx brand palette (mirrors the product's globals.css)
export const C = {
  orange: "#ff6a1f",
  orangeD: "#b23c0a",
  orangeL: "#ff8a4f",
  blue: "#1f5be0",
  blueD: "#15347e",
  gold: "#e8b23a",
  paper: "#f5efe3",
  ink: "#1a1610",
  muted: "#6e6657",
  card: "#fffdf8",
  line: "rgba(26,22,16,.1)",
};

// No-arg load avoids per-weight validation throws; faux-weights are fine here.
export const display = loadDisplay().fontFamily;
export const body = loadBody().fontFamily;

// Shared easing curves
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1); // crisp UI entrance
export const EASE_IN_OUT = Easing.bezier(0.45, 0, 0.55, 1); // editorial
export const POP = Easing.bezier(0.34, 1.56, 0.64, 1); // playful overshoot

export const W = 1920;
export const H = 1080;
export const FPS = 30;
