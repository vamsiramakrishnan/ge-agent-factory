// Judge-rigor v2 eval-artifact renderers — opt-in, never in the default path.
//
// v1 (render-eval-artifacts.mjs) has two known rigor gaps: the optimization
// config trains and validates on the SAME dataset (no holdout), and rubric
// judging is single-shot (one sample, no self-consistency). This module fixes
// both as pure renderers WITHOUT touching v1: v1's byte output is golden for
// the generated-workspace pipeline, so these only run behind GE_EVAL_V2=1
// (see cmdGenerate in factory.mjs), which writes three extra artifacts:
//
//   tests/eval/holdout_split.json           deterministic train/validation ids
//   tests/eval/optimization_config_v2.json  optimizer config over the split
//   tests/eval/judge_panel.json             self-consistency judging config
//
// Rubrics are reused from v1 by calling its exported renderEvalConfig — the
// one source of truth — so panel rubrics can never drift from what v1 judges.
// All pure functions: no clock, no randomness (the split hashes ids).

import { renderEvalConfig } from "./render-eval-artifacts.mjs";

// 32-bit FNV-1a, local on purpose: this app-side renderer must not grow a new
// import into tools/lib (the apps→tools import surface is frozen).
function fnv1a(text) {
  let hash = 0x811c9dc5;
  const value = String(text);
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function evalIdOf(evalCase) {
  if (typeof evalCase === "string") return evalCase;
  return evalCase?.eval_id ?? evalCase?.evalId ?? evalCase?.id ?? "";
}

/**
 * Deterministic holdout split by FNV-1a hash of each eval id: an id lands in
 * validation when hash(seed:id) mod 1000 < validationFraction * 1000. Because
 * membership depends only on (seed, id), adding or removing OTHER cases never
 * reshuffles existing ones — the split is stable under case additions.
 * Accepts eval-case objects (eval_id / evalId / id) or plain id strings.
 * Returns { seed, validationFraction, train: [...ids], validation: [...ids] }.
 */
export function renderHoldoutSplit(evalCases, { seed = 42, validationFraction = 0.3 } = {}) {
  const train = [];
  const validation = [];
  for (const evalCase of evalCases || []) {
    const id = evalIdOf(evalCase);
    if (!id) continue;
    const bucket = fnv1a(`${seed}:${id}`) % 1000;
    (bucket < validationFraction * 1000 ? validation : train).push(id);
  }
  return { seed, validationFraction, train, validation };
}

/**
 * Like v1's renderOptimizationConfig, but train and validation point at the
 * holdout split instead of one shared file. Expected on-disk layout (the
 * caller materializes the two evalset files by filtering
 * tests/eval/evalsets/ge_behavior_contract.evalset.json's eval_cases by the
 * split's id lists):
 *
 *   tests/eval/holdout_split.json                                  the split (written alongside)
 *   tests/eval/evalsets/ge_behavior_contract.train.evalset.json    cases whose ids ∈ split.train
 *   tests/eval/evalsets/ge_behavior_contract.validation.evalset.json  cases whose ids ∈ split.validation
 */
export function renderOptimizationConfigV2(contract, split) {
  return {
    eval_config: renderEvalConfig(contract),
    train_dataset: "tests/eval/evalsets/ge_behavior_contract.train.evalset.json",
    validation_dataset: "tests/eval/evalsets/ge_behavior_contract.validation.evalset.json",
    holdout_split: {
      path: "tests/eval/holdout_split.json",
      seed: split?.seed ?? 42,
      validation_fraction: split?.validationFraction ?? 0.3,
      train_cases: split?.train?.length ?? 0,
      validation_cases: split?.validation?.length ?? 0,
    },
    log_level: "WARNING",
    print_detailed_results: false,
    optimizer_config: {},
  };
}

/**
 * Self-consistency judging panel: sample each rubric judge 5 times, aggregate
 * by median, and flag any rubric whose samples disagree beyond the threshold
 * (fraction of samples on the minority side of the median) for human review.
 * Rubric sets are v1's, verbatim, via renderEvalConfig — same ids, same text.
 */
export function renderJudgePanelConfig(contract = null) {
  const criteria = renderEvalConfig(contract).criteria;
  return {
    samples: 5,
    aggregation: "median",
    disagreement_flag_threshold: 0.4,
    rubrics: {
      rubric_based_tool_use_quality_v1: criteria.rubric_based_tool_use_quality_v1.rubrics,
      rubric_based_final_response_quality_v1: criteria.rubric_based_final_response_quality_v1.rubrics,
    },
    thresholds: {
      rubric_based_tool_use_quality_v1: criteria.rubric_based_tool_use_quality_v1.threshold,
      rubric_based_final_response_quality_v1: criteria.rubric_based_final_response_quality_v1.threshold,
    },
  };
}
