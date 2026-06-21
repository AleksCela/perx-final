import "./index.css";
import { Composition } from "remotion";
import { LaunchVideo } from "./Composition";
import { FPS, WIDTH, HEIGHT, TOTAL_DURATION } from "./video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LaunchVideo"
      component={LaunchVideo}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
