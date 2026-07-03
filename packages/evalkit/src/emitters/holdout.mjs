// Deterministic train/validation holdout split over eval-case ids.
//
// Lived in render-eval-artifacts-v2.mjs while the split was an opt-in
// (GE_EVAL_V2=1) rigor artifact; the v2 gate is retired and the split now
// feeds the DEFAULT modern eval artifacts — the agents-cli EvaluationDataset
// train/validation files rendered by agents-cli-eval-dataset.mjs (which
// replaced the v2 split *evalsets*, optimizer-config-v2, and judge-panel
// artifacts). The split JSON itself is still written to
// tests/eval/holdout_split.json as provenance for the dataset partition.
//
// Pure function: no clock, no randomness — membership hashes ids with the
// compiler's FNV-1a.

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
