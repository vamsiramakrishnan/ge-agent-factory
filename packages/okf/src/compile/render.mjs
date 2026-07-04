// @ge/okf compile — render stage: typed IR → OKF concepts.
//
// The forward direction of the compiler's parse grammars: every renderer here
// emits EXACTLY the frontmatter/section shape `parse.mjs` reads back, so
// `parseBundle(conceptsFromEntries(renderIr(ir)))` recovers the IR (the
// property tests in compile.property.test.mjs hold the two in lockstep).
// This is also the authoritative example of how an LLM should author each
// quality-bearing concept type by hand.
//
// Deterministic by contract: output depends only on the IR (no clock, no
// randomness); collections render in IR order at stable paths.

import { link, renderConcept, slug } from "../index.mjs";

const line = (items) => items.filter((x) => x !== null && x !== undefined).join("\n");
const bulletList = (items) => (items || []).map((x) => `- ${x}`).join("\n");

function mdTable(headers, rows) {
  const row = (cells) => `| ${cells.map((c) => (c === undefined || c === null ? "" : String(c))).join(" | ")} |`;
  return [row(headers), row(headers.map(() => "---")), ...rows.map(row)].join("\n");
}

// ─── legacy shapes (minimal, parse-compatible) ───────────────────────────────

export function renderSystem(sys) {
  return {
    relPath: `systems/${sys.id}`,
    frontmatter: { type: "Source System", title: sys.name },
    body: line([
      `# ${sys.name}`,
      "",
      sys.protocol ? `- **Protocol:** ${sys.protocol}` : null,
      "",
      "# Schema",
      "",
      (sys.owns || []).length
        ? sys.owns.map((name) => `- ${link(`tables/${name}`, name)}`).join("\n")
        : "_No entities._",
    ]),
  };
}

export function renderTool(tool) {
  return {
    relPath: `tools/${slug(tool.name)}`,
    frontmatter: {
      type: "Agent Tool",
      title: tool.name,
      ...(tool.description ? { description: tool.description } : {}),
    },
    body: line([
      `# ${tool.name}`,
      "",
      tool.kind ? `- **Kind:** ${tool.kind}` : null,
      tool.sourceSystemId ? `- **Source system:** ${link(`systems/${tool.sourceSystemId}`, tool.sourceSystemId)}` : null,
      "",
      "## Required inputs",
      "",
      bulletList(tool.requiredInputs),
      "",
      "## Produces",
      "",
      bulletList(tool.produces),
      "",
      "## Evidence emitted",
      "",
      bulletList(tool.evidenceEmitted),
    ]),
  };
}

// ─── quality-bearing concept types ───────────────────────────────────────────

export function renderGroundingContract(contract) {
  return {
    relPath: `grounding/${slug(contract.claimType)}`,
    frontmatter: {
      type: "Grounding Contract",
      title: contract.claimType,
      claim_type: contract.claimType,
      citation_required: contract.citationRequired ? "true" : "false",
    },
    body: line([
      `# ${contract.claimType}`,
      "",
      "## Evidence",
      "",
      mdTable(
        ["System", "Tool", "Entity", "Field"],
        contract.evidence.map((ref) => [ref.system, ref.tool ?? "", ref.entity ?? "", ref.field ?? ""]),
      ),
    ]),
  };
}

export function renderToolContract(contract) {
  return {
    relPath: `contracts/${slug(contract.tool)}`,
    frontmatter: {
      type: "Tool Contract",
      title: `Contract — ${contract.tool}`,
      tool: contract.tool,
      idempotency: contract.idempotency,
      confirmation_policy: contract.confirmationPolicy,
    },
    body: line([
      `# Contract — ${contract.tool}`,
      "",
      "## Preconditions",
      "",
      contract.preconditions.length ? bulletList(contract.preconditions) : "_None specified._",
      "",
      "## Postconditions",
      "",
      contract.postconditions.length ? bulletList(contract.postconditions) : "_None specified._",
    ]),
  };
}

