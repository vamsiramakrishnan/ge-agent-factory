import { test, expect } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { buildStageExecutionPlan, parseWorkerPayload } from "./factory-worker.js";

const REPO_ROOT = join(import.meta.dirname, "../../..");

test("remote harness_refine runs Antigravity SDK review and refine from the worker", () => {
  const payload = parseWorkerPayload({
    runId: "run-ag",
    itemId: "agent-a",
    stage: "harness_refine",
    targetStage: "validate",
    workspaceDir: "/workspace",
    cloud: {
      projectId: "test-project",
      runtimeRegion: "us-central1",
      vertexLocation: "us-central1",
    },
    options: {
      harnessProvider: "antigravity-sdk",
      model: "gemini-3.5-flash",
    },
  }, {});

  const plan = buildStageExecutionPlan(payload);

  expect(plan.owner).toBe("cloud_run_service");
  expect(plan.nextStage).toBe("validate");
  expect(plan.commands).toEqual([
    ["node", ["scripts/verify-harness-runtime.mjs", "--dir", "/workspace", "--provider", "antigravity-sdk"]],
    ["node", [
      "scripts/factory.mjs",
      "harness-review",
      "--dir", "/workspace",
      "--provider", "antigravity-sdk",
      "--vertex", "true",
      "--project", "test-project",
      "--location", "us-central1",
      "--model", "gemini-3.5-flash",
      "--soft", "true",
    ]],
    ["node", [
      "scripts/factory.mjs",
      "harness-refine",
      "--dir", "/workspace",
      "--provider", "antigravity-sdk",
      "--vertex", "true",
      "--project", "test-project",
      "--location", "us-central1",
      "--model", "gemini-3.5-flash",
      "--soft", "true",
      "--run-id", "run-ag",
      "--item-id", "agent-a",
      "--locality", "remote",
      "--target-gate", "validate",
    ]],
  ]);
});

test("remote harness_refine can be explicitly skipped for deterministic builds", () => {
  const payload = parseWorkerPayload({
    runId: "run-ag",
    itemId: "agent-a",
    stage: "harness_refine",
    targetStage: "validate",
    workspaceDir: "/workspace",
    cloud: { projectId: "test-project" },
    options: { refine: false },
  }, {});

  const plan = buildStageExecutionPlan(payload);

  expect(plan.nextStage).toBe("validate");
  expect(plan.commands).toEqual([]);
});

test("worker image installs the Antigravity and ADK Python runtime", async () => {
  const dockerfile = await readFile(join(REPO_ROOT, "apps/factory/Dockerfile"), "utf8");

  expect(dockerfile).toContain("google-antigravity");
  expect(dockerfile).toContain("google-adk");
  expect(dockerfile).toContain("\"google-adk[eval]\"");
});
