import { describe, expect, test } from "bun:test";
import {
  buildStageFanout,
  cacheKey,
  cacheRecord,
  cloudDaemonSnapshot,
  cloudTaskId,
  contentHash,
  deterministicStageTaskId,
  FACTORY_STAGE_IDS,
  stableJson,
  summarizeFanIn,
} from "./control-plane.mjs";

describe("control-plane primitives", () => {
  test("factory stage ids are the complete transport-independent pipeline", () => {
    expect(FACTORY_STAGE_IDS).toEqual([
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
  });

  test("stableJson and contentHash are order-stable", () => {
    expect(stableJson({ b: 2, a: 1 })).toBe('{"a":1,"b":2}');
    expect(contentHash({ b: 2, a: 1 }, { length: 16 })).toBe(contentHash({ a: 1, b: 2 }, { length: 16 }));
    expect(cacheKey("workspace", { a: 1 }, { version: "v1" })).not.toBe(cacheKey("workspace", { a: 1 }, { version: "v2" }));
  });

  test("cacheRecord uses an explicit cache contract", () => {
    expect(cacheRecord({ kind: "workspace", key: "abc", uri: "gs://bucket/cache/abc", hit: true, now: "2026-07-09T00:00:00.000Z" })).toEqual({
      kind: "workspace",
      key: "abc",
      uri: "gs://bucket/cache/abc",
      hit: true,
      enabled: true,
      material: null,
      checkedAt: "2026-07-09T00:00:00.000Z",
    });
  });

  test("Cloud Task ids are deterministic, safe, bounded, and collision-resistant", () => {
    const raw = `Run/A ${"x".repeat(800)} validate 1`;
    const id = cloudTaskId(raw);
    expect(id).toMatch(/^[a-z0-9-]+-[a-f0-9]{10}$/);
    expect(id.length).toBeLessThanOrEqual(431);
    expect(cloudTaskId(raw)).toBe(id);
    expect(cloudTaskId(`${raw}!`)).not.toBe(id);
    expect(deterministicStageTaskId({ runId: "run-1", itemId: "item-a", stage: "validate", attempt: 2 }))
      .toBe(cloudTaskId("run-1-item-a-validate-2"));
  });

  test("stage fanout builds one deterministic task per work item", () => {
    const fanout = buildStageFanout({
      runId: "run-1",
      stage: "validate",
      attempt: 1,
      targetStage: "preview",
      workItems: ["a", { id: "b", workspaceId: "workspace-b", payload: { artifactPrefix: "gs://bucket/b" } }],
    });
    expect(fanout).toMatchObject({ kind: "stage_fanout", total: 2, runId: "run-1", stage: "validate" });
    expect(fanout.tasks.map((task) => task.key)).toEqual(["run-1:a:validate:1", "run-1:b:validate:1"]);
    expect(fanout.tasks[0].payload).toMatchObject({ runId: "run-1", itemId: "a", workspaceId: "a", stage: "validate", targetStage: "preview" });
    expect(fanout.tasks[1].payload).toMatchObject({ artifactPrefix: "gs://bucket/b", itemId: "b", workspaceId: "workspace-b" });
    expect(new Set(fanout.tasks.map((task) => task.taskId)).size).toBe(2);
  });

  test("fan-in summary gives terminal and retry decisions from normalized item states", () => {
    expect(summarizeFanIn({ items: [{ status: "done" }, { status: "success" }] })).toMatchObject({
      total: 2,
      done: 2,
      status: "done",
      terminal: true,
      ok: true,
    });
    expect(summarizeFanIn({ items: [{ status: "running" }, { status: "queued" }] })).toMatchObject({
      running: 1,
      pending: 1,
      status: "running",
      terminal: false,
      ok: null,
    });
    expect(summarizeFanIn({ items: [{ status: "done" }, { status: "failed" }] })).toMatchObject({
      failed: 1,
      status: "failed",
      terminal: true,
      ok: false,
    });
  });

  test("cloud daemon snapshot is a lightweight capacity/readiness contract", () => {
    expect(cloudDaemonSnapshot({
      workers: [{ status: "serving" }, { status: "ready" }],
      queues: [{ status: "healthy" }],
      caches: [{ enabled: true, hit: true }],
      now: "2026-07-09T00:00:00.000Z",
    })).toMatchObject({
      kind: "cloud_daemon_snapshot",
      status: "healthy",
      workers: { total: 2, ready: 2, unhealthy: 0 },
      queues: { total: 1, unhealthy: 0 },
      caches: { total: 1, misses: 0 },
      checkedAt: "2026-07-09T00:00:00.000Z",
    });
    expect(cloudDaemonSnapshot({
      workers: [{ status: "serving" }],
      queues: [{ status: "backlog_unhealthy" }],
      caches: [{ enabled: true, hit: false }],
    })).toMatchObject({
      status: "degraded",
      workers: { ready: 1 },
      queues: { unhealthy: 1 },
      caches: { misses: 1 },
    });
  });
});