export function renderStructuredPolicy(kind, policy) {
  const frontmatter = {
    type: "Policy",
    title: `${kind === "refusal" ? "Refusal" : "Escalation"} — ${policy.id}`,
    source_id: policy.id,
    policy_kind: kind,
    trigger_kind: policy.trigger.kind,
  };
  if (policy.trigger.entity) frontmatter.trigger_entity = policy.trigger.entity;
  if (policy.trigger.condition) frontmatter.trigger_condition = policy.trigger.condition;
  if (policy.trigger.category) frontmatter.trigger_category = policy.trigger.category;
  if (policy.trigger.authority) frontmatter.trigger_authority = policy.trigger.authority;
  if (policy.trigger.sensitivity) frontmatter.trigger_sensitivity = policy.trigger.sensitivity;
  if (kind === "escalation" && policy.handoffTarget) frontmatter.handoff_target = policy.handoffTarget;
  return {
    relPath: `policies/${slug(policy.id)}`,
    frontmatter,
    body: line([
      `# ${frontmatter.title}`,
      "",
      "## Response",
      "",
      policy.response,
      "",
      "## Rationale",
      "",
      policy.rationale,
    ]),
  };
}

export function renderPersona(persona) {
  const frontmatter = {
    type: "Persona",
    title: persona.role,
    persona_id: persona.id,
  };
  if (persona.patience) frontmatter.patience = persona.patience;
  if (persona.adversarial !== undefined) frontmatter.adversarial = persona.adversarial ? "true" : "false";
  return {
    relPath: `personas/${slug(persona.id)}`,
    frontmatter,
    body: line([
      `# ${persona.role}`,
      "",
      "## Role",
      "",
      persona.role,
      "",
      "## Goals",
      "",
      bulletList(persona.goals),
      persona.vocabulary ? "" : null,
      persona.vocabulary ? "## Vocabulary" : null,
      persona.vocabulary ? "" : null,
      persona.vocabulary ? persona.vocabulary : null,
      persona.simulationInstruction ? "" : null,
      persona.simulationInstruction ? "## Simulation Instruction" : null,
      persona.simulationInstruction ? "" : null,
      persona.simulationInstruction ? persona.simulationInstruction : null,
    ]),
  };
}

export function renderErrorPath(errorPath) {
  const frontmatter = {
    type: "Error Path",
    title: errorPath.failureMode,
    failure_mode: errorPath.failureMode,
    behavior: errorPath.behavior,
  };
  if (errorPath.maxRetries !== undefined) frontmatter.max_retries = String(errorPath.maxRetries);
  const overrides = Object.entries(errorPath.toolOverrides || {});
  return {
    relPath: `error-paths/${slug(errorPath.failureMode)}`,
    frontmatter,
    body: line([
      `# ${errorPath.failureMode}`,
      errorPath.fallback ? "" : null,
      errorPath.fallback ? "## Fallback" : null,
      errorPath.fallback ? "" : null,
      errorPath.fallback ? errorPath.fallback : null,
      overrides.length ? "" : null,
      overrides.length ? "## Tool Overrides" : null,
      overrides.length ? "" : null,
      overrides.length
        ? overrides
            .map(([tool, o]) =>
              `- ${tool}: ${[
                `behavior = ${o.behavior}`,
                o.maxRetries !== undefined ? `max_retries = ${o.maxRetries}` : null,
                o.fallback ? `fallback = ${o.fallback}` : null,
              ]
                .filter(Boolean)
                .join("; ")}`,
            )
            .join("\n")
        : null,
    ]),
  };
}

export function renderSlo(slos) {
  return {
    relPath: "slos",
    frontmatter: { type: "SLO", title: "Service Level Objectives" },
    body: line([
      "# Service Level Objectives",
      slos.taskSuccess ? "" : null,
      slos.taskSuccess ? "## Task Success" : null,
      slos.taskSuccess ? "" : null,
      slos.taskSuccess ? `- definition: ${slos.taskSuccess.definition}\n- target: ${slos.taskSuccess.target}` : null,
      slos.latency ? "" : null,
      slos.latency ? "## Latency" : null,
      slos.latency ? "" : null,
      slos.latency
        ? line([
            slos.latency.p95TtftMs !== undefined ? `- p95_ttft_ms: ${slos.latency.p95TtftMs}` : null,
            slos.latency.p95FullMs !== undefined ? `- p95_full_ms: ${slos.latency.p95FullMs}` : null,
          ])
        : null,
      slos.containment ? "" : null,
      slos.containment ? "## Containment" : null,
      slos.containment ? "" : null,
      slos.containment ? `- target: ${slos.containment.target}` : null,
    ]),
  };
}

