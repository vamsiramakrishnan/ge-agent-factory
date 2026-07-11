import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isRetryableSmokeFailure, runDeployedSmoke } from "./run-deployed-smoke.mjs";

const tempDirs = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })));
});

async function paths() {
  const dir = await mkdtemp(join(tmpdir(), "ge-deployed-smoke-"));
  tempDirs.push(dir);
  return {
    outputPath: join(dir, "deployed-smoke-stdout.log"),
    metadataPath: join(dir, "deployed-smoke.json"),
  };
}

describe("deployed Agent Runtime smoke", () => {
  test("retries a transient stream timeout and records each attempt", async () => {
    const files = await paths();
    const results = [
      { exitCode: 1, timedOut: false, stdout: "[agent]: ready", stderr: "Read timed out." },
      { exitCode: 0, timedOut: false, stdout: "[agent]: ready\nSession: session-1", stderr: "" },
    ];
    const progress = [];
    const result = await runDeployedSmoke({
      url: "https://us-central1-aiplatform.googleapis.com/v1/projects/p/locations/us-central1/reasoningEngines/r",
      retries: 2,
      sleep: async () => {},
      execute: async () => results.shift(),
      progress: (phase, message) => progress.push({ phase, message }),
      ...files,
    });

    expect(result.status).toBe("passed");
    expect(result.attemptCount).toBe(2);
    expect(progress.map(({ phase }) => phase)).toEqual([
      "poll_runtime.smoke.attempt",
      "poll_runtime.smoke.retry",
      "poll_runtime.smoke.attempt",
      "poll_runtime.smoke.done",
    ]);
    expect(await readFile(files.outputPath, "utf8")).toContain("Read timed out.");
    expect(JSON.parse(await readFile(files.metadataPath, "utf8"))).toMatchObject({ status: "passed", attemptCount: 2 });
  });

  test("does not retry a permanent authorization failure", async () => {
    const files = await paths();
    let calls = 0;
    const failure = runDeployedSmoke({
      url: "https://us-central1-aiplatform.googleapis.com/v1/projects/p/locations/us-central1/reasoningEngines/r",
      retries: 4,
      execute: async () => {
        calls += 1;
        return { exitCode: 1, timedOut: false, stdout: "", stderr: "403 PERMISSION_DENIED" };
      },
      progress: () => {},
      ...files,
    });

    await expect(failure).rejects.toThrow("deployed smoke failed after 1/5 attempt(s)");
    expect(calls).toBe(1);
    expect(JSON.parse(await readFile(files.metadataPath, "utf8"))).toMatchObject({ status: "failed", attemptCount: 1 });
  });

  test("recognizes transport and service failures as retryable", () => {
    expect(isRetryableSmokeFailure({ exitCode: 1, stderr: "HTTPSConnectionPool: Read timed out." })).toBe(true);
    expect(isRetryableSmokeFailure({ exitCode: 143, stderr: "" })).toBe(true);
    expect(isRetryableSmokeFailure({ exitCode: 1, stderr: "503 Service Unavailable" })).toBe(true);
    expect(isRetryableSmokeFailure({ exitCode: 1, stderr: "403 PERMISSION_DENIED" })).toBe(false);
  });
});
