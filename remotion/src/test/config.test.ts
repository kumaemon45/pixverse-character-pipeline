import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { loadProjectConfig } from "../lib/config";

test("project.yaml and spokesperson.yaml normalize to the same internal config", async () => {
  const projectConfig = await loadProjectConfig(
    resolve(process.cwd(), "../fixtures/legacy/project.yaml"),
  );
  const legacyConfig = await loadProjectConfig(
    resolve(process.cwd(), "../fixtures/legacy/spokesperson.yaml"),
  );

  assert.deepEqual(projectConfig.config, legacyConfig.config);
});
