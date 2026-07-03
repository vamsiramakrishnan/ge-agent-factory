// @ge/evalkit/compiler — the behavioral compiler's import surface.
//
// Pipeline shape (each stage stays importable on its own for tests and for
// callers that only need a slice):
//
//   graph.mjs                  BehavioralGraph zod schemas + validator
//   compile-from-agent-spec.mjs  spec envelope → validated BehavioralGraph
//   expansions.mjs             graph → deterministic ConversationCase pool
//   select-cases.mjs           greedy weighted set-cover over coverage tags
//   compile.mjs                the end-to-end pass (graph → pool → selection →
//                              bench profile, optional artifact drop)
//
// Determinism contract: same envelope in, byte-identical artifacts out — no
// clock, no randomness (seeded FNV-1a only, via ./perturbations.mjs).
export {
  BEHAVIORAL_GRAPH_API_VERSION,
  BEHAVIORAL_GRAPH_KIND,
  CapabilityNodeSchema,
  AuthorityEdgeSchema,
  ToolBehaviorSchema,
  PersonaNodeSchema,
  WorldNodeSchema,
  CoverageTagSchema,
  ConversationCaseSchema,
  CoverageSummarySchema,
  BehavioralGraphSchema,
  validateBehavioralGraph,
} from "./graph.mjs";
export { compileBehavioralGraph } from "./compile-from-agent-spec.mjs";
export { capabilityOwningTool, expandConversationCases } from "./expansions.mjs";
export { selectCases } from "./select-cases.mjs";
export { compileBehavioralSuite, DEFAULT_REQUIRED_COVERAGE } from "./compile.mjs";
