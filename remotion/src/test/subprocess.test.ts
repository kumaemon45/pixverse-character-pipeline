import test from "node:test";
import assert from "node:assert/strict";
import { delimiter, dirname } from "node:path";
import { buildCommandEnv } from "../lib/subprocess";

test("buildCommandEnv keeps the current node bin ahead of inherited PATH entries", () => {
  const originalPath = process.env.PATH;
  const originalNvmBin = process.env.NVM_BIN;
  const currentNodeBin = dirname(process.execPath);

  process.env.PATH = ["/usr/local/bin", "/usr/bin"].join(delimiter);
  process.env.NVM_BIN = "/custom/nvm/bin";

  try {
    const env = buildCommandEnv();
    const entries = (env.PATH ?? "").split(delimiter);

    assert.equal(entries[0], currentNodeBin);

    if (currentNodeBin === process.env.NVM_BIN) {
      assert.equal(entries[1], "/usr/local/bin");
    } else {
      assert.equal(entries[1], process.env.NVM_BIN);
      assert.equal(entries[2], "/usr/local/bin");
    }
  } finally {
    if (originalPath === undefined) {
      delete process.env.PATH;
    } else {
      process.env.PATH = originalPath;
    }

    if (originalNvmBin === undefined) {
      delete process.env.NVM_BIN;
    } else {
      process.env.NVM_BIN = originalNvmBin;
    }
  }
});
