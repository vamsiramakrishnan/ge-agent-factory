// @ge/evalkit/emitters — the eval-artifact emitter family. One module per
// on-disk artifact shape; this barrel is the import surface consumers use.
//
// What each emits, and which byte-golden constraints pin it:
//
//   adk-evalset.mjs            BehavioralGraph + selected cases → ADK-camelCase
//                              evalset (evalSetId/evalCases/userContent), GE
//                              context riding in a geMetadata sidecar. Pinned by
//                              tools/lib/evals/evalset.mjs round-trip (unknown
//                              fields preserved verbatim) and by `ge evals
//                              compile`'s .ge/behavioral artifacts.
//
//   agents-cli-dataset.mjs     Same selection flattened to agents-cli grading
//                              records (prompt/turns/expected/metadata), file
//                              form wrapped as { cases }. Pinned by the same
//                              compile pass.
//
//   render-eval-artifacts.mjs  The generated-workspace legacy (v1) family:
//                              golden.json, ge_behavior_contract.evalset.json,
//                              eval_config, optimization_config. Byte output is
//                              golden for the factory's generate pipeline
//                              (parity-oracle/golden workspace tests) —
//                              renderAgentsCliEvalSet takes the factory's
//                              naming/derivation helpers as an injected
//                              parameter (see its header for the seam rationale).
//
//   agents-cli-eval-dataset.mjs  The modern (agents-cli >= 1.0) generated-
//                              workspace family, emitted by default alongside
//                              v1: the EvaluationDataset for `eval generate`
//                              (tests/eval/datasets/*.json) plus its holdout
//                              train/validation partitions, derived from the
//                              rendered v1 evalset so the two can never drift.
//
//   agents-cli-eval-config.mjs   tests/eval/eval_config.yaml for `eval grade`:
//                              built-in metrics mapped from the v1 criteria, a
//                              behavior-contract LLM-judge metric with native
//                              self-consistency sampling, and the ge_thresholds
//                              CI-gate extension.
//
//   holdout.mjs                Deterministic train/validation split by id
//                              (feeds the split datasets; written as
//                              tests/eval/holdout_split.json provenance).
//
// Retired (the GE_EVAL_V2 gate and render-eval-artifacts-v2.mjs): the split
// *evalsets*, optimization_config_v2.json (superseded by `eval optimize`
// consuming EvaluationDatasets directly), and judge_panel.json (superseded by
// judge_model_sampling_count in eval_config.yaml).
//
// Everything here is a pure function of its inputs: no clock (timestamps are
// passed in), no randomness (the holdout split hashes ids with FNV-1a).
export { emitAdkEvalset, writeAdkEvalset } from "./adk-evalset.mjs";
export { emitAgentsCliDataset, writeAgentsCliDataset } from "./agents-cli-dataset.mjs";
export { renderGoldenEvals, renderAgentsCliEvalSet, renderEvalConfig, renderOptimizationConfig } from "./render-eval-artifacts.mjs";
export { renderEvalDataset, renderSplitEvalDatasets } from "./agents-cli-eval-dataset.mjs";
export { renderEvalConfigYaml, BEHAVIOR_CONTRACT_JUDGE_METRIC, DEFAULT_JUDGE_MODEL } from "./agents-cli-eval-config.mjs";
export { renderHoldoutSplit } from "./holdout.mjs";
