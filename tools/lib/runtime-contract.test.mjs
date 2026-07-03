import { expect, test } from "bun:test";
import {
  normalizeArtifactRef,
  normalizeBlocker,
  normalizeResumePlan,
  normalizeRuntimeEvent,
  normalizeRuntimeTask,
} from "./runtime-contract.mjs";

test("normalizeBlocker converts strings to stable blocker objects", () => {
  expect(normalizeBlocker("missing Workday seed")).toEqual({
    id: "blocker",
    message: "missing Workday seed",
  });
});

test("normalizeArtifactRef fills defaults from path-only refs", () => {
  expect(normalizeArtifactRef({ path: "mock_data/simulators/index.json" })).toEqual({
    name: "mock_data/simulators/index.json",
    type: "file",
    path: "mock_data/simulators/index.json",
    status: "unknown",
    metadata: {},
  });
});

test("normalizeResumePlan provides no-op defaults when missing", () => {
  expect(normalizeResumePlan(null, { id: "task-1", status: "done" })).toMatchObject({
    state: "done",
    nextAction: "none",
    safeToRun: false,
    reason: "",
    commands: [],
    blockers: [],
    artifacts: [],
  });
});

test("normalizeRuntimeEvent tolerates sparse event shapes", () => {
  expect(normalizeRuntimeEvent({ message: "started" })).toMatchObject({
    type: "event",
    level: "info",
    line: "started",
    data: null,
  });
});

test("normalizeRuntimeTask handles historical output-only artifacts and string blockers", () => {
  const task = normalizeRuntimeTask({
    id: "task-old",
    kind: "ge.command",
    status: "failed",
    output: {
      blockers: ["command failed"],
      artifactRefs: [{ path: "artifacts/run.json" }],
    },
  });

  expect(task.blockers).toEqual([{ id: "blocker", message: "command failed" }]);
  expect(task.artifactRefs).toEqual([
    {
      name: "artifacts/run.json",
      type: "file",
      path: "artifacts/run.json",
      status: "unknown",
      metadata: {},
    },
  ]);
  expect(task.resumePlan).toMatchObject({
    state: "failed",
    nextAction: "none",
    safeToRun: false,
  });
  expect(task.presentation).toMatchObject({
    title: "ge.command task-old",
    statusTone: "danger",
    blockerSummary: "command failed",
  });
});

test("normalizeRuntimeTask preserves mixed task and pipeline graph artifacts", () => {
  const task = normalizeRuntimeTask({
    id: "pipeline-1",
    kind: "pipeline.run",
    status: "blocked",
    output: {
      artifactRefs: [{ name: "task_log", path: "logs/pipeline.json" }],
      graph: {
        nodes: [
          {
            id: "mock.generate",
            artifacts: [{ name: "data_plan", path: "mock_data/plan/data-plan.json" }],
          },
          {
            id: "simulator.seed",
            blockers: [{ id: "seed_missing", message: "missing seed" }],
            artifacts: [{ path: "mock_data/simulators/index.json" }],
          },
        ],
      },
    },
  });

  expect(task.artifactRefs.map((artifact) => artifact.name)).toEqual([
    "task_log",
    "data_plan",
    "mock_data/simulators/index.json",
  ]);
  expect(task.blockers).toEqual([{ id: "seed_missing", message: "missing seed", detail: null }]);
  expect(task.resumePlan?.blockers).toEqual([{ id: "seed_missing", message: "missing seed", detail: null }]);
});
