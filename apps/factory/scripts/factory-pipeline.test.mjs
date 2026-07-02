// Unit tests for the pipeline-state cluster (loadPipeline / savePipeline /
// markStep / requireStep / nextCommandFor). Written against the in-file
// functions BEFORE their extraction into factory/core/pipeline.mjs — these
// assertions are the parity proof across the move and must not change with it.
// Pure fs-tempdir tests; no faker, no subprocesses.
import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { loadPipeline, markStep, nextCommandFor, requireStep, savePipeline } from "./factory/core/pipeline.mjs";

describe("loadPipeline / savePipeline / markStep", () => {
  test("fresh workspace loads the default pipeline shape", async () => {
    const dir = mkdtempSync(join(tmpdir(), "factory-pipeline-"));
    try {
      expect(await loadPipeline(dir)).toEqual({
        name: basename(dir),
        domain: "general",
        createdAt: null,
        steps: {},
        currentStep: null,
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("load → mark → save round-trips through mock_systems/pipeline.json", async () => {
    const dir = mkdtempSync(join(tmpdir(), "factory-pipeline-"));
    try {
      const pipeline = await loadPipeline(dir);
      markStep(pipeline, "init", "done", { workspace: "x" });
      expect(pipeline.currentStep).toBe("init");
      expect(pipeline.steps.init.status).toBe("done");
      expect(pipeline.steps.init.workspace).toBe("x");
      // markStep stamps wall-clock completion time (ISO 8601).
      expect(pipeline.steps.init.completedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

      await savePipeline(dir, pipeline);
      const stateFile = join(dir, "mock_systems", "pipeline.json");
      expect(existsSync(stateFile)).toBe(true);
      // writeJson emits pretty-printed JSON with a trailing newline.
      expect(readFileSync(stateFile, "utf8")).toBe(JSON.stringify(pipeline, null, 2) + "\n");

      expect(await loadPipeline(dir)).toEqual(pipeline);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  test("markStep meta spreads after the base fields and can override them", () => {
    const pipeline = { steps: {}, currentStep: null };
    markStep(pipeline, "deploy", "running", { completedAt: "pinned", target: "cloud_run" });
    expect(pipeline.steps.deploy).toEqual({ status: "running", completedAt: "pinned", target: "cloud_run" });
    expect(pipeline.currentStep).toBe("deploy");
  });
});

describe("requireStep", () => {
  test("throws the exact guidance message for a missing step", () => {
    expect(() => requireStep({ steps: {} }, "schema")).toThrow(
      'Step "schema" has not been completed yet. Run "factory schema" first.',
    );
  });

  test("any status other than done still throws; done passes", () => {
    expect(() => requireStep({ steps: { init: { status: "created" } } }, "init")).toThrow(
      'Step "init" has not been completed yet. Run "factory init" first.',
    );
    expect(() => requireStep({ steps: { init: { status: "done" } } }, "init")).not.toThrow();
  });
});

describe("nextCommandFor", () => {
  const dir = "/tmp/ws";
  const STEPS = ["init", "schema", "generate", "tools", "test", "harnessReview", "harnessRefine", "sourceIntegration", "serve", "deploy", "register", "publish"];
  const doneThrough = (step) => {
    const steps = {};
    for (const s of STEPS) {
      steps[s] = { status: "done" };
      if (s === step) break;
    }
    return { steps };
  };

  test("fresh pipeline → init", () => {
    expect(nextCommandFor({ steps: {} }, dir)).toBe("factory init --dir /tmp/ws");
    expect(nextCommandFor({}, dir)).toBe("factory init --dir /tmp/ws");
  });

  test("suggests each subsequent step with its CLI spelling and placeholders", () => {
    expect(nextCommandFor(doneThrough("init"), dir)).toBe("factory schema --dir /tmp/ws");
    expect(nextCommandFor(doneThrough("schema"), dir)).toBe("factory generate --dir /tmp/ws");
    expect(nextCommandFor(doneThrough("generate"), dir)).toBe("factory tools --dir /tmp/ws");
    expect(nextCommandFor(doneThrough("tools"), dir)).toBe("factory test --dir /tmp/ws");
    // camelCase pipeline keys map to kebab-case CLI names.
    expect(nextCommandFor(doneThrough("test"), dir)).toBe("factory harness-review --dir /tmp/ws");
    expect(nextCommandFor(doneThrough("harnessReview"), dir)).toBe("factory harness-refine --dir /tmp/ws");
    expect(nextCommandFor(doneThrough("harnessRefine"), dir)).toBe("factory source-integration-plan --dir /tmp/ws");
    expect(nextCommandFor(doneThrough("sourceIntegration"), dir)).toBe("factory serve --dir /tmp/ws");
    // Cloud steps carry operator-input placeholders.
    expect(nextCommandFor(doneThrough("serve"), dir)).toBe("factory deploy --dir /tmp/ws --project <gcp-project> --region <region>");
    expect(nextCommandFor(doneThrough("deploy"), dir)).toBe("factory register --dir /tmp/ws --as adk|mcp|a2a");
    expect(nextCommandFor(doneThrough("register"), dir)).toBe("factory publish --dir /tmp/ws --app-id <GEMINI_ENTERPRISE_APP_ID>");
    expect(nextCommandFor(doneThrough("publish"), dir)).toBe(null);
  });

  test("a failed step blocks progress; other non-pending statuses do not", () => {
    const failed = doneThrough("init");
    failed.steps.schema = { status: "failed" };
    expect(nextCommandFor(failed, dir)).toBe("factory schema --dir /tmp/ws");

    // test "created" (--run false) and serve "running" have moved past — the
    // next actionable step is deploy.
    const moved = doneThrough("sourceIntegration");
    moved.steps.test = { status: "created" };
    moved.steps.serve = { status: "running" };
    expect(nextCommandFor(moved, dir)).toBe("factory deploy --dir /tmp/ws --project <gcp-project> --region <region>");
  });
});
