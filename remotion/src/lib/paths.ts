import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

export const remotionRoot = resolve(currentDir, "..", "..");
export const repoRoot = resolve(remotionRoot, "..");
export const publicRoot = resolve(remotionRoot, "public");
export const pipelinePublicRoot = resolve(publicRoot, ".pipeline");
export const defaultPreviewManifestPath = "preview/basic/manifest.render.json";
