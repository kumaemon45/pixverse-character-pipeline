import { spawn } from "node:child_process";
import { delimiter, dirname } from "node:path";
import { getErrorMessage } from "./helpers";

type RunCommandOptions = {
  captureOutput?: boolean;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
};

const uniquePathEntries = (entries: Array<string | undefined>): string[] => {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const entry of entries) {
    const value = entry?.trim();

    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    normalized.push(value);
  }

  return normalized;
};

export const buildCommandEnv = (overrides?: NodeJS.ProcessEnv): NodeJS.ProcessEnv => {
  const normalizedPath = uniquePathEntries([
    dirname(process.execPath),
    process.env.NVM_BIN,
    ...(process.env.PATH?.split(delimiter) ?? []),
  ]).join(delimiter);

  const env: NodeJS.ProcessEnv = {
    ...process.env,
    PATH: normalizedPath,
  };

  return overrides ? { ...env, ...overrides } : env;
};

export const runCommand = async (
  command: string,
  args: string[],
  options: RunCommandOptions = {},
): Promise<{ stderr: string; stdout: string }> => {
  const { captureOutput = true, cwd, env } = options;

  return await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: buildCommandEnv(env),
      stdio: captureOutput ? ["ignore", "pipe", "pipe"] : "inherit",
    });

    let stdout = "";
    let stderr = "";

    if (captureOutput) {
      child.stdout?.on("data", (chunk) => {
        stdout += chunk.toString();
      });

      child.stderr?.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("error", (error) => {
      reject(new Error(`Failed to start ${command}: ${getErrorMessage(error)}`));
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Command failed (${command} ${args.join(" ")}): ${
              stderr.trim() || stdout.trim() || `exit code ${code}`
            }`,
          ),
        );
        return;
      }

      resolve({ stderr, stdout });
    });
  });
};
