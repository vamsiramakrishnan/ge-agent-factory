// Shared run control-plane primitives.
//
// These helpers are deliberately pure: they define the idempotency, fanout,
// fan-in, cache, and daemon-status vocabulary used by CLI/API/console/worker
// code without importing any transport SDK. Cloud Tasks, Firestore, local
// daemon, and UI code should depend on this contract instead of re-inventing
// subtly different ids and summaries.

import { createHash } from "node:crypto";
import { normalizeStatus } from "./status.mjs";

export const CONTROL_PLANE_VERSION = 1;
export const RUN_LEDGER_COLLECTION = "factoryRuns";
export const FACTORY_STAGE_IDS = Object.freeze([
  "plan",
  "generate_workspace",
  "generate_data",
  "package_data",
  "harness_refine",
  "validate",
  "preview",
  "plan_deploy",
  "load_data",
  "deploy_runtime",
  "poll_runtime",
  "register_tools",
  "publish_enterprise",
  "verify_live",
]);
export const DEFAULT_FACTORY_STAGE_ORDER = FACTORY_STAGE_IDS;

export function stableJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableJson(item)).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
}

export function contentHash(value, { algorithm = "sha256", length = 64, prefix = "" } = {}) {
  const digest = createHash(algorithm).update(stableJson(value)).digest("hex");
  const clipped = length > 0 ? digest.slice(0, length) : digest;
  return prefix ? `${prefix}:${clipped}` : clipped;
}

export function cacheKey(kind, material, { version = "v1", length = 32 } = {}) {
  return contentHash({ kind, version, material }, { length });
}

export function cacheRecord({ kind, key, uri = null, hit = false, enabled = true, material = null, now = new Date().toISOString() } = {}) {
  return {
    kind: String(kind || "cache"),
    key: String(key || ""),
    uri,
    hit: Boolean(hit),
    enabled: Boolean(enabled),
    material,
    checkedAt: now,
  };
}

export function cloudTaskId(value, { maxBase = 420, hashLength = 10 } = {}) {
  const raw = String(value || "task");
  const base = raw
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxBase)
    .replace(/-+$/g, "");
  const hash = createHash("sha1").update(raw).digest("hex").slice(0, hashLength);
  return `${base || "task"}-${hash}`;
}

export function stageAttemptKey({ runId, itemId, stage, attempt = 1 } = {}) {
  return [runId, itemId, stage, attempt].map((part) => String(part ?? "")).join(":");
}

export function deterministicStageTaskId({ runId, itemId, stage, attempt = 1 } = {}) {
  return cloudTaskId(`${runId}-${itemId}-${stage}-${attempt}`);
}

function normalizeWorkItem(item) {
  if (typeof item === "string") return { itemId: item, workspaceId: item };
  const itemId = item?.itemId || item?.id || item?.workspaceId || item?.useCaseId;
  return {
    ...item,
    itemId: String(itemId || "item"),
    workspaceId: String(item?.workspaceId || itemId || "item"),
  };
}

export function buildStageFanout({ runId, stage, workItems = [], attempt = 1, targetStage = null, payloadFor = null } = {}) {
  const tasks = workItems.map((rawItem) => {
    const item = normalizeWorkItem(rawItem);
    const base = {
      runId,
      itemId: item.itemId,
      workspaceId: item.workspaceId,
      stage,
      attempt,
      targetStage,
    };
    const payload = typeof payloadFor === "function" ? payloadFor(item, base) : { ...(item.payload || {}), ...base };
    return {
      key: stageAttemptKey(base),
      taskId: deterministicStageTaskId(base),
      ...base,
      payload,
    };
  });
  return {
    kind: "stage_fanout",
    version: CONTROL_PLANE_VERSION,
    runId,
    stage,
    attempt,
    targetStage,
    total: tasks.length,
    tasks,
  };
}

export function summarizeFanIn({ items = [], targetStage = null } = {}) {
  const rows = items.map((item) => ({
    ...item,
    status: normalizeStatus(item?.status),
  }));
  const total = rows.length;
  const done = rows.filter((item) => item.status === "done").length;
  const failed = rows.filter((item) => item.status === "failed").length;
  const blocked = rows.filter((item) => item.status === "blocked").length;
  const running = rows.filter((item) => item.status === "running").length;
  const pending = rows.filter((item) => item.status === "pending").length;
  const status = failed
    ? "failed"
    : blocked
      ? "blocked"
      : running
        ? "running"
        : total > 0 && done === total
          ? "done"
          : "pending";
  return {
    kind: "fan_in_summary",
    version: CONTROL_PLANE_VERSION,
    targetStage,
    total,
    done,
    failed,
    blocked,
    running,
    pending,
    status,
    terminal: status === "done" || status === "failed",
    ok: status === "done" ? true : status === "failed" ? false : null,
  };
}

export function cloudDaemonSnapshot({ workers = [], queues = [], caches = [], now = new Date().toISOString() } = {}) {
  const unhealthyQueues = queues.filter((queue) => queue.status && !["healthy", "ok", "ready"].includes(String(queue.status).toLowerCase()));
  const unhealthyWorkers = workers.filter((worker) => worker.status && !["healthy", "ok", "ready", "serving"].includes(String(worker.status).toLowerCase()));
  const readyWorkers = workers.filter((worker) => ["healthy", "ok", "ready", "serving"].includes(String(worker.status || "").toLowerCase())).length;
  const cacheMisses = caches.filter((cache) => cache.enabled !== false && cache.hit === false).length;
  const status = unhealthyQueues.length || unhealthyWorkers.length
    ? "degraded"
    : workers.length && readyWorkers === 0
      ? "degraded"
      : "healthy";
  return {
    kind: "cloud_daemon_snapshot",
    version: CONTROL_PLANE_VERSION,
    status,
    checkedAt: now,
    workers: { total: workers.length, ready: readyWorkers, unhealthy: unhealthyWorkers.length },
    queues: { total: queues.length, unhealthy: unhealthyQueues.length },
    caches: { total: caches.length, misses: cacheMisses },
  };
}
