// The modern EvaluationDataset renderer applies agents-cli's documented
// evalset→dataset migration transform exactly: eval_id → eval_case_id,
// user_content hoisted to a role-tagged prompt, session_input and
// intermediate_data dropped, no envelope metadata. Split datasets partition
// the full dataset by the holdout split's id lists.
import { test, expect } from "bun:test";
import { renderEvalDataset, renderSplitEvalDatasets } from "./agents-cli-eval-dataset.mjs";
import { renderHoldoutSplit } from "./holdout.mjs";

const EVAL_SET = {
  eval_set_id: "ge_behavior_contract",
  name: "GE Behavior Contract",
  description: "full set",
  eval_cases: Array.from({ length: 20 }, (_, index) => ({
    eval_id: `eval-case-${index + 1}`,
    conversation: [
      {
        invocation_id: `eval-case-${index + 1}_turn_1`,
        user_content: { parts: [{ text: `prompt ${index + 1}` }] },
        intermediate_data: { tool_uses: [{ name: "list_systems", args: {} }] },
      },
    ],
    session_input: { app_name: "app", user_id: "ge_eval_user", state: {} },
  })),
};

test("dataset applies the documented migration transform per case", () => {
  const dataset = renderEvalDataset(EVAL_SET);
  // Envelope: eval_cases only — no eval_set_id/name/description.
  expect(Object.keys(dataset)).toEqual(["eval_cases"]);
  expect(dataset.eval_cases.length).toBe(EVAL_SET.eval_cases.length);
  dataset.eval_cases.forEach((evalCase, index) => {
    expect(Object.keys(evalCase)).toEqual(["eval_case_id", "prompt"]);
    expect(evalCase.eval_case_id).toBe(`eval-case-${index + 1}`);
    expect(evalCase.prompt).toEqual({ role: "user", parts: [{ text: `prompt ${index + 1}` }] });
  });
});

test("dataset is deterministic and null when there is nothing to migrate", () => {
  expect(JSON.stringify(renderEvalDataset(EVAL_SET))).toBe(JSON.stringify(renderEvalDataset(EVAL_SET)));
  expect(renderEvalDataset(null)).toBeNull();
  expect(renderEvalDataset({ eval_cases: [] })).toBeNull();
});

test("multi-invocation cases throw instead of silently dropping turns", () => {
  const multiTurn = {
    eval_cases: [
      {
        eval_id: "two-turns",
        conversation: [
          { user_content: { parts: [{ text: "first" }] } },
          { user_content: { parts: [{ text: "second" }] } },
        ],
      },
    ],
  };
  expect(() => renderEvalDataset(multiTurn)).toThrow(/two-turns.*2 invocations/);
});

test("split datasets partition the full dataset by the holdout split, cases verbatim", () => {
  const dataset = renderEvalDataset(EVAL_SET);
  const split = renderHoldoutSplit(EVAL_SET.eval_cases);
  const sets = renderSplitEvalDatasets(dataset, split);
  expect(sets.train.eval_cases.map((c) => c.eval_case_id)).toEqual(split.train);
  expect(sets.validation.eval_cases.map((c) => c.eval_case_id)).toEqual(split.validation);
  expect(sets.train.eval_cases.length + sets.validation.eval_cases.length).toBe(dataset.eval_cases.length);
  const original = new Map(dataset.eval_cases.map((c) => [c.eval_case_id, c]));
  for (const evalCase of [...sets.train.eval_cases, ...sets.validation.eval_cases]) {
    expect(evalCase).toEqual(original.get(evalCase.eval_case_id));
  }
});
