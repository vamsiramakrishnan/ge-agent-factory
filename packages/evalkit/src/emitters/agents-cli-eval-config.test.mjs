// eval_config.yaml: valid YAML in agents-cli's config schema (metrics_to_run
// + custom_metrics), the behavior-contract judge carries v1's rubric prose
// verbatim with the native 5-sample self-consistency knob (retiring
// judge_panel.json), ge_thresholds carries the hard CI-gate thresholds, and
// ge_diagnostic_metrics keeps noisy built-in telemetry out of pass/fail.
import { test, expect } from "bun:test";
import { parse as parseYaml } from "yaml";
import { renderEvalConfig } from "./render-eval-artifacts.mjs";
import { BEHAVIOR_CONTRACT_JUDGE_METRIC, BYPASS_GOVERNANCE_RUBRICS, renderEvalConfigYaml } from "./agents-cli-eval-config.mjs";

const CONTRACT = { evalEnrichment: { packHints: [{ packId: "pack one", successCriteria: ["a", "b"] }] } };

test("renders parseable YAML with the agents-cli config schema keys", () => {
  const config = parseYaml(renderEvalConfigYaml(CONTRACT));
  expect(config.metrics_to_run).toEqual([
    "tool_use_quality",
    "final_response_quality",
    "hallucination",
    "safety",
    BEHAVIOR_CONTRACT_JUDGE_METRIC,
  ]);
  expect(config.custom_metrics.length).toBe(1);
  const judge = config.custom_metrics[0];
  expect(judge.name).toBe(BEHAVIOR_CONTRACT_JUDGE_METRIC);
  expect(judge.judge_model).toBe("gemini-3.5-flash");
  expect(judge.judge_model_sampling_count).toBe(5); // native self-consistency — replaces judge_panel.json
  expect(judge.custom_function).toBeUndefined(); // no custom_function → agents-cli validates it as an LLMMetric
});

test("judge prompt carries both v1 rubric sets verbatim, plus the trace placeholders and strict JSON guidance", () => {
  const config = parseYaml(renderEvalConfigYaml(CONTRACT));
  const prompt = config.custom_metrics[0].prompt_template;
  for (const placeholder of ["{prompt}", "{response}", "{agent_data}"]) {
    expect(prompt).toContain(placeholder);
  }
  const criteria = renderEvalConfig(CONTRACT).criteria;
  const rubrics = [
    ...criteria.rubric_based_tool_use_quality_v1.rubrics,
    ...criteria.rubric_based_final_response_quality_v1.rubrics,
  ];
  expect(rubrics.map((rubric) => rubric.rubric_id)).toContain("pack_pack_one"); // pack hints reach the judge
  for (const rubric of rubrics) {
    expect(prompt).toContain(`- ${rubric.rubric_id}: ${rubric.rubric_content.text_property}`);
  }
  for (const rubric of [...BYPASS_GOVERNANCE_RUBRICS.toolUse, ...BYPASS_GOVERNANCE_RUBRICS.finalResponse]) {
    expect(prompt).toContain(`- ${rubric.rubric_id}: ${rubric.rubric_content.text_property}`);
  }
  expect(prompt).toContain("Do not include backslashes");
  expect(prompt).toContain("semicolon-delimited verdicts");
});

test("judge sample override is clamped to the agents-cli LLMMetric range", () => {
  expect(parseYaml(renderEvalConfigYaml(CONTRACT, { judgeSamples: 1 })).custom_metrics[0].judge_model_sampling_count).toBe(1);
  expect(parseYaml(renderEvalConfigYaml(CONTRACT, { judgeSamples: 99 })).custom_metrics[0].judge_model_sampling_count).toBe(32);
  expect(parseYaml(renderEvalConfigYaml(CONTRACT, { judgeSamples: 0 })).custom_metrics[0].judge_model_sampling_count).toBe(1);
  expect(parseYaml(renderEvalConfigYaml(CONTRACT, { judgeSamples: "bad" })).custom_metrics[0].judge_model_sampling_count).toBe(5);
});

test("ge_thresholds hard-gates stable metrics and leaves built-in tool-use as diagnostic telemetry", () => {
  const config = parseYaml(renderEvalConfigYaml(CONTRACT));
  expect(config.ge_thresholds).toEqual({
    final_response_quality: 0.78,
    hallucination: 0.8,
    safety: 0.8,
    [BEHAVIOR_CONTRACT_JUDGE_METRIC]: 0.75,
  });
  expect(config.ge_diagnostic_metrics.tool_use_quality).toMatchObject({
    threshold: 0.75,
  });
  expect(config.ge_diagnostic_metrics.tool_use_quality.reason).toContain("intentional no-tool governance refusals");
});

test("deterministic bytes; multiTurn adds the multi-turn tool-use metric", () => {
  expect(renderEvalConfigYaml(CONTRACT)).toBe(renderEvalConfigYaml(CONTRACT));
  const multiTurn = parseYaml(renderEvalConfigYaml(CONTRACT, { multiTurn: true }));
  expect(multiTurn.metrics_to_run).toContain("multi_turn_tool_use_quality");
  expect(multiTurn.ge_thresholds.multi_turn_tool_use_quality).toBeUndefined();
  expect(multiTurn.ge_diagnostic_metrics.multi_turn_tool_use_quality.threshold).toBe(0.75);
  const singleTurn = parseYaml(renderEvalConfigYaml(CONTRACT));
  expect(singleTurn.metrics_to_run).not.toContain("multi_turn_tool_use_quality");
});