export function renderVariantBinding(bindings) {
  const systems = Object.entries(bindings.systems || {});
  const terminology = Object.entries(bindings.terminology || {});
  const overlays = bindings.policyOverlays || [];
  const overrides = bindings.workflowOverrides || null;
  return {
    relPath: "variant/bindings",
    frontmatter: { type: "Variant Binding", title: "Variant Bindings" },
    body: line([
      "# Variant Bindings",
      systems.length ? "" : null,
      systems.length ? "## System Bindings" : null,
      systems.length ? "" : null,
      systems.length ? mdTable(["From", "To"], systems) : null,
      terminology.length ? "" : null,
      terminology.length ? "## Terminology" : null,
      terminology.length ? "" : null,
      terminology.length ? mdTable(["From", "To"], terminology) : null,
      overlays.length ? "" : null,
      overlays.length ? "## Policy Overlays" : null,
      overlays.length ? "" : null,
      overlays.length
        ? overlays
            .map((overlay) =>
              overlay.kind === "refusal"
                ? `- refusal: ${overlay.rule}`
                : `- escalation: ${[
                    `trigger = ${overlay.rule.trigger}`,
                    `action = ${overlay.rule.action}`,
                    overlay.rule.handoffTarget ? `handoff = ${overlay.rule.handoffTarget}` : null,
                    overlay.rule.rationale ? `rationale = ${overlay.rule.rationale}` : null,
                  ]
                    .filter(Boolean)
                    .join("; ")}`,
            )
            .join("\n")
        : null,
      overrides ? "" : null,
      overrides ? "## Workflow Overrides" : null,
      overrides ? "" : null,
      overrides
        ? line([
            overrides.mode ? `- mode: ${overrides.mode}` : null,
            ...(overrides.steps || []).map((step) =>
              step.remove
                ? `- step ${step.id}: remove`
                : `- step ${step.id}: ${[
                    step.label !== undefined ? `label = ${step.label}` : null,
                    step.description !== undefined ? `description = ${step.description}` : null,
                    step.tools !== undefined ? `tools = ${step.tools.join(", ")}` : null,
                  ]
                    .filter(Boolean)
                    .join("; ")}`,
            ),
          ])
        : null,
    ]),
  };
}

/** Root index.md frontmatter extras for variant/provenance declarations. */
export function rootExtensionFrontmatter(root) {
  const out = {};
  if (root.variantOf) {
    out.variant_of = root.variantOf.baseId;
    out.variant_kind = root.variantOf.kind;
  }
  if (root.provenance) {
    const p = root.provenance;
    out.provenance_origin = p.origin;
    if (p.sourceRef) out.provenance_source_ref = p.sourceRef;
    if (p.version !== undefined) out.provenance_version = String(p.version);
    if (p.owner) out.provenance_owner = p.owner;
    if (p.status) out.provenance_status = p.status;
    if (p.createdAt) out.provenance_created_at = p.createdAt;
    if (p.lineage?.length) out.provenance_lineage = p.lineage;
  }
  return out;
}

/**
 * Render an IR's renderable collections into `{ relPath, frontmatter, body }`
 * entries (the inverse of parse for everything the property tests cover).
 * Includes a root index.md carrying the variant/provenance frontmatter.
 */
export function renderIr(ir) {
  const entries = [];
  entries.push({
    relPath: "index",
    frontmatter: {
      okf_version: "0.1",
      type: "Knowledge Bundle",
      title: "Bundle",
      ...rootExtensionFrontmatter(ir.root || {}),
    },
    body: "# Bundle\n",
  });
  for (const sys of ir.systems || []) entries.push(renderSystem(sys));
  for (const tool of ir.tools || []) entries.push(renderTool(tool));
  for (const contract of ir.groundingContracts || []) entries.push(renderGroundingContract(contract));
  for (const contract of ir.toolContracts || []) entries.push(renderToolContract(contract));
  for (const policy of ir.refusalPolicies || []) entries.push(renderStructuredPolicy("refusal", policy));
  for (const policy of ir.escalationPolicies || []) entries.push(renderStructuredPolicy("escalation", policy));
  for (const persona of ir.personas || []) entries.push(renderPersona(persona));
  for (const errorPath of ir.errorPaths || []) entries.push(renderErrorPath(errorPath));
  if (ir.slos) entries.push(renderSlo(ir.slos));
  if (ir.bindings) entries.push(renderVariantBinding(ir.bindings));
  return entries;
}

/** Render entries to concept markdown strings keyed by `<relPath>.md`. */
export function renderIrToFiles(ir) {
  const files = new Map();
  for (const entry of renderIr(ir)) {
    files.set(`${entry.relPath}.md`, renderConcept(entry.frontmatter, entry.body));
  }
  return files;
}
