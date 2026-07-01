// @ge/std/spec-gaps — shared translation catalog for gap/registration-gate
// codes produced by the two independently-evolved spec validators:
//   - apps/factory/src/agent-spec-registry.js (validateGenerationSpec,
//     validateCatalogParity) — the ~50-code load-bearing contract consumed
//     by multiple downstream systems (do not change those strings).
//   - apps/factory/scripts/audit-usecase-specs.mjs — a separate, smaller
//     validator with only partial overlap.
//
// Neither validator (nor any consumer) ever had a code -> human-message
// layer. describeGap() is that layer. It is pure JS with NO Node-specific
// imports so it can be imported from both server-side Node code (the audit
// script) and browser-bundled React (apps/console's SpecCanvas.tsx).
//
// This module does NOT change, merge, or reinterpret either validator's
// check logic — it only maps already-produced codes to friendlier text.

/**
 * Exact-match catalog: code -> { message, severity }.
 * Covers every gap code that is emitted as a plain string (no ":" suffix,
 * no dynamic field name) by either validator.
 */
const EXACT_CATALOG = {
  // ── agent-spec-registry.js: validateGenerationSpec() top-level shape ──
  missing_generation_spec: {
    message: "No generation spec has been produced yet for this use case.",
    severity: "error",
  },
  missing_generation_spec_version: {
    message: "The generation spec is missing a schema version marker.",
    severity: "error",
  },
  missing_row_policy: {
    message: "No row policy is defined (how many mock rows each entity should get).",
    severity: "error",
  },
  row_policy_missing_defaultRowsPerEntity: {
    message: "Row policy is missing a default row count per entity.",
    severity: "error",
  },
  row_policy_missing_minimumRowsPerEntity: {
    message: "Row policy is missing a minimum row count per entity.",
    severity: "error",
  },
  row_policy_missing_rationale: {
    message: "Row policy doesn't explain why its row counts were chosen.",
    severity: "error",
  },
  missing_source_systems: {
    message: "No source systems are declared for this agent to connect to.",
    severity: "error",
  },
  missing_schema_contracts: {
    message: "No data entities (schema contracts) are declared.",
    severity: "error",
  },
  missing_documents: {
    message: "No supporting documents are declared for evidence citation.",
    severity: "error",
  },
  missing_mock_data_anomalies: {
    message: "No mock-data anomalies are declared to exercise edge cases.",
    severity: "error",
  },
  missing_datastore_packaging: {
    message: "Datastore packaging (how data ships with the agent) is not defined.",
    severity: "error",
  },
  missing_validation_smoke_prompt: {
    message: "No smoke-test prompt is defined to validate the generated agent.",
    severity: "error",
  },
  validation_assertions_thin: {
    message: "Fewer than 2 validation assertions are defined for the smoke test.",
    severity: "warning",
  },

  // ── behaviorContract-level ──
  missing_behavior_contract: {
    message: "No behavior contract is defined (role, scope, tools, escalation rules).",
    severity: "error",
  },
  behavior_objective_too_short: {
    message: "The agent's primary objective is too short to be actionable (needs 60+ characters).",
    severity: "warning",
  },
  behavior_missing_toolIntents: {
    message: "The behavior contract declares no tool intents (no actions the agent can take).",
    severity: "error",
  },
  behavior_missing_query_intent: {
    message: "The agent has no read-only \"query\" tool intent for looking up data.",
    severity: "error",
  },
  behavior_missing_evidence_lookup: {
    message: "The agent has no \"evidence_lookup\" tool intent for citing sources.",
    severity: "error",
  },
  behavior_tool_intents_thin: {
    message: "Fewer than 3 tool intents are declared — the behavior contract is thin.",
    severity: "warning",
  },
  behavior_in_scope_thin: {
    message: "Fewer than 2 in-scope statements are declared.",
    severity: "warning",
  },
  behavior_out_of_scope_thin: {
    message: "Fewer than 2 out-of-scope statements are declared.",
    severity: "warning",
  },
  behavior_missing_evidence_requirements: {
    message: "No evidence requirements are declared (what the agent must cite before acting).",
    severity: "error",
  },
  behavior_escalation_rules_thin: {
    message: "Fewer than 2 escalation rules are declared.",
    severity: "warning",
  },
  behavior_refusal_rules_thin: {
    message: "Fewer than 2 refusal rules are declared.",
    severity: "warning",
  },
  behavior_missing_golden_evals: {
    message: "No golden evals are declared to regression-test agent behavior.",
    severity: "error",
  },
  behavior_missing_workflow: {
    message: "This is a multi-stage pipeline but no behaviorContract.workflow is declared.",
    severity: "warning",
  },

  // ── per-item required-field gaps without a dynamic id suffix ──
  source_system_missing_id: {
    message: "A source system is missing an id.",
    severity: "error",
  },
  entity_missing_name: {
    message: "A data entity is missing a name.",
    severity: "error",
  },
  document_missing_id: {
    message: "A supporting document is missing an id.",
    severity: "error",
  },
  tool_intent_missing_name: {
    message: "A tool intent is missing a name.",
    severity: "error",
  },

  // ── agent-spec-registry.js: validateCatalogParity() ──
  missing_subtitle: {
    message: "The catalog entry is missing a subtitle.",
    severity: "error",
  },
  missing_persona: {
    message: "The catalog entry is missing a persona / stakeholder description.",
    severity: "error",
  },
  kpis_thin: {
    message: "Fewer than 2 KPIs are declared.",
    severity: "warning",
  },
  status_quo_thin: {
    message: "Fewer than 2 \"status quo\" (current-state) bullet points are declared.",
    severity: "warning",
  },
  agentification_thin: {
    message: "Fewer than 2 \"agentification\" (future-state) bullet points are declared.",
    severity: "warning",
  },
  architecture_connections_thin: {
    message: "Too few architecture connections are declared relative to the source systems.",
    severity: "warning",
  },
  architecture_pipeline_thin: {
    message: "Fewer than 3 architecture pipeline stages are declared.",
    severity: "warning",
  },

  // ── audit-usecase-specs.mjs-only codes ──
  missing_explicit_generation_spec: {
    message: "No explicit generation spec is authored — the factory would synthesize one.",
    severity: "error",
  },
  missing_action_or_api_intents: {
    message: "This use case appears to change external state but declares no action tool intent or API.",
    severity: "error",
  },
};

