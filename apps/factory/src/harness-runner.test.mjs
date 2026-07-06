import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { __test } from "./harness-runner.js";

describe("harness runner config", () => {
  // Hermetic: the .ge.json under test is written to a temp repoRoot, and the
  // ambient project/location env vars that would win over the file are
  // cleared for the duration — so this passes (and means the same thing) on a
  // machine with no gcloud config and on a developer laptop with one.
  const ENV_KEYS = ["GCP_PROJECT_ID", "GOOGLE_CLOUD_PROJECT", "GCLOUD_PROJECT", "GOOGLE_CLOUD_LOCATION", "GOOGLE_GENAI_LOCATION", "GEMINI_ENTERPRISE_LOCATION"];
  let savedEnv;
  let tmpRepoRoot;
  beforeAll(() => {
    savedEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
    for (const key of ENV_KEYS) delete process.env[key];
    tmpRepoRoot = mkdtempSync(join(tmpdir(), "ge-harness-cfg-"));
    writeFileSync(join(tmpRepoRoot, ".ge.json"), JSON.stringify({ project: "c12-test-project", geLocation: "global" }));
  });
  afterAll(() => {
    for (const key of ENV_KEYS) {
      if (savedEnv[key] === undefined) delete process.env[key];
      else process.env[key] = savedEnv[key];
    }
    rmSync(tmpRepoRoot, { recursive: true, force: true });
  });

  test("resolves Vertex project from repo-root .ge.json (via c12)", async () => {
    const defaults = await __test.resolveVertexDefaults({
      repoRoot: tmpRepoRoot,
      project: null,
      location: null,
      vertex: true,
    });

    expect(defaults.project).toBe("c12-test-project");
    expect(defaults.location).toBe("global");
  });

  test("buffers split Antigravity status lines before parsing", () => {
    const lines = __test.createLineBuffer();
    const first = lines.push('{"type":"antigravity.text_delta",');
    const second = lines.push('"preview":"hello"}\n');
    expect(first).toEqual([]);
    expect(second).toEqual(['{"type":"antigravity.text_delta","preview":"hello"}']);

    const parsed = __test.parseAntigravityStatusLines(`${second[0]}\n`);
    expect(parsed.events[0].type).toBe("antigravity.text_delta");
    expect(parsed.events[0].preview).toBe("hello");
  });
});
