import type { FC } from "react";
import { Intro } from "./scenes/Intro";
import { Planner } from "./scenes/Planner";
import { Marketplace } from "./scenes/Marketplace";
import { Drops } from "./scenes/Drops";
import { Mystery } from "./scenes/Mystery";
import { Spin } from "./scenes/Spin";
import { Steps } from "./scenes/Steps";
import { WorldCup } from "./scenes/WorldCup";
import { Insights } from "./scenes/Insights";
import { Outro } from "./scenes/Outro";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TRANSITION = 16; // crossfade frames between scenes

// Each scene's on-screen length (before transition overlap is subtracted).
export const SCENES: { id: string; Component: FC; duration: number }[] = [
  { id: "Intro", Component: Intro, duration: 100 },
  { id: "Planner", Component: Planner, duration: 175 },
  { id: "Marketplace", Component: Marketplace, duration: 155 },
  { id: "Drops", Component: Drops, duration: 140 },
  { id: "Mystery", Component: Mystery, duration: 145 },
  { id: "Spin", Component: Spin, duration: 175 },
  { id: "Steps", Component: Steps, duration: 160 },
  { id: "WorldCup", Component: WorldCup, duration: 155 },
  { id: "Insights", Component: Insights, duration: 140 },
  { id: "Outro", Component: Outro, duration: 130 },
];

// TransitionSeries overlaps each transition, shortening the timeline.
export const TOTAL_DURATION =
  SCENES.reduce((s, sc) => s + sc.duration, 0) - TRANSITION * (SCENES.length - 1);
