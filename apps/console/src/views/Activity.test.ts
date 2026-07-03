import { test, expect } from "bun:test";
import { rowKey, findExpandedRow } from "./Activity";

// BUG 1 regression: a pipeline run and a build can share an id. Expand/stream identity
// must be the composite `${kind}:${id}`, never the bare id — otherwise both rows
// render expanded and the live tail subscribes to the first match's stream.

test("rowKey is the composite kind:id, not the bare id", () => {
  expect(rowKey({ kind: "pipeline", id: "abc" })).toBe("pipeline:abc");
  expect(rowKey({ kind: "build", id: "abc" })).toBe("build:abc");
});

test("findExpandedRow matches exactly one row when a pipeline run and build share an id", () => {
  const rows = [
    { kind: "pipeline" as const, id: "dup" },
    { kind: "build" as const, id: "dup" },
  ];

  const expandedPipeline = findExpandedRow(rows, "pipeline:dup");
  expect(expandedPipeline).not.toBeNull();
  expect(expandedPipeline?.kind).toBe("pipeline");

  const expandedBuild = findExpandedRow(rows, "build:dup");
  expect(expandedBuild?.kind).toBe("build");

  // Exactly one row matches the composite key (the old bare-id find returned the
  // first match and the predicate matched both).
  const matches = rows.filter((r) => rowKey(r) === "build:dup");
  expect(matches).toHaveLength(1);
  expect(matches[0].kind).toBe("build");
});

test("findExpandedRow returns null when nothing is expanded", () => {
  const rows = [{ kind: "job" as const, id: "x" }];
  expect(findExpandedRow(rows, null)).toBeNull();
  expect(findExpandedRow(rows, "pipeline:x")).toBeNull();
});
