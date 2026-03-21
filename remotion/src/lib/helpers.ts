import { relative } from "node:path";
import { publicRoot } from "./paths";
import type { SupportedAspectRatio } from "./types";

export const toPosix = (value: string): string => value.split("\\").join("/");

export const ratioToSlug = (ratio: SupportedAspectRatio): string => ratio.replace(":", "x");

export const slugify = (value: string): string => {
  const ascii = value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase();

  const slug = ascii.replace(/[\s_]+/g, "-").replace(/-+/g, "-");
  return slug || "project";
};

export const timestampForRun = (date = new Date()): string =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

export const todayIsoDate = (): string => new Date().toISOString().slice(0, 10);

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const relativeToPublic = (absolutePath: string): string =>
  toPosix(relative(publicRoot, absolutePath));
