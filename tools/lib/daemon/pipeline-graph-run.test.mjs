// tools/lib/daemon/pipeline-graph-run.test.mjs — unit coverage for the PURE
// helpers of the pipeline.run run-kind: childStatusToNodeStatus (child →
// node-status mapping) and the replaceAll-based id rehoming
// (rehomeResumePlan / rehomePipelineGraph). The scheduling/async surface
// (startPipelineTask, attachPipelineResumeChild) is out of scope — it needs
// live child tasks — so we only pin the deterministic string/enum helpers.
//
// GE_STATE_ROOT is set before import purely because the module transitively
// pulls in state-paths.mjs; these helpers touch no filesystem.
import { test, expect } from "bun:test";
import { join } from "node:path";

process.env.GE_STATE_ROOT ||= join("/tmp", `ge-pipeline-graph-run-test-${process.pid}`);

const { childStatusToNodeStatus, rehomeResumePlan, rehomePipelineGraph } = await import("./pipeline-graph-run.mjs");

test("childStatusToNodeStatus maps child terminal states to node states", () => {
  const cases = [
    ["done", "done"],
    ["skipped", "skipped"],
    ["blocked", "blocked"],
    ["failed", "blocked"],
    ["running", "running"], // passthrough via status || "blocked"
    ["queued", "queued"], // passthrough
    ["", "blocked"], // empty → default
    [null, "blocked"],
    [undefined, "blocked"],
  ];
  for (const [input, expected] of cases) {
    expect(childStatusToNodeStatus(input)).toBe(expected);
  }
});

test("rehomeResumePlan: no-op guards", () => {
  expect(rehomeResumePlan(null, "a", "b")).toBe(null);
  // missing target id → plan returned untouched (same reference).
  const plan = { commands: ["ge run a"] };
  expect(rehomeResumePlan(plan, "a", null)).toBe(plan);
});

test("rehomeResumePlan: substitutes fromPipelineId → toPipelineId in each command", () => {
  const out = rehomeResumePlan({ commands: ["ge run pipe-1", "ge check pipe-1 --json"], extra: "keep" }, "pipe-1", "pipe-2");
  expect(out.commands).toEqual(["ge run pipe-2", "ge check pipe-2 --json"]);
  expect(out.extra).toBe("keep"); // non-command fields spread through
});

test("rehomeResumePlan: empty fromPipelineId → commands stringified but not substituted", () => {
  const out = rehomeResumePlan({ commands: ["ge run pipe-1", 42] }, "", "pipe-9");
  expect(out.commands).toEqual(["ge run pipe-1", "42"]);
});

test("rehomeResumePlan: non-array commands normalise to []", () => {
  expect(rehomeResumePlan({ commands: "nope" }, "a", "b").commands).toEqual([]);
  expect(rehomeResumePlan({}, "a", "b").commands).toEqual([]);
});

test("rehomeResumePlan: replaceAll substring-overlap hazard (documents current behavior)", () => {
  // "pipe-1" is a prefix of "pipe-10", so replaceAll rewrites BOTH occurrences —
  // "pipe-10" becomes "NEW0". This pins the substring-overlap edge case.
  const out = rehomeResumePlan({ commands: ["ge run pipe-1 pipe-10"] }, "pipe-1", "NEW");
  expect(out.commands).toEqual(["ge run NEW NEW0"]);
});

test("rehomePipelineGraph: no-op guards", () => {
  expect(rehomePipelineGraph(null, "p", "f")).toBe(null);
  const graph = { id: "g", nodes: [] };
  expect(rehomePipelineGraph(graph, null, "f")).toBe(graph);
});

test("rehomePipelineGraph: rewrites id, node.pipelineId, and nested resumePlans", () => {
  const graph = {
    id: "old-pl",
    nodes: [
      { id: "n1", resumePlan: { commands: ["ge run old-pl"] }, childTask: { resumePlan: { commands: ["ge check old-pl"] } } },
      { id: "n2", childTask: { foo: 1 } }, // no resumePlan on node or childTask
    ],
    edges: [{ from: "n1", to: "n2" }],
  };
  const out = rehomePipelineGraph(graph, "new-pl", null);

  expect(out.id).toBe("new-pl");
  expect(out.edges).toEqual([{ from: "n1", to: "n2" }]);

  const [n1, n2] = out.nodes;
  expect(n1.pipelineId).toBe("new-pl");
  // fromPipelineId defaults to graph.id ("old-pl") when not passed.
  expect(n1.resumePlan.commands).toEqual(["ge run new-pl"]);
  expect(n1.childTask.resumePlan.commands).toEqual(["ge check new-pl"]);

  expect(n2.pipelineId).toBe("new-pl");
  // childTask without a resumePlan is preserved as-is.
  expect(n2.childTask).toEqual({ foo: 1 });
});

test("rehomePipelineGraph: uses explicit fromPipelineId over graph.id when provided", () => {
  const graph = { id: "graph-id", nodes: [{ id: "n1", resumePlan: { commands: ["run other-src"] } }] };
  const out = rehomePipelineGraph(graph, "dest", "other-src");
  expect(out.nodes[0].resumePlan.commands).toEqual(["run dest"]);
});

test("rehomePipelineGraph: missing nodes/edges normalise to []", () => {
  const out = rehomePipelineGraph({ id: "x" }, "y", null);
  expect(out.nodes).toEqual([]);
  expect(out.edges).toEqual([]);
});
