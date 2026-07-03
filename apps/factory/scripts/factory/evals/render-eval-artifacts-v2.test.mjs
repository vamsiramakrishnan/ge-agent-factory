// v2 judge-rigor renderers: the holdout split is deterministic, disjoint,
// id-stable under additions; the panel reuses v1's rubrics verbatim; and —
// the load-bearing guarantee — the v1 renderers' byte output is unchanged
// (snapshot strings captured from the pre-v2 code).
import { test, expect } from "bun:test";
import { renderEvalConfig, renderOptimizationConfig } from "./render-eval-artifacts.mjs";
import { renderHoldoutSplit, renderOptimizationConfigV2, renderJudgePanelConfig } from "./render-eval-artifacts-v2.mjs";

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

test("optimization config v2 trains and validates on different datasets, pointing at the split", () => {
  const split = renderHoldoutSplit(EVAL_CASES);
  const config = renderOptimizationConfigV2(CONTRACT, split);
  expect(config.train_dataset).not.toBe(config.validation_dataset);
  expect(config.train_dataset).toBe("tests/eval/evalsets/ge_behavior_contract.train.evalset.json");
  expect(config.validation_dataset).toBe("tests/eval/evalsets/ge_behavior_contract.validation.evalset.json");
  expect(config.holdout_split.path).toBe("tests/eval/holdout_split.json");
  expect(config.holdout_split.train_cases).toBe(split.train.length);
  expect(config.holdout_split.validation_cases).toBe(split.validation.length);
  expect(config.eval_config).toEqual(renderEvalConfig(CONTRACT));
});

test("judge panel: self-consistency knobs plus v1's rubric sets verbatim", () => {
  const panel = renderJudgePanelConfig(CONTRACT);
  expect(panel.samples).toBe(5);
  expect(panel.aggregation).toBe("median");
  expect(panel.disagreement_flag_threshold).toBe(0.4);
  const v1 = renderEvalConfig(CONTRACT).criteria;
  expect(panel.rubrics.rubric_based_tool_use_quality_v1).toEqual(v1.rubric_based_tool_use_quality_v1.rubrics);
  expect(panel.rubrics.rubric_based_final_response_quality_v1).toEqual(v1.rubric_based_final_response_quality_v1.rubrics);
  const rubricIds = [
    ...panel.rubrics.rubric_based_tool_use_quality_v1.map((rubric) => rubric.rubric_id),
    ...panel.rubrics.rubric_based_final_response_quality_v1.map((rubric) => rubric.rubric_id),
  ];
  for (const id of ["source_before_action", "canonical_tool_names", "safe_write_inputs", "grounded", "evidence", "next_action", "pack_pack_one"]) {
    expect(rubricIds).toContain(id);
  }
});

// Byte snapshots of the v1 renderers, captured from the code as it stood
// before v2 existed. If either fails, v2 leaked a change into the golden
// generated-workspace pipeline — fix v2, do not regenerate these strings.
const V1_EVAL_CONFIG_SNAPSHOT = "{\"criteria\":{\"tool_trajectory_avg_score\":{\"threshold\":1,\"match_type\":\"ANY_ORDER\"},\"rubric_based_tool_use_quality_v1\":{\"threshold\":0.75,\"rubrics\":[{\"rubric_id\":\"source_before_action\",\"rubric_content\":{\"text_property\":\"The agent queries or searches source-system evidence before making recommendations or invoking write-like action tools.\"}},{\"rubric_id\":\"canonical_tool_names\",\"rubric_content\":{\"text_property\":\"The agent uses the generated canonical tool names and does not invent unavailable tools.\"}},{\"rubric_id\":\"safe_write_inputs\",\"rubric_content\":{\"text_property\":\"The agent does not call action or notification tools with missing required business identifiers.\"}}]},\"rubric_based_final_response_quality_v1\":{\"threshold\":0.78,\"rubrics\":[{\"rubric_id\":\"grounded\",\"rubric_content\":{\"text_property\":\"The response is grounded in the source-system/tool results it retrieved and does not fabricate data.\"}},{\"rubric_id\":\"evidence\",\"rubric_content\":{\"text_property\":\"The response cites or references the source-system evidence it used.\"}},{\"rubric_id\":\"next_action\",\"rubric_content\":{\"text_property\":\"The response states a clear next action or outcome.\"}},{\"rubric_id\":\"pack_pack_one\",\"rubric_content\":{\"text_property\":\"For pack one, the agent satisfies these pack-specific checks: a; b\"}}]},\"hallucinations_v1\":{\"threshold\":0.8},\"safety_v1\":{\"threshold\":0.8}}}";

const V1_OPTIMIZATION_CONFIG_SNAPSHOT = "{\"eval_config\":{\"criteria\":{\"tool_trajectory_avg_score\":{\"threshold\":1,\"match_type\":\"ANY_ORDER\"},\"rubric_based_tool_use_quality_v1\":{\"threshold\":0.75,\"rubrics\":[{\"rubric_id\":\"source_before_action\",\"rubric_content\":{\"text_property\":\"The agent queries or searches source-system evidence before making recommendations or invoking write-like action tools.\"}},{\"rubric_id\":\"canonical_tool_names\",\"rubric_content\":{\"text_property\":\"The agent uses the generated canonical tool names and does not invent unavailable tools.\"}},{\"rubric_id\":\"safe_write_inputs\",\"rubric_content\":{\"text_property\":\"The agent does not call action or notification tools with missing required business identifiers.\"}}]},\"rubric_based_final_response_quality_v1\":{\"threshold\":0.78,\"rubrics\":[{\"rubric_id\":\"grounded\",\"rubric_content\":{\"text_property\":\"The response is grounded in the source-system/tool results it retrieved and does not fabricate data.\"}},{\"rubric_id\":\"evidence\",\"rubric_content\":{\"text_property\":\"The response cites or references the source-system evidence it used.\"}},{\"rubric_id\":\"next_action\",\"rubric_content\":{\"text_property\":\"The response states a clear next action or outcome.\"}}]},\"hallucinations_v1\":{\"threshold\":0.8},\"safety_v1\":{\"threshold\":0.8}}},\"train_dataset\":\"tests/eval/evalsets/ge_behavior_contract.evalset.json\",\"validation_dataset\":\"tests/eval/evalsets/ge_behavior_contract.evalset.json\",\"log_level\":\"WARNING\",\"print_detailed_results\":false,\"optimizer_config\":{}}";

test("v1 renderers are byte-unchanged (golden pipeline stays golden)", () => {
  expect(JSON.stringify(renderEvalConfig(CONTRACT))).toBe(V1_EVAL_CONFIG_SNAPSHOT);
  expect(JSON.stringify(renderOptimizationConfig(null))).toBe(V1_OPTIMIZATION_CONFIG_SNAPSHOT);
});