/**
 * Templated catalog: base code (before the first ":") -> a function that
 * takes the suffix (the part after ":") and returns { message, severity }.
 * Mirrors the existing convention in audit-usecase-specs.mjs, which already
 * does `gap.split(":")[0]` to group these for its gap-frequency histogram.
 */
const TEMPLATED_CATALOG = {
  source_system_missing_name: (id) => ({
    message: `Source system "${id}" is missing a display name.`,
    severity: "error",
  }),
  source_system_missing_owns: (id) => ({
    message: `Source system "${id}" doesn't declare what data it owns.`,
    severity: "error",
  }),
  source_system_missing_protocol: (id) => ({
    message: `Source system "${id}" is missing a connection protocol.`,
    severity: "error",
  }),
  source_system_missing_local_backing: (id) => ({
    message: `Source system "${id}" has no local backing store declared for mock data.`,
    severity: "error",
  }),
  source_system_missing_tool_names: (id) => ({
    message: `Source system "${id}" declares no tool names.`,
    severity: "error",
  }),
  source_system_missing_evidence: (id) => ({
    message: `Source system "${id}" declares no evidence artifacts.`,
    severity: "error",
  }),
  entity_missing_pk: (name) => ({
    message: `Entity "${name}" is missing a primary key.`,
    severity: "error",
  }),
  entity_columns_thin: (name) => ({
    message: `Entity "${name}" has fewer than 3 columns declared.`,
    severity: "warning",
  }),
  entity_missing_datastore: (name) => ({
    message: `Entity "${name}" doesn't declare which datastore it lives in.`,
    severity: "error",
  }),
  entity_missing_row_count: (name) => ({
    message: `Entity "${name}" is missing a row count.`,
    severity: "error",
  }),
  entity_unknown_source_system: (name) => ({
    message: `Entity "${name}" references a source system id that isn't declared.`,
    severity: "error",
  }),
  entity_rows_too_low: (name) => ({
    message: `Entity "${name}" has fewer mock rows than the row policy's minimum.`,
    severity: "warning",
  }),
  document_missing_title: (id) => ({
    message: `Document "${id}" is missing a title.`,
    severity: "error",
  }),
  document_missing_required_sections: (id) => ({
    message: `Document "${id}" declares no required sections.`,
    severity: "error",
  }),
  document_missing_citation_anchors: (id) => ({
    message: `Document "${id}" declares no citation anchors.`,
    severity: "error",
  }),
  document_missing_minimum_word_count: (id) => ({
    message: `Document "${id}" is missing a minimum word count.`,
    severity: "error",
  }),
  api_missing_method: (id) => ({
    message: `API "${id}" is missing an HTTP method.`,
    severity: "error",
  }),
  api_missing_path: (id) => ({
    message: `API "${id}" is missing a path.`,
    severity: "error",
  }),
  api_missing_schema: (id) => ({
    message: `API "${id}" is missing a request or response schema.`,
    severity: "error",
  }),
  anomaly_missing_description: (id) => ({
    message: `Mock-data anomaly "${id}" is missing a description.`,
    severity: "error",
  }),
  anomaly_missing_affected_entities: (id) => ({
    message: `Mock-data anomaly "${id}" doesn't declare which entities it affects.`,
    severity: "error",
  }),
  anomaly_missing_expected_evidence: (id) => ({
    message: `Mock-data anomaly "${id}" doesn't declare what evidence should surface it.`,
    severity: "error",
  }),
  tool_intent_missing_kind: (name) => ({
    message: `Tool intent "${name}" is missing a kind (query, evidence_lookup, or action).`,
    severity: "error",
  }),
  tool_intent_missing_description: (name) => ({
    message: `Tool intent "${name}" is missing a description.`,
    severity: "error",
  }),
  tool_intent_missing_required_inputs: (name) => ({
    message: `Tool intent "${name}" declares no required inputs.`,
    severity: "error",
  }),
  tool_intent_missing_produces: (name) => ({
    message: `Tool intent "${name}" doesn't declare what it produces.`,
    severity: "error",
  }),
  tool_intent_missing_evidence_emitted: (name) => ({
    message: `Tool intent "${name}" doesn't declare what evidence it emits.`,
    severity: "error",
  }),
  tool_intent_unknown_source_system: (name) => ({
    message: `Tool intent "${name}" references a source system id that isn't declared.`,
    severity: "error",
  }),
  kpi_missing_before_after: (index) => ({
    message: `KPI #${index} is missing a label, before value, or after value.`,
    severity: "error",
  }),
  workflow_tool_not_in_toolIntents: (tool) => ({
    message: `Workflow step references tool "${tool}", which isn't declared in toolIntents.`,
    severity: "error",
  }),
};

