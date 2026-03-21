import React from "react";
import { Composition } from "remotion";
import { CharacterVideo } from "./CharacterVideo";

const defaultPreviewManifestPath = "preview/basic/manifest.render.json";

export const Root: React.FC = () => {
  return (
    <Composition
      id="CharacterVideo"
      component={CharacterVideo}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        manifestPath: defaultPreviewManifestPath,
      }}
    />
  );
};
