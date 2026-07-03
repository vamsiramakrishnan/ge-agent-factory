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
//   render-eval-artifacts.mjs  The generated-workspace v1 family: golden.json,
//                              ge_behavior_contract.evalset.json, eval_config,
//                              optimization_config. Byte output is golden for
//                              the factory's generate pipeline (parity-oracle/
//                              golden workspace tests) — renderAgentsCliEvalSet
//                              takes the factory's naming/derivation helpers as
//                              an injected parameter (see its header for the
//                              seam rationale).
//
//   render-eval-artifacts-v2.mjs  Opt-in judge-rigor artifacts (holdout split,
//                              split evalsets, optimizer config v2, judge
//                              panel), env-gated behind GE_EVAL_V2=1 so the
//                              default workspace stays byte-identical to v1.
//                              Rubrics come from v1's renderEvalConfig — one
//                              source of truth, no drift.
//
// Everything here is a pure function of its inputs: no clock (timestamps are
// passed in), no randomness (the holdout split hashes ids with FNV-1a).
export { emitAdkEvalset, writeAdkEvalset } from "./adk-evalset.mjs";
export { emitAgentsCliDataset, writeAgentsCliDataset } from "./agents-cli-dataset.mjs";
export { renderGoldenEvals, renderAgentsCliEvalSet, renderEvalConfig, renderOptimizationConfig } from "./render-eval-artifacts.mjs";
export { renderHoldoutSplit, renderSplitEvalSets, renderOptimizationConfigV2, renderJudgePanelConfig } from "./render-eval-artifacts-v2.mjs";
