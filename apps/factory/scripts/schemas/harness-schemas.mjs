import { z } from "zod";

// Single source of truth for the harness review/refine result contracts.
// - The JSON Schema the Antigravity SDK consumes as `response_schema`
//   (harness-{refine,review}.schema.json) is GENERATED from these via
//   gen-harness-schemas.mjs (zod v4 native z.toJSONSchema).
// - factory.mjs validates parsed harness output against these at runtime.
// looseObject => additionalProperties allowed (the SDK may add fields).

export const harnessRefineSchema = z.looseObject({
  changed_files: z.array(z.string()),
  summary: z.string(),
  verification_commands: z.array(z.string()),
  remaining_gaps: z.array(z.string()),
  spec_to_code_fidelity: z.enum(["pass", "partial", "fail"]),
});

export const harnessReviewSchema = z.looseObject({
  ok_to_promote: z.boolean(),
  agent_quality_score: z.number(),
  spec_to_code_score: z.number(),
  spec_gaps: z.array(z.any()).optional(),
  agent_logic_gaps: z.array(z.any()).optional(),
  tool_gaps: z.array(z.any()).optional(),
  mock_data_gaps: z.array(z.any()).optional(),
  eval_gaps: z.array(z.any()).optional(),
  adk_capability_gaps: z.array(z.any()).optional(),
  recommended_generator_changes: z.array(z.any()).optional(),
  recommended_pack_changes: z.array(z.any()).optional(),
  required_follow_up_commands: z.array(z.any()).optional(),
});

export const HARNESS_SCHEMAS = {
  "harness-refine": harnessRefineSchema,
  "harness-review": harnessReviewSchema,
};
