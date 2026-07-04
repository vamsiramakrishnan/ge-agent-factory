// @ge/okf compile — resolve stage: variant resolution + cross-ref validation.
//
// VARIANT RESOLUTION SEMANTICS
// A bundle whose root index.md declares `variant_of: <baseId>` is a VARIANT:
// its resolved IR is the BASE bundle's (recursively resolved) IR, overlaid
// with the variant's own concepts, then rewritten by the variant's bindings:
//
//   1. MERGE — every variant concept collection overlays the base by key
//      (systems by id, entities by name, tools by name, queries/evals/
//      documents by id, personas by id, grounding contracts by claimType,
//      tool contracts by tool, error paths by failureMode): same key replaces
//      the base node, new keys append (after the base's, in variant order).
//      A variant playbook overrides base playbook fields it fills in; a
//      variant workflow replaces the base workflow outright (use
//      workflowOverrides in the bindings to PATCH instead of replace).
//   2. SYSTEM SWAPS — bindings.systems ({from: to}) rewrite every system id
//      reference: systems[].id, entities[].sourceSystemId,
//      tools[].sourceSystemId, grounding evidence systems, capability
//      dependencies. Swapping a system the base never declares is an error.
//   3. TERMINOLOGY — bindings.terminology rewrites display strings (system
//      names, tool descriptions, playbook prose, workflow labels, query
//      requests, eval prompts, document titles). Longer terms apply first so
//      overlapping terms resolve deterministically.
//   4. POLICY OVERLAYS — refusal overlays append to playbook.refusalRules;
//      escalation overlays append to behaviorContract.escalationRules.
//   5. WORKFLOW OVERRIDES — patch steps by id (label/description/tools),
//      remove steps, or flip the mode. Overriding an unknown step id is an
//      error.
//
// Cycle detection: the chain of visited bundle keys travels with resolution;
// revisiting one is OKF_VARIANT_CYCLE.

import { COMPILE_ERROR_CODES as E, compileError } from "./errors.mjs";

// ─── variant merge ───────────────────────────────────────────────────────────

function mergeByKey(baseList, variantList, keyOf) {
  const out = baseList.map((node) => {
    const replacement = variantList.find((v) => keyOf(v) === keyOf(node));
    return replacement || node;
  });
  for (const v of variantList) {
    if (!baseList.some((node) => keyOf(node) === keyOf(v))) out.push(v);
  }
  return out;
}

function mergePlaybook(base, variant) {
  if (!base) return variant;
  if (!variant) return base;
  return {
    role: variant.role || base.role,
    primaryObjective: variant.primaryObjective || base.primaryObjective,
    inScope: variant.inScope.length ? variant.inScope : base.inScope,
    outOfScope: variant.outOfScope.length ? variant.outOfScope : base.outOfScope,
    refusalRules: variant.refusalRules.length ? variant.refusalRules : base.refusalRules,
  };
}

/** Overlay the variant bundle's own concepts onto the resolved base IR. */
export function mergeVariantIr(baseIr, variantIr) {
  return {
    // Root metadata (variantOf/provenance) always comes from the VARIANT.
    root: variantIr.root,
    playbook: mergePlaybook(baseIr.playbook, variantIr.playbook),
    systems: mergeByKey(baseIr.systems, variantIr.systems, (s) => s.id),
    entities: mergeByKey(baseIr.entities, variantIr.entities, (e) => e.name),
    tools: mergeByKey(baseIr.tools, variantIr.tools, (t) => t.name),
    workflow: variantIr.workflow || baseIr.workflow,
    queries: mergeByKey(baseIr.queries, variantIr.queries, (q) => q.id),
    evals: mergeByKey(baseIr.evals, variantIr.evals, (t) => t.id),
    documents: mergeByKey(baseIr.documents, variantIr.documents, (d) => d.id),
    groundingContracts: mergeByKey(baseIr.groundingContracts, variantIr.groundingContracts, (g) => g.claimType),
    toolContracts: mergeByKey(baseIr.toolContracts, variantIr.toolContracts, (t) => t.tool),
    refusalPolicies: mergeByKey(baseIr.refusalPolicies, variantIr.refusalPolicies, (p) => p.id),
    escalationPolicies: mergeByKey(baseIr.escalationPolicies, variantIr.escalationPolicies, (p) => p.id),
    personas: mergeByKey(baseIr.personas, variantIr.personas, (p) => p.id),
    errorPaths: mergeByKey(baseIr.errorPaths, variantIr.errorPaths, (e) => e.failureMode),
    slos: variantIr.slos || baseIr.slos,
    capabilityDependencies: mergeByKey(baseIr.capabilityDependencies, variantIr.capabilityDependencies, (c) => c.capability),
    bindings: variantIr.bindings,
    escalationRules: [...baseIr.escalationRules, ...variantIr.escalationRules],
  };
}

