// Uses bun:test (not node:test) deliberately: mixing node:test's describe/test
// with the bun:test symbols the root [test].preload pulls in used to make this
// file crash outright under bun instead of failing individual tests, which hid
// it from the name-based check-test-results.mjs comparison (bun#5090). Keeping
// it on bun:test keeps every test here visible to the gate. node:assert still
// works as the assertion library under bun:test.
import { describe, test } from "bun:test";
import assert from "node:assert/strict";
import {
  inferLevel,
  makeEvent,
  normalizeArtifactRef,
  normalizeBlocker,
  normalizeResumePlan,
  normalizeRuntimeEvent,
  normalizeRuntimeTask,
  splitLines,
} from "./index.mjs";

describe("@ge/runtime", () => {
  test("makeEvent fills schema fields", () => {
    const event = makeEvent({ runId: "r1", stage: "build", line: "hello" });
    assert.equal(event.type, "log");
    assert.equal(event.level, "info");
    assert.equal(event.runId, "r1");
    assert.ok(event.ts);
  });

  test("splitLines buffers partial lines and flushes on newline", () => {
    const splitter = splitLines();
    assert.deepEqual(splitter.push("one\ntw"), ["one"]);
    assert.deepEqual(splitter.push("o\n"), ["two"]);
    assert.deepEqual(splitter.flush(), []);
  });

  test("splitLines treats carriage-return progress as a line update", () => {
    const splitter = splitLines();
    assert.deepEqual(splitter.push("10%\r90%\n"), ["90%"]);
  });

  test("inferLevel classifies stderr and warning/error text", () => {
    assert.equal(inferLevel("stderr", "fatal failure"), "error");
    assert.equal(inferLevel("stdout", "warning sign"), "warn");
    assert.equal(inferLevel("stderr", "progress"), "warn");
  });

  test("normalizeBlocker converts strings to stable blocker objects", () => {
    assert.deepEqual(normalizeBlocker("missing env"), { id: "blocker", message: "missing env" });
  });

  test("normalizeArtifactRef fills defaults from path-only refs", () => {
    assert.deepEqual(normalizeArtifactRef("artifact.json"), {
      name: "artifact.json",
      type: "file",
      path: "artifact.json",
      status: "unknown",
      metadata: {},
    });
  });

  test("normalizeResumePlan provides no-op defaults when missing", () => {
    const plan = normalizeResumePlan(null, { status: "blocked", blockers: ["waiting"] });
    assert.equal(plan.state, "blocked");
    assert.equal(plan.safeToRun, false);
    assert.equal(plan.blockers[0].message, "waiting");
  });

  test("normalizeRuntimeEvent tolerates sparse event shapes", () => {
    assert.equal(normalizeRuntimeEvent("plain line").line, "plain line");
    assert.equal(normalizeRuntimeEvent({ message: "hi" }).line, "hi");
  });

  test("normalizeRuntimeTask handles historical output-only artifacts and string blockers", () => {
    const task = normalizeRuntimeTask({
      id: "t1",
      kind: "factory",
      status: "failed",
      output: { artifactRefs: ["out.json"], blockers: ["bad input"] },
    });
    assert.equal(task.artifactRefs[0].path, "out.json");
    assert.equal(task.blockers[0].message, "bad input");
    assert.equal(task.presentation.statusTone, "danger");
  });

  test("normalizeRuntimeTask preserves mixed task and mission graph artifacts", () => {
    const task = normalizeRuntimeTask({
      output: {
        graph: {
          nodes: [
            {
              status: "blocked",
              artifacts: [{ name: "graph", type: "json", path: "graph.json" }],
              resumePlan: { blockers: [{ id: "approval", message: "needs approval" }] },
            },
          ],
        },
      },
    });
    assert.equal(task.artifactRefs[0].name, "graph");
    assert.equal(task.blockers[0].id, "approval");
  });
});
