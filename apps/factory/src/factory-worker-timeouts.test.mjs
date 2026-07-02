// Timeout triangle invariant (taste-campaign 09 §C1).
//
// The three timeouts that govern a cloud stage delivery must line up:
//
//   dispatchDeadline (code)  ===  Cloud Run worker timeout (terraform)
//                            >=   longest stage expectation
//
// If dispatchDeadline < the Cloud Run timeout, a stage still executing past the
// deadline gets a DUPLICATE concurrent redelivery while attempt 1 runs (this was
// the live behavior with the 600s Cloud Tasks default). These tests read the
// Terraform sources as TEXT so that a change on either side — code constant or
// tf — fails here instead of drifting silently.
import { test, expect } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { TASK_DISPATCH_DEADLINE, enqueueFactoryStage, parseWorkerPayload } from "./factory-worker.js";

const REPO_ROOT = join(import.meta.dirname, "../../..");
const CLOUD_RUN_TF = join(REPO_ROOT, "installer/terraform/cloud_run.tf");
const TASKS_TF = join(REPO_ROOT, "installer/terraform/tasks.tf");
const FACTORY_BRIDGE = join(REPO_ROOT, "apps/presentation/src/server/factory-bridge.js");

// Cloud Tasks hard ceiling for httpTarget dispatchDeadline.
const CLOUD_TASKS_MAX_DISPATCH_DEADLINE_SECONDS = 1800;

// The longest a single stage is EXPECTED to run inside one worker request.
// The worst case is harness_refine (Antigravity review + refine over the whole
// workspace); release stages are async Cloud Build submits and don't hold the
// request. This is the documented operational expectation the triangle must
// cover — raise it only together with the Cloud Run timeout and the deadline.
const LONGEST_STAGE_EXPECTATION_SECONDS = 1500;

function parseDurationSeconds(value) {
  const match = String(value || "").match(/^(\d+)s$/);
  expect(match, `expected a "<seconds>s" duration, got: ${value}`).toBeTruthy();
  return Number(match[1]);
}

async function readWorkerCloudRunTimeoutSeconds() {
  const tf = await readFile(CLOUD_RUN_TF, "utf8");
  // Scope to the worker service resource (the gateway has its own, shorter timeout).
  const workerBlock = tf.slice(
    tf.indexOf('resource "google_cloud_run_v2_service" "worker"'),
    tf.indexOf('resource "google_cloud_run_v2_service" "gateway"'),
  );
  const match = workerBlock.match(/timeout\s*=\s*"(\d+s)"/);
  expect(match, "worker Cloud Run resource must declare a timeout").toBeTruthy();
  return parseDurationSeconds(match[1]);
}

test("timeout triangle: dispatchDeadline(code) === Cloud Run worker timeout(terraform) >= longest stage", async () => {
  const dispatchDeadlineSeconds = parseDurationSeconds(TASK_DISPATCH_DEADLINE);
  const cloudRunTimeoutSeconds = await readWorkerCloudRunTimeoutSeconds();
  expect(dispatchDeadlineSeconds).toBe(cloudRunTimeoutSeconds);
  expect(cloudRunTimeoutSeconds).toBeGreaterThanOrEqual(LONGEST_STAGE_EXPECTATION_SECONDS);
  expect(dispatchDeadlineSeconds).toBeLessThanOrEqual(CLOUD_TASKS_MAX_DISPATCH_DEADLINE_SECONDS);
});

test("tasks.tf: retry_config is bounded by max_attempts only (no max_retry_duration window)", async () => {
  const tf = await readFile(TASKS_TF, "utf8");
  // A 600s wall-clock retry window expired before a single 1800s attempt could
  // retry even once; the attempt-count cap is the sole intended bound.
  expect(tf).not.toMatch(/^\s*max_retry_duration\s*=/m);
  expect(tf).toMatch(/max_attempts\s*=\s*5/);
});

test("gateway enqueue (factory-bridge.js) carries the same dispatchDeadline", async () => {
  // The presentation gateway builds its task payload independently (it cannot
  // import across apps), so pin its literal to the shared constant by text.
  const bridge = await readFile(FACTORY_BRIDGE, "utf8");
  expect(bridge).toContain(`dispatchDeadline: "${TASK_DISPATCH_DEADLINE}"`);
});

test("worker enqueue REST body sets task.dispatchDeadline on every created task", async () => {
  const payload = parseWorkerPayload({
    runId: "run-t1",
    itemId: "timeouts-item",
    stage: "generate_data",
    targetStage: "verify_live",
    workspaceDir: ".",
    cloud: {
      projectId: "test-project",
      runtimeRegion: "us-central1",
      workerServiceUrl: "https://ge-agent-factory-worker-test.a.run.app",
    },
  });
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  process.env.GOOGLE_OAUTH_ACCESS_TOKEN = "test-token";
  const captured = [];
  globalThis.fetch = async (url, options = {}) => {
    captured.push({ url: String(url), options });
    return { ok: true, status: 200, json: async () => ({}), text: async () => "" };
  };
  try {
    const result = await enqueueFactoryStage(payload);
    expect(result.ok).toBe(true);
    const create = captured.find((call) => call.url.includes("cloudtasks.googleapis.com"));
    expect(create).toBeTruthy();
    const body = JSON.parse(create.options.body);
    expect(body.task.dispatchDeadline).toBe(TASK_DISPATCH_DEADLINE);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
    else process.env.GOOGLE_OAUTH_ACCESS_TOKEN = originalToken;
  }
});