// ─── bindings application ────────────────────────────────────────────────────

function applyTerminology(text, terms) {
  if (text === undefined || text === null) return text;
  let out = String(text);
  for (const [from, to] of terms) out = out.split(from).join(to);
  return out;
}

/**
 * Apply the variant's bindings to a merged IR (mutating a shallow rebuild,
 * never the input). `baseSystemIds` gates system swaps: swapping a system the
 * base never declared is an authoring error, not a no-op.
 */
export function applyBindings(ir, bindings, baseSystemIds, errors, conceptPath) {
  if (!bindings) return ir;
  const out = { ...ir };

  // 2. System swaps.
  const systemMap = bindings.systems || {};
  const swaps = Object.entries(systemMap);
  if (swaps.length) {
    for (const [from] of swaps) {
      if (!baseSystemIds.has(from)) {
        errors.push(compileError(E.BINDING_UNKNOWN_SYSTEM, conceptPath, `Binding swaps system "${from}" which the base bundle never declares.`, `use one of the base's system ids: ${[...baseSystemIds].join(", ") || "(none)"}`));
      }
    }
    const swapId = (id) => (id !== undefined && systemMap[id] !== undefined ? systemMap[id] : id);
    out.systems = ir.systems.map((s) => ({ ...s, id: swapId(s.id) }));
    out.entities = ir.entities.map((e) => ({ ...e, sourceSystemId: swapId(e.sourceSystemId) }));
    out.tools = ir.tools.map((t) => ({ ...t, sourceSystemId: swapId(t.sourceSystemId) }));
    out.groundingContracts = ir.groundingContracts.map((g) => ({
      ...g,
      evidence: g.evidence.map((ref) => ({ ...ref, system: swapId(ref.system) })),
    }));
    out.capabilityDependencies = ir.capabilityDependencies.map((c) => ({
      ...c,
      requires: c.requires.map(swapId),
    }));
  }

  // 3. Terminology — longest term first, then lexicographic: deterministic
  // and immune to one term being a prefix of another.
  const termEntries = Object.entries(bindings.terminology || {}).sort(
    ([a], [b]) => b.length - a.length || (a < b ? -1 : a > b ? 1 : 0),
  );
  if (termEntries.length) {
    const t = (text) => applyTerminology(text, termEntries);
    out.systems = out.systems.map((s) => ({ ...s, name: t(s.name) }));
    out.tools = out.tools.map((tool) => ({ ...tool, description: t(tool.description) }));
    if (out.playbook) {
      out.playbook = {
        ...out.playbook,
        role: t(out.playbook.role),
        primaryObjective: t(out.playbook.primaryObjective),
        inScope: out.playbook.inScope.map(t),
        outOfScope: out.playbook.outOfScope.map(t),
        refusalRules: out.playbook.refusalRules.map(t),
      };
    }
    if (out.workflow) {
      out.workflow = {
        ...out.workflow,
        steps: out.workflow.steps.map((step) => ({ ...step, label: t(step.label), description: t(step.description) })),
      };
    }
    out.queries = out.queries.map((q) => ({ ...q, request: t(q.request) }));
    out.evals = out.evals.map((e) => ({ ...e, prompt: t(e.prompt) }));
    out.documents = out.documents.map((d) => ({ ...d, title: t(d.title) }));
  }

  // 4. Policy overlays.
  for (const overlay of bindings.policyOverlays || []) {
    if (overlay.kind === "refusal") {
      if (!out.playbook) out.playbook = { role: undefined, primaryObjective: undefined, inScope: [], outOfScope: [], refusalRules: [] };
      out.playbook = { ...out.playbook, refusalRules: [...out.playbook.refusalRules, overlay.rule] };
    } else if (overlay.kind === "escalation") {
      out.escalationRules = [...out.escalationRules, overlay.rule];
    }
  }

  // 5. Workflow overrides.
  const overrides = bindings.workflowOverrides;
  if (overrides) {
    if (!out.workflow && (overrides.steps?.length || overrides.mode)) {
      errors.push(compileError(E.WORKFLOW_OVERRIDE_UNKNOWN_STEP, conceptPath, "Workflow overrides declared but the resolved bundle has no workflow.", "remove the `## Workflow Overrides` section or add a workflow to the base bundle"));
    } else if (out.workflow) {
      let steps = out.workflow.steps;
      for (const patch of overrides.steps || []) {
        const idx = steps.findIndex((s) => s.id === patch.id);
        if (idx < 0) {
          errors.push(compileError(E.WORKFLOW_OVERRIDE_UNKNOWN_STEP, conceptPath, `Workflow override targets step "${patch.id}" which the resolved workflow does not contain.`, `use one of: ${steps.map((s) => s.id).join(", ") || "(none)"}`));
          continue;
        }
        if (patch.remove) {
          steps = steps.filter((s) => s.id !== patch.id);
        } else {
          const next = { ...steps[idx] };
          if (patch.label !== undefined) next.label = patch.label;
          if (patch.description !== undefined) next.description = patch.description;
          if (patch.tools !== undefined) next.tools = patch.tools;
          steps = steps.map((s, i) => (i === idx ? next : s));
        }
      }
      out.workflow = { mode: overrides.mode || out.workflow.mode, steps };
    }
  }

  return out;
}