/**
 * Field-name -> human label, used both by the behavior_missing_${field}
 * family (dynamic-suffix, not colon-suffix — REQUIRED_BEHAVIOR_FIELDS in
 * agent-spec-registry.js / audit-usecase-specs.mjs) and as a fallback for
 * prettifying arbitrary field/code fragments.
 */
const FIELD_LABELS = {
  role: "role",
  primaryObjective: "primary objective",
  inScope: "in-scope statement",
  outOfScope: "out-of-scope statement",
  toolIntents: "tool intents",
  evidenceRequirements: "evidence requirements",
  escalationRules: "escalation rules",
  refusalRules: "refusal rules",
  goldenEvals: "golden evals",
};

const BEHAVIOR_MISSING_PREFIX = "behavior_missing_";

/**
 * Prettify a snake_case / camelCase / colon-suffixed raw code into
 * Title Case, as a last-resort fallback so an unrecognized code never
 * renders as a bare machine-readable string.
 */
function prettifyCode(code) {
  return String(code)
    .split(":")[0]
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase()
    .replace(/^./, (ch) => ch.toUpperCase());
}

/**
 * Translate a gap/registration-gate code emitted by either
 * agent-spec-registry.js's validateGenerationSpec()/validateCatalogParity()
 * or audit-usecase-specs.mjs into a human-readable { code, message,
 * severity }. Never throws; unrecognized codes fall back to a prettified
 * rendering of the raw code so future new codes always show *something*
 * reasonable until a real catalog entry is added.
 *
 * @param {string} code
 * @returns {{ code: string, message: string, severity: "error" | "warning" }}
 */
export function describeGap(code) {
  const raw = String(code ?? "");

  // 1. Exact match.
  const exact = EXACT_CATALOG[raw];
  if (exact) {
    return { code: raw, message: exact.message, severity: exact.severity || "error" };
  }

  // 3. behavior_missing_${field} family (dynamic suffix, no colon).
  //    Checked before the colon-suffix split since these codes never
  //    contain a colon, but do so up front so a future field-shaped code
  //    that coincidentally also has a colon suffix can't shadow this.
  if (raw.startsWith(BEHAVIOR_MISSING_PREFIX)) {
    const field = raw.slice(BEHAVIOR_MISSING_PREFIX.length);
    const label = FIELD_LABELS[field];
    if (label) {
      return {
        code: raw,
        message: `The behavior contract is missing ${label}.`,
        severity: "error",
      };
    }
  }

  // 2. Colon-suffixed templated codes, e.g. "entity_missing_pk:orders".
  //    Mirrors audit-usecase-specs.mjs's existing gap.split(":") convention.
  if (raw.includes(":")) {
    const [base, ...rest] = raw.split(":");
    const suffix = rest.join(":");
    const template = TEMPLATED_CATALOG[base];
    if (template) {
      const { message, severity } = template(suffix);
      return { code: raw, message, severity: severity || "error" };
    }
  }

  // 4. Fallback: prettify the raw code so it never renders as a literal
  //    machine string, and never crashes on an unrecognized code.
  return {
    code: raw,
    message: prettifyCode(raw) || "Unspecified registration gap.",
    severity: "warning",
  };
}
