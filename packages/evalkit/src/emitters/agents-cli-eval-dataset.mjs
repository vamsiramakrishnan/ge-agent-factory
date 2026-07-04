// ADK evalset → agents-cli EvaluationDataset (the modern eval-case format).
//
// agents-cli 1.0 replaced `eval run --all` over tests/eval/evalsets/*.evalset.json
// with `eval generate` + `eval grade` over tests/eval/datasets/*.json in the
// Agent Platform EvaluationDataset shape (vertexai EvaluationDataset /
// EvalCase pydantic models — validated against the installed CLI). This
// module renders that shape by applying the CLI's own documented migration
// transform (the one `agents-cli scaffold upgrade` performs) to the already-
// rendered legacy evalset:
//
//   { eval_set_id, name, description, eval_cases: [...] }   (ADK EvalSet)
//     → { eval_cases: [...] }                               (EvaluationDataset)
//   eval_id → eval_case_id
//   conversation[0].user_content → top-level prompt with role: "user"
//   session_input → dropped
//   intermediate_data.tool_uses → dropped (the modern built-in metrics —
//     tool_use_quality etc. — are reference-free LLM judges over the actual
//     generated trace; the expected-trajectory annotations remain available
//     in the legacy evalset, which is still emitted during the transition)
//
// Deriving FROM the rendered evalset (rather than re-deriving from the
// contract through the factory's naming seam) means the modern dataset can
// never drift from the legacy evalset: one derivation, two serializations.
//
// Pure functions of their inputs — deterministic, no clock, no randomness.

/**
 * Render the agents-cli EvaluationDataset for a rendered ADK evalset
 * (renderAgentsCliEvalSet's output). Returns null when the evalset is
 * null/empty, mirroring the evalset renderer's own no-golden-evals contract.
 *
 * GE-generated eval cases are single-invocation by construction; a
 * multi-invocation case would need the EvaluationDataset "Shape B"
 * (agent_data.turns) encoding this renderer does not implement, so it throws
 * loudly rather than silently dropping turns.
 */
export function renderEvalDataset(evalSet) {
  if (!evalSet?.eval_cases?.length) return null;
  return {
    eval_cases: evalSet.eval_cases.map((evalCase) => {
      const conversation = evalCase.conversation || [];
      if (conversation.length !== 1) {
        throw new Error(
          `renderEvalDataset: eval case "${evalCase.eval_id}" has ${conversation.length} invocations; ` +
            "only single-invocation cases are supported (multi-turn needs the agent_data.turns encoding).",
        );
      }
      return {
        eval_case_id: evalCase.eval_id,
        prompt: { role: "user", parts: conversation[0]?.user_content?.parts || [] },
      };
    }),
  };
}

/**
 * Materialize a holdout split (renderHoldoutSplit) as two EvaluationDatasets
 * by filtering the full dataset's eval_cases by the split's id lists. Case
 * order and case objects pass through verbatim; the dataset envelope has no
 * metadata to annotate (EvaluationDataset is just { eval_cases }). These are
 * the train/validation inputs `agents-cli eval optimize` consumes directly —
 * they retire the bespoke optimization_config_v2.json pointer file.
 */
export function renderSplitEvalDatasets(dataset, split) {
  const side = (ids) => {
    const members = new Set(ids || []);
    return { eval_cases: (dataset?.eval_cases || []).filter((evalCase) => members.has(evalCase?.eval_case_id)) };
  };
  return { train: side(split?.train), validation: side(split?.validation) };
}
