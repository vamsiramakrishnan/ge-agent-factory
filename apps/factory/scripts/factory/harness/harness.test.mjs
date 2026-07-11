import { test, expect } from "bun:test";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { __internal } from "./harness.mjs";

test("refineResumeOptions persists by saveDir without inventing a resume-only conversation id", async () => {
  const root = await mkdtemp(join(tmpdir(), "ge-harness-resume-"));
  const workspace = join(root, "factory-example-agent");
  const result = await __internal.refineResumeOptions(workspace, {}, {
    envOff: () => false,
    HARNESS_DATA_ROOT: root,
    mkdir: async () => {},
    basename,
  });

  expect(result).toEqual({
    saveDir: join(root, "harness-sessions", "refine-factory-example-agent"),
  });
  expect(result.conversationId).toBeUndefined();
});

test("refineResumeOptions honors GE_HARNESS_NO_RESUME", async () => {
  const result = await __internal.refineResumeOptions("/tmp/ws", {}, {
    envOff: () => true,
    HARNESS_DATA_ROOT: "/tmp/data",
    mkdir: async () => { throw new Error("mkdir should not run"); },
    basename,
  });

  expect(result).toEqual({});
});

test("resolveHarnessLocation prefers Gemini/Antigravity global location over Cloud Run region", () => {
  const keys = ["GOOGLE_GENAI_LOCATION", "GEMINI_ENTERPRISE_LOCATION", "ANTIGRAVITY_VERTEX_LOCATION", "GOOGLE_CLOUD_LOCATION"];
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  try {
    process.env.GOOGLE_CLOUD_LOCATION = "us-central1";
    process.env.GEMINI_ENTERPRISE_LOCATION = "global";
    delete process.env.GOOGLE_GENAI_LOCATION;
    delete process.env.ANTIGRAVITY_VERTEX_LOCATION;

    expect(__internal.resolveHarnessLocation({})).toBe("global");
    expect(__internal.resolveHarnessLocation({ location: "europe-west4" })).toBe("europe-west4");
  } finally {
    for (const key of keys) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
});
