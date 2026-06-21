import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Background } from "./components/Background";
import { SCENES, TRANSITION } from "./video";

export const LaunchVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Persistent cinematic backdrop — only the scene content crossfades. */}
      <Background />
      <TransitionSeries>
        {SCENES.map((sc, i) => {
          const Scene = sc.Component;
          return (
            <React.Fragment key={sc.id}>
              <TransitionSeries.Sequence durationInFrames={sc.duration}>
                <Scene />
              </TransitionSeries.Sequence>
              {i < SCENES.length - 1 ? (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({ durationInFrames: TRANSITION })}
                />
              ) : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