// ─── cross-reference validation ─────────────────────────────────────────────

/**
 * Validate every typed cross-reference on a RESOLVED IR. Legacy collections
 * are deliberately not re-validated (the legacy compiler tolerated dangling
 * refs and byte-compatibility freezes that); every NEW field must resolve.
 */
export function validateIr(ir, errors) {
  const systemIds = new Set(ir.systems.map((s) => s.id));
  const toolNames = new Set(ir.tools.map((t) => t.name));
  const entityNames = new Set(ir.entities.map((e) => e.name));

  for (const contract of ir.groundingContracts) {
    for (const ref of contract.evidence) {
      if (!systemIds.has(ref.system)) {
        errors.push(compileError(E.GROUNDING_UNDECLARED_SYSTEM, null, `Grounding Contract "${contract.claimType}" cites system "${ref.system}" which the bundle never declares.`, `declare systems/${ref.system}.md or cite one of: ${[...systemIds].join(", ") || "(none)"}`));
      }
      if (ref.tool !== undefined && !toolNames.has(ref.tool)) {
        errors.push(compileError(E.GROUNDING_UNKNOWN_TOOL, null, `Grounding Contract "${contract.claimType}" cites tool "${ref.tool}" which the bundle never declares.`, `declare the tool concept or cite one of: ${[...toolNames].join(", ") || "(none)"}`));
      }
    }
  }
  for (const contract of ir.toolContracts) {
    if (!toolNames.has(contract.tool)) {
      errors.push(compileError(E.TOOL_CONTRACT_UNKNOWN_TOOL, null, `Tool Contract targets tool "${contract.tool}" which the bundle never declares.`, `declare tools/${contract.tool}.md or target one of: ${[...toolNames].join(", ") || "(none)"}`));
    }
  }
  for (const errorPath of ir.errorPaths) {
    for (const toolName of Object.keys(errorPath.toolOverrides || {})) {
      if (!toolNames.has(toolName)) {
        errors.push(compileError(E.ERROR_PATH_UNKNOWN_TOOL, null, `Error Path "${errorPath.failureMode}" overrides tool "${toolName}" which the bundle never declares.`, `remove the override or declare tools/${toolName}.md`));
      }
    }
  }
  for (const dep of ir.capabilityDependencies) {
    for (const sysId of dep.requires) {
      if (!systemIds.has(sysId)) {
        errors.push(compileError(E.CAPABILITY_UNKNOWN_SYSTEM, null, `Capability "${dep.capability}" requires system "${sysId}" which the bundle never declares.`, `declare systems/${sysId}.md or require one of: ${[...systemIds].join(", ") || "(none)"}`));
      }
    }
  }
  for (const policy of [...ir.refusalPolicies, ...ir.escalationPolicies]) {
    if (policy.trigger.kind === "entity_condition" && policy.trigger.entity !== undefined && !entityNames.has(policy.trigger.entity)) {
      errors.push(compileError(E.POLICY_UNKNOWN_ENTITY, null, `Policy "${policy.id}" triggers on entity "${policy.trigger.entity}" which the bundle never declares.`, `declare tables/<entity>.md or trigger on one of: ${[...entityNames].join(", ") || "(none)"}`));
    }
  }
}
