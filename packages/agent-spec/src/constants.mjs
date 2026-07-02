// Agent-spec contract constants, moved verbatim from
// apps/factory/src/agent-spec-registry.js (WS2 Step 4). The registry
// re-exports them, so its 7 existing importers are unchanged.

export const AGENT_SPEC_SCHEMA_VERSION = 1;
export const INTERVIEW_SPEC_DIR = "catalog/interview-specs";

export const REQUIRED_BEHAVIOR_FIELDS = [
  "role",
  "primaryObjective",
  "inScope",
  "outOfScope",
  "toolIntents",
  "evidenceRequirements",
  "escalationRules",
  "refusalRules",
  "goldenEvals",
];
