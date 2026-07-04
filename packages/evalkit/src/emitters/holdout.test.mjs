// The holdout split is deterministic, disjoint, and id-stable under
// additions; and — the load-bearing guarantee carried over from the retired
// v2 module's tests — the v1 renderers' byte output is unchanged (snapshot
// strings captured from the pre-v2 code).
import { test, expect } from "bun:test";
import { renderEvalConfig, renderOptimizationConfig } from "./render-eval-artifacts.mjs";
import { renderHoldoutSplit } from "./holdout.mjs";

const CONTRACT = { evalEnrichment: { packHints: [{ packId: "pack one", successCriteria: ["a", "b"] }] } };

const EVAL_CASES = Array.from({ length: 20 }, (_, index) => ({ eval_id: `eval-case-${index + 1}` }));

test("holdout split is deterministic, disjoint, and covers every id", () => {
  const first = renderHoldoutSplit(EVAL_CASES);
  const second = renderHoldoutSplit(EVAL_CASES);
  expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  expect(first.seed).toBe(42);
  expect(first.validationFraction).toBe(0.3);
  const train = new Set(first.train);
  const validation = new Set(first.validation);
  for (const id of validation) expect(train.has(id)).toBe(false);
  expect(train.size + validation.size).toBe(EVAL_CASES.length);
  for (const evalCase of EVAL_CASES) {
    expect(train.has(evalCase.eval_id) || validation.has(evalCase.eval_id)).toBe(true);
  }
  expect(validation.size).toBeGreaterThan(0);
  expect(train.size).toBeGreaterThan(0);
});

test("holdout membership is per-id: adding cases never reshuffles existing ones", () => {
  const before = renderHoldoutSplit(EVAL_CASES);
  const after = renderHoldoutSplit([...EVAL_CASES, { eval_id: "eval-case-new" }, { eval_id: "another-one" }]);
  for (const id of before.validation) expect(after.validation).toContain(id);
  for (const id of before.train) expect(after.train).toContain(id);
  // Seed changes DO reshuffle (that is what the seed is for).
  const reseeded = renderHoldoutSplit(EVAL_CASES, { seed: 7 });
  expect(JSON.stringify(reseeded.validation)).not.toBe(JSON.stringify(before.validation));
  // Id strings and ADK-camelCase cases resolve the same way as eval_id.
  expect(renderHoldoutSplit(EVAL_CASES.map((c) => c.eval_id))).toEqual(before);
  expect(renderHoldoutSplit(EVAL_CASES.map((c) => ({ evalId: c.eval_id })))).toEqual(before);
});

test("holdout split never leaves a side empty once there are two cases", () => {
  // Small evalsets are the real risk: two ids land all-train with p≈0.49 and
  // all-validation with p≈0.09 under hash-only bucketing, so sweeping 60 pairs
  // exercises the repair in both directions.
  for (let i = 0; i < 60; i++) {
    const split = renderHoldoutSplit([`sweep-${i}-a`, `sweep-${i}-b`]);
    expect(split.train.length).toBe(1);
    expect(split.validation.length).toBe(1);
  }
  for (const size of [3, 4, 5]) {
    for (let i = 0; i < 20; i++) {
      const ids = Array.from({ length: size }, (_, j) => `sweep-${size}-${i}-${j}`);
      const split = renderHoldoutSplit(ids);
      expect(split.train.length).toBeGreaterThan(0);
      expect(split.validation.length).toBeGreaterThan(0);
      expect(split.train.length + split.validation.length).toBe(size);
    }
  }
  // Repair is deterministic too.
  const once = renderHoldoutSplit(["pair-a", "pair-b"]);
  expect(renderHoldoutSplit(["pair-a", "pair-b"])).toEqual(once);
  // A single case cannot be balanced; it stays wherever it hashes.
  const single = renderHoldoutSplit(["only-case"]);
  expect(single.train.length + single.validation.length).toBe(1);
});

