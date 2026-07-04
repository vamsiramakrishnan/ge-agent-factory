// @ge/okf compile — emit stage: resolved IR → normalized (partial) spec.
//
// BYTE-COMPATIBILITY CONTRACT: for a bundle carrying only legacy concepts,
// the emitted spec must JSON-serialize byte-identically to what the original
// apps/factory/scripts/okf-to-spec.mjs produced. That pins the legacy key
// insertion order below (role → primaryObjective → inScope → outOfScope →
// refusalRules → workflow → toolIntents → answerableQueries → goldenEvals;
// generationSpec: sourceSystems → entities → documents → behaviorContract).
// Every NEW field appends strictly after the legacy keys and only when its IR
// collection is non-empty, so legacy bundles gain no bytes.
//
// Each new field group is validated against its @ge/agent-spec Zod schema on
// the way out — a mismatch is a compiler bug surfaced as a structured
// OKF_SPEC_SCHEMA error, never a silently malformed spec. (The WHOLE spec is
// deliberately not validated with GenerationSpecSchema: OKF compiles a
// PARTIAL spec by design — no version/rowPolicy/anomalies — and legacy
// bundles must keep compiling without those.)

import {
  CapabilityDependencySchema,
  ErrorPathBehaviorSchema,
  EscalationPolicySchema,
  GroundingContractSchema,
  RefusalPolicySchema,
  SlosSchema,
  SpecPersonaSchema,
  SpecProvenanceSchema,
  ToolContractSchema,
  VariantBindingsSchema,
  VariantOfSchema,
} from "@ge/agent-spec/schema";
import { z } from "zod";

import { COMPILE_ERROR_CODES as E, compileError } from "./errors.mjs";

const NEW_FIELD_SCHEMAS = {
  groundingContracts: z.array(GroundingContractSchema),
  toolContracts: z.array(ToolContractSchema),
  refusalPolicies: z.array(RefusalPolicySchema),
  escalationPolicies: z.array(EscalationPolicySchema),
  personas: z.array(SpecPersonaSchema),
  errorPathBehavior: z.array(ErrorPathBehaviorSchema),
  slos: SlosSchema,
  capabilityDependencies: z.array(CapabilityDependencySchema),
  variantOf: VariantOfSchema,
  bindings: VariantBindingsSchema,
  provenance: SpecProvenanceSchema,
};

function validateNewField(name, value, errors) {
  const result = NEW_FIELD_SCHEMAS[name].safeParse(value);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    errors.push(compileError(E.SPEC_SCHEMA, null, `Compiled ${name} does not satisfy the agent-spec schema (compiler bug): ${issues}.`, "report this with the bundle attached — the parser accepted a shape the schema rejects"));
    return false;
  }
  return true;
}

/**
 * Emit the spec object from a resolved IR. Pushes structured errors (never
 * throws) when a compiled new-field group fails its Zod schema; the field is
 * then omitted rather than emitted malformed.
 */
export function emitSpec(ir, errors) {
  const behaviorContract = {};

  // ── legacy keys, in the original converter's insertion order ──────────────
  if (ir.playbook) {
    behaviorContract.role = ir.playbook.role;
    behaviorContract.primaryObjective = ir.playbook.primaryObjective;
    behaviorContract.inScope = ir.playbook.inScope;
    behaviorContract.outOfScope = ir.playbook.outOfScope;
    if (ir.playbook.refusalRules.length) behaviorContract.refusalRules = ir.playbook.refusalRules;
  }
  if (ir.workflow) behaviorContract.workflow = ir.workflow;
  if (ir.tools.length) behaviorContract.toolIntents = ir.tools;
  if (ir.queries.length) behaviorContract.answerableQueries = ir.queries;
  if (ir.evals.length) behaviorContract.goldenEvals = ir.evals;

  // ── new keys, strictly after the legacy ones ──────────────────────────────
  if (ir.escalationRules.length) behaviorContract.escalationRules = ir.escalationRules;
  if (ir.groundingContracts.length && validateNewField("groundingContracts", ir.groundingContracts, errors)) {
    behaviorContract.groundingContracts = ir.groundingContracts;
  }
  if (ir.toolContracts.length && validateNewField("toolContracts", ir.toolContracts, errors)) {
    behaviorContract.toolContracts = ir.toolContracts;
  }
  if (ir.refusalPolicies.length && validateNewField("refusalPolicies", ir.refusalPolicies, errors)) {
    behaviorContract.refusalPolicies = ir.refusalPolicies;
  }
  if (ir.escalationPolicies.length && validateNewField("escalationPolicies", ir.escalationPolicies, errors)) {
    behaviorContract.escalationPolicies = ir.escalationPolicies;
  }
  if (ir.personas.length && validateNewField("personas", ir.personas, errors)) {
    behaviorContract.personas = ir.personas;
  }
  if (ir.errorPaths.length && validateNewField("errorPathBehavior", ir.errorPaths, errors)) {
    behaviorContract.errorPathBehavior = ir.errorPaths;
  }
  if (ir.slos && validateNewField("slos", ir.slos, errors)) {
    behaviorContract.slos = ir.slos;
  }
  if (ir.capabilityDependencies.length && validateNewField("capabilityDependencies", ir.capabilityDependencies, errors)) {
    behaviorContract.capabilityDependencies = ir.capabilityDependencies;
  }

  const generationSpec = {
    sourceSystems: ir.systems,
    entities: ir.entities,
    documents: ir.documents,
    behaviorContract,
  };
  if (ir.root.variantOf && validateNewField("variantOf", ir.root.variantOf, errors)) {
    generationSpec.variantOf = ir.root.variantOf;
  }
  if (ir.bindings && validateNewField("bindings", ir.bindings, errors)) {
    generationSpec.bindings = ir.bindings;
  }
  if (ir.root.provenance && validateNewField("provenance", ir.root.provenance, errors)) {
    generationSpec.provenance = ir.root.provenance;
  }

  return { behaviorContract, generationSpec };
}
