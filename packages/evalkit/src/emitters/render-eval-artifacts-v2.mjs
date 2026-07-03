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
//   tests/eval/evalsets/ge_behavior_contract.train.evalset.json       the split, materialized
//   tests/eval/evalsets/ge_behavior_contract.validation.evalset.json  (runnable ADK evalsets)
//   tests/eval/optimization_config_v2.json  optimizer config over the split
//   tests/eval/judge_panel.json             self-consistency judging config
//
// Rubrics are reused from v1 by calling its exported renderEvalConfig — the
// one source of truth — so panel rubrics can never drift from what v1 judges.
// All pure functions: no clock, no randomness (the split hashes ids).

import { renderEvalConfig } from "./render-eval-artifacts.mjs";
// The compiler's one 32-bit FNV-1a. This renderer used to carry a local copy
// (as an app-side module it could not import tools/lib — that surface is
// frozen); inside the package the perturbation engine's hash is importable,
// and it is the identical function, so the split bytes cannot change.
import { fnv1a } from "../perturbations.mjs";

function evalIdOf(evalCase) {
  if (typeof evalCase === "string") return evalCase;
  return evalCase?.eval_id ?? evalCase?.evalId ?? evalCase?.id ?? "";
}

/**
 * Deterministic holdout split by FNV-1a hash of each eval id: an id lands in
 * validation when hash(seed:id) mod 1000 < validationFraction * 1000. Because
 * membership depends only on (seed, id), adding or removing OTHER cases never
 * reshuffles existing ones — the split is stable under case additions, with
 * one bounded exception: with >= 2 cases, an all-one-side hash outcome (real
 * risk on small evalsets) is repaired by moving the id nearest the bucket
 * threshold across, so both partitions are always usable. The repair is
 * itself deterministic (bucket value, then id, as tiebreak).
 * Accepts eval-case objects (eval_id / evalId / id) or plain id strings.
 * Returns { seed, validationFraction, train: [...ids], validation: [...ids] }.
 */
export function renderHoldoutSplit(evalCases, { seed = 42, validationFraction = 0.3 } = {}) {
  const train = [];
  const validation = [];
  const bucketOf = new Map();
  for (const evalCase of evalCases || []) {
    const id = evalIdOf(evalCase);
    if (!id) continue;
    const bucket = fnv1a(`${seed}:${id}`) % 1000;
    bucketOf.set(id, bucket);
    (bucket < validationFraction * 1000 ? validation : train).push(id);
  }
  const nearestThreshold = (ids, direction) =>
    ids.reduce((best, id) => {
      if (best === null) return id;
      const delta = bucketOf.get(id) - bucketOf.get(best);
      if (delta !== 0) return direction * delta < 0 ? id : best;
      return id < best ? id : best;
    }, null);
  if (bucketOf.size >= 2 && validation.length === 0) {
    const moved = nearestThreshold(train, +1); // lowest bucket = most validation-like
    train.splice(train.indexOf(moved), 1);
    validation.push(moved);
  } else if (bucketOf.size >= 2 && train.length === 0) {
    const moved = nearestThreshold(validation, -1); // highest bucket = most train-like
    validation.splice(validation.indexOf(moved), 1);
    train.push(moved);
  }
  return { seed, validationFraction, train, validation };
}

/**
 * Materialize the split as two runnable ADK evalsets by filtering the full
 * evalset's eval_cases by the split's id lists. Case order and case objects
 * are preserved verbatim (ADK's EvalCase schema forbids extra fields, so no
 * annotations are added); only eval_set_id/name/description say which side
 * this is. Written by cmdGenerate next to the source evalset as
 * ge_behavior_contract.{train,validation}.evalset.json — the exact paths
 * renderOptimizationConfigV2 points the optimizer at.
 */
export function renderSplitEvalSets(evalSet, split) {
  const side = (name, ids) => {
    const members = new Set(ids || []);
    return {
      eval_set_id: `${evalSet.eval_set_id}_${name}`,
      name: `${evalSet.name} (${name})`,
      description: `${name === "train" ? "Training" : "Validation"} partition of ${evalSet.eval_set_id} per tests/eval/holdout_split.json.`,
      eval_cases: (evalSet.eval_cases || []).filter((evalCase) => members.has(evalIdOf(evalCase))),
    };
  };
  return { train: side("train", split?.train), validation: side("validation", split?.validation) };
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
