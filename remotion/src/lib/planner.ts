import { ratioToSlug } from "./helpers";
import type { LoadedConfig } from "./config";
import type { PipelinePlan } from "./types";

export const buildPipelinePlan = (loaded: LoadedConfig): PipelinePlan => {
  const variants = Object.entries(loaded.config.locales).flatMap(([language, locale]) =>
    loaded.config.render.aspectRatios.map((aspectRatio) => {
      const generatedClipCount = locale.clips.filter((clip) => clip.source === "generated").length;

      return {
        aspectRatio,
        generatedClipCount,
        language,
        ratioSlug: ratioToSlug(aspectRatio),
        usesGeneratedClips: generatedClipCount > 0,
      };
    }),
  );

  const requiresGeneration = variants.some((variant) => variant.usesGeneratedClips);
  const baseJobs = requiresGeneration
    ? loaded.config.render.aspectRatios.map((aspectRatio) => ({
        aspectRatio,
        prompt:
          loaded.config.generation.prompt.perRatio?.[aspectRatio] ??
          loaded.config.generation.prompt.base,
      }))
    : [];

  const speechJobs = variants.reduce((sum, variant) => sum + variant.generatedClipCount, 0);
  const soundJobs = loaded.config.generation.ambientSound ? speechJobs : 0;
  const upscaleJobs = loaded.config.generation.upscale ? speechJobs : 0;

  return {
    baseJobs,
    sourceFormat: loaded.sourceFormat,
    totals: {
      baseJobs: baseJobs.length,
      generatedClipVariants: speechJobs,
      soundJobs,
      speechJobs,
      totalJobs: baseJobs.length + speechJobs + soundJobs + upscaleJobs,
      upscaleJobs,
      variants: variants.length,
    },
    variants,
  };
};