// Byte snapshots of the v1 renderers, captured from the code as it stood
// before the modern family existed. If either fails, a new emitter leaked a
// change into the golden generated-workspace pipeline — fix the emitter, do
// not regenerate these strings.
const V1_EVAL_CONFIG_SNAPSHOT = "{\"criteria\":{\"tool_trajectory_avg_score\":{\"threshold\":1,\"match_type\":\"ANY_ORDER\"},\"rubric_based_tool_use_quality_v1\":{\"threshold\":0.75,\"rubrics\":[{\"rubric_id\":\"source_before_action\",\"rubric_content\":{\"text_property\":\"The agent queries or searches source-system evidence before making recommendations or invoking write-like action tools.\"}},{\"rubric_id\":\"canonical_tool_names\",\"rubric_content\":{\"text_property\":\"The agent uses the generated canonical tool names and does not invent unavailable tools.\"}},{\"rubric_id\":\"safe_write_inputs\",\"rubric_content\":{\"text_property\":\"The agent does not call action or notification tools with missing required business identifiers.\"}}]},\"rubric_based_final_response_quality_v1\":{\"threshold\":0.78,\"rubrics\":[{\"rubric_id\":\"grounded\",\"rubric_content\":{\"text_property\":\"The response is grounded in the source-system/tool results it retrieved and does not fabricate data.\"}},{\"rubric_id\":\"evidence\",\"rubric_content\":{\"text_property\":\"The response cites or references the source-system evidence it used.\"}},{\"rubric_id\":\"next_action\",\"rubric_content\":{\"text_property\":\"The response states a clear next action or outcome.\"}},{\"rubric_id\":\"pack_pack_one\",\"rubric_content\":{\"text_property\":\"For pack one, the agent satisfies these pack-specific checks: a; b\"}}]},\"hallucinations_v1\":{\"threshold\":0.8},\"safety_v1\":{\"threshold\":0.8}}}";

const V1_OPTIMIZATION_CONFIG_SNAPSHOT = "{\"eval_config\":{\"criteria\":{\"tool_trajectory_avg_score\":{\"threshold\":1,\"match_type\":\"ANY_ORDER\"},\"rubric_based_tool_use_quality_v1\":{\"threshold\":0.75,\"rubrics\":[{\"rubric_id\":\"source_before_action\",\"rubric_content\":{\"text_property\":\"The agent queries or searches source-system evidence before making recommendations or invoking write-like action tools.\"}},{\"rubric_id\":\"canonical_tool_names\",\"rubric_content\":{\"text_property\":\"The agent uses the generated canonical tool names and does not invent unavailable tools.\"}},{\"rubric_id\":\"safe_write_inputs\",\"rubric_content\":{\"text_property\":\"The agent does not call action or notification tools with missing required business identifiers.\"}}]},\"rubric_based_final_response_quality_v1\":{\"threshold\":0.78,\"rubrics\":[{\"rubric_id\":\"grounded\",\"rubric_content\":{\"text_property\":\"The response is grounded in the source-system/tool results it retrieved and does not fabricate data.\"}},{\"rubric_id\":\"evidence\",\"rubric_content\":{\"text_property\":\"The response cites or references the source-system evidence it used.\"}},{\"rubric_id\":\"next_action\",\"rubric_content\":{\"text_property\":\"The response states a clear next action or outcome.\"}}]},\"hallucinations_v1\":{\"threshold\":0.8},\"safety_v1\":{\"threshold\":0.8}}},\"train_dataset\":\"tests/eval/evalsets/ge_behavior_contract.evalset.json\",\"validation_dataset\":\"tests/eval/evalsets/ge_behavior_contract.evalset.json\",\"log_level\":\"WARNING\",\"print_detailed_results\":false,\"optimizer_config\":{}}";

test("v1 renderers are byte-unchanged (golden pipeline stays golden)", () => {
  expect(JSON.stringify(renderEvalConfig(CONTRACT))).toBe(V1_EVAL_CONFIG_SNAPSHOT);
  expect(JSON.stringify(renderOptimizationConfig(null))).toBe(V1_OPTIMIZATION_CONFIG_SNAPSHOT);
});
