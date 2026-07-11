import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cloudDaemonSnapshot } from "@ge/run-ledger/control-plane";

const execFileAsync = promisify(execFile);

async function gcloudJson(args) {
  const { stdout } = await execFileAsync("gcloud", [...args, "--format=json"], { maxBuffer: 10 * 1024 * 1024 });
  return stdout.trim() ? JSON.parse(stdout) : {};
}

function conditionStatus(resource, type) {
  const condition = (resource?.status?.conditions || resource?.conditions || []).find((item) => item.type === type);
  return String(condition?.status || "").toLowerCase() === "true";
}

export function summarizeWorkerService(service = {}, { name = "ge-agent-factory-worker" } = {}) {
  const ready = conditionStatus(service, "Ready");
  const serving = conditionStatus(service, "RoutesReady") || ready;
  return {
    name,
    status: ready && serving ? "serving" : "unhealthy",
    url: service?.status?.url || service?.uri || null,
    latestReadyRevision: service?.status?.latestReadyRevisionName || null,
    latestCreatedRevision: service?.status?.latestCreatedRevisionName || null,
    traffic: service?.status?.traffic || [],
  };
}

export function summarizeTaskQueue(queue = {}, { name = "ge-agent-factory-stages" } = {}) {
  const state = String(queue.state || queue.name || "").toUpperCase() === "RUNNING"
    ? "RUNNING"
    : String(queue.state || queue?.stats?.state || "UNKNOWN").toUpperCase();
  return {
    name,
    state,
    status: state === "RUNNING" ? "healthy" : "unhealthy",
    rateLimits: queue.rateLimits || null,
    retryConfig: queue.retryConfig || null,
  };
}

export async function readCloudDaemonStatus(cfg = {}, { runJson = gcloudJson, now = new Date().toISOString() } = {}) {
  const project = cfg.project;
  const region = cfg.region || "us-central1";
  const workerService = cfg.workerService || "ge-agent-factory-worker";
  const tasksQueue = cfg.tasksQueue || "ge-agent-factory-stages";
  const projectArgs = project ? ["--project", project] : [];
  const worker = await runJson([
    "run", "services", "describe", workerService,
    ...projectArgs,
    "--region", region,
  ]).then((service) => summarizeWorkerService(service, { name: workerService })).catch((error) => ({
    name: workerService,
    status: "unhealthy",
    error: error?.message || String(error),
  }));
  const queue = await runJson([
    "tasks", "queues", "describe", tasksQueue,
    ...projectArgs,
    "--location", region,
  ]).then((q) => summarizeTaskQueue(q, { name: tasksQueue })).catch((error) => ({
    name: tasksQueue,
    status: "unhealthy",
    state: "UNKNOWN",
    error: error?.message || String(error),
  }));
  const caches = [
    {
      kind: "workspace",
      enabled: process.env.GE_FACTORY_WORKSPACE_CACHE !== "0",
      hit: null,
      uri: cfg.bucket ? `gs://${cfg.bucket}/cache/workspaces/` : null,
    },
  ];
  return {
    project,
    region,
    snapshot: cloudDaemonSnapshot({ workers: [worker], queues: [queue], caches, now }),
    workers: [worker],
    queues: [queue],
    caches,
  };
}
