import { test, expect } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { buildStageExecutionPlan, classifyFailureText, parseCloudBuildDescribe, parseWorkerPayload } from "./factory-worker.js";

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

test("Cloud Build persists diagnostic trees once at their canonical paths", async () => {
  const config = await readFile(join(REPO_ROOT, "apps/factory/cloudbuild.factory-stage.yaml"), "utf8");

  expect(config).toContain('gcloud storage rsync "$dir" "${_ARTIFACT_PREFIX}/files/./$dir" --recursive --checksums-only');
  expect(config).not.toContain('gcloud storage cp --recursive "$dir"');
  expect(config).toContain("-path './artifacts'");
  expect(config).toContain("-path './tests/eval'");
  expect(config).toContain("-path './evals'");
});

test("classifies Vertex eval judge model config failures", () => {
  expect(classifyFailureText("metrics[0].llm_based_metric_spec.judge_autorater_config.autorater_model; Invalid autorater model resource name", { stage: "validate" })).toMatchObject({
    classification: "eval_config",
    retryable: false,
  });
});

test("classifies Vertex prediction IAM failures", () => {
  expect(classifyFailureText("PERMISSION_DENIED: Permission 'aiplatform.endpoints.predict' denied on resource", { stage: "harness_refine" })).toMatchObject({
    classification: "iam_vertex_predict",
    retryable: false,
  });
});

test("classifies agents-cli project IAM policy binding failures", () => {
  expect(classifyFailureText("Error: Failed to generate old template\nPermission 'resourcemanager.projects.getIamPolicy' denied", { stage: "deploy_runtime" })).toMatchObject({
    classification: "iam_project_policy",
    firstError: "Permission 'resourcemanager.projects.getIamPolicy' denied",
    retryable: false,
  });
});

test("classifies behavior-contract gate failures", () => {
  expect(classifyFailureText("tool_use_quality: mean_score 0.5933 below threshold 0.75", { stage: "validate" })).toMatchObject({
    classification: "workload_eval",
    retryable: false,
  });
  expect(classifyFailureText("agents-cli eval generate/grade gate failed with exit 1 (see artifacts/eval-verdict.json)\nInference timed out after 600s. The Vertex AI call may be hanging; check GOOGLE_CLOUD_LOCATION in your .env.", { stage: "validate" })).toMatchObject({
    classification: "workload_eval",
    retryable: false,
  });
});

test("classifies Cloud Build config and builder-image failures", () => {
  expect(classifyFailureText("Request contains an invalid argument: --substitutions is too long", { stage: "validate" }).classification).toBe("cloud_build_config");
  expect(classifyFailureText("ge-factory-run-stage not found in _BUILDER_IMAGE=ghcr.io/astral-sh/uv:python3.11-bookworm", { stage: "validate" }).classification).toBe("builder_image");
});

test("classifies workspace archive restore failures before builder-image script text", () => {
  const detail = [
    "Build step failure: build step 0 gcr.io/google.com/cloudsdktool/google-cloud-cli:slim failed",
    "failed step restore-workspace gcr.io/google.com/cloudsdktool/google-cloud-cli:slim exit 1",
    "gs://bucket/runs/run/items/ws/agent-result.tar.gz not found: 404",
    "queued script text: ge-factory-run-stage not found in _BUILDER_IMAGE=builder:latest",
  ].join("\n");
  expect(classifyFailureText(detail, { stage: "validate" })).toMatchObject({
    classification: "artifact_storage",
    retryable: false,
  });
});

test("does not classify ordinary Cloud Build metadata image references as builder-image failures", () => {
  expect(classifyFailureText("Cloud Build FAILURE in image us-docker.pkg.dev/demo/ge-agent-factory/ge-agent-factory-builder:latest", { stage: "validate" })).toMatchObject({
    classification: "cloud_build_failure",
    retryable: false,
  });
});

test("parseCloudBuildDescribe preserves failure details and failed step", () => {
  const parsed = parseCloudBuildDescribe(JSON.stringify({
    id: "build-1",
    status: "FAILURE",
    logUrl: "https://logs.example",
    failureInfo: { type: "USER_BUILD_STEP", detail: "step failed" },
    steps: [{ id: "run-stage", status: "SUCCESS" }, { id: "fail-stage-if-needed", status: "FAILURE", exitCode: 1 }],
  }));

  expect(parsed).toMatchObject({
    id: "build-1",
    status: "FAILURE",
    failureInfo: { detail: "step failed" },
    failedStep: { id: "fail-stage-if-needed", status: "FAILURE", exitCode: 1 },
  });
});
