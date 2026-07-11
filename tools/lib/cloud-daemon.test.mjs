import { describe, expect, test } from "bun:test";
import { readCloudDaemonStatus, summarizeTaskQueue, summarizeWorkerService } from "./cloud-daemon.mjs";

describe("cloud daemon status", () => {
  test("summarizes Cloud Run worker readiness", () => {
    expect(summarizeWorkerService({
      status: {
        url: "https://worker.run.app",
        latestReadyRevisionName: "worker-00002",
        latestCreatedRevisionName: "worker-00002",
        conditions: [
          { type: "Ready", status: "True" },
          { type: "RoutesReady", status: "True" },
        ],
      },
    }, { name: "worker" })).toMatchObject({
      name: "worker",
      status: "serving",
      url: "https://worker.run.app",
      latestReadyRevision: "worker-00002",
    });
  });

  test("summarizes Cloud Tasks queue readiness", () => {
    expect(summarizeTaskQueue({ state: "RUNNING", rateLimits: { maxDispatchesPerSecond: 20 } }, { name: "queue" })).toMatchObject({
      name: "queue",
      state: "RUNNING",
      status: "healthy",
      rateLimits: { maxDispatchesPerSecond: 20 },
    });
    expect(summarizeTaskQueue({ state: "PAUSED" }, { name: "queue" })).toMatchObject({
      status: "unhealthy",
    });
  });

  test("readCloudDaemonStatus builds one snapshot from worker, queue, and cache contracts", async () => {
    const calls = [];
    const status = await readCloudDaemonStatus(
      { project: "p1", region: "us-central1", workerService: "worker", tasksQueue: "queue", bucket: "bucket" },
      {
        now: "2026-07-09T00:00:00.000Z",
        runJson: async (args) => {
          calls.push(args);
          if (args[0] === "run") return { status: { conditions: [{ type: "Ready", status: "True" }, { type: "RoutesReady", status: "True" }] } };
          return { state: "RUNNING" };
        },
      },
    );
    expect(calls).toEqual([
      ["run", "services", "describe", "worker", "--project", "p1", "--region", "us-central1"],
      ["tasks", "queues", "describe", "queue", "--project", "p1", "--location", "us-central1"],
    ]);
    expect(status.snapshot).toMatchObject({
      status: "healthy",
      checkedAt: "2026-07-09T00:00:00.000Z",
      workers: { total: 1, ready: 1 },
      queues: { total: 1, unhealthy: 0 },
    });
    expect(status.caches[0].uri).toBe("gs://bucket/cache/workspaces/");
  });
});
