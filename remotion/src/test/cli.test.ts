import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { runCommand } from "../lib/subprocess";

const repoRoot = resolve(process.cwd(), "..");
const outputRoot = resolve(repoRoot, "output");
const pipelineBin = "./bin/pipeline";

const parseTrailingJson = (output: string) => {
  const normalized = output.trim();
  const start = normalized.lastIndexOf("\n{");
  const jsonText = start >= 0 ? normalized.slice(start + 1) : normalized;
  return JSON.parse(jsonText);
};

test("pipeline validate and plan succeed for fixture config", async () => {
  const validate = await runCommand(
    pipelineBin,
    ["validate", "--config", "../fixtures/basic/project.yaml"],
    {
      captureOutput: true,
      cwd: process.cwd(),
    },
  );

  const plan = await runCommand(
    pipelineBin,
    ["plan", "--config", "../fixtures/generated/project.yaml"],
    {
      captureOutput: true,
      cwd: process.cwd(),
    },
  );

  assert.equal(parseTrailingJson(validate.stdout).ok, true);
  assert.equal(parseTrailingJson(plan.stdout).ok, true);
});

test("pipeline run dry-run writes a manifest", async () => {
  const runId = "dry-run-test";
  const runDir = resolve(outputRoot, "mixed-generated", runId);
  await rm(runDir, { force: true, recursive: true });

  const result = await runCommand(
    pipelineBin,
    [
      "run",
      "--config",
      "../fixtures/generated/project.yaml",
      "--dry-run",
      "--run-id",
      runId,
    ],
    {
      captureOutput: true,
      cwd: process.cwd(),
    },
  );

  const payload = parseTrailingJson(result.stdout);
  const manifestPath = payload.manifestPath as string;
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

  assert.equal(payload.ok, true);
  assert.equal(manifest.summary.planned, 4);
});

test("pipeline render produces an mp4 for local assets", async () => {
  const runId = "render-smoke";
  const runDir = resolve(outputRoot, "local-smoke", runId);
  await rm(runDir, { force: true, recursive: true });

  const result = await runCommand(
    pipelineBin,
    [
      "render",
      "--config",
      "../fixtures/basic/project.yaml",
      "--lang",
      "en",
      "--ratio",
      "16:9",
      "--run-id",
      runId,
    ],
    {
      captureOutput: true,
      cwd: process.cwd(),
    },
  );

  const payload = parseTrailingJson(result.stdout);
  const manifest = JSON.parse(await readFile(payload.manifestPath, "utf8"));
  const file = manifest.variants[0].file as string;
  const absoluteVideoPath = resolve(runDir, file);

  await access(absoluteVideoPath);
  assert.equal(payload.ok, true);
});
