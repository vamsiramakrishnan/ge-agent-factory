// @ge/okf compile — bundle → typed IR.
//
// Stage 1 of the pipeline (parse → resolve → emit). Reads a bundle's concepts
// and produces a typed intermediate representation plus structured per-concept
// errors. Two extraction passes run over the same concepts:
//
//   1. LEGACY (directory-keyed, type-blind) — a byte-compatible port of the
//      original apps/factory/scripts/okf-to-spec.mjs extraction: playbook,
//      systems/, tables/, tools/, workflow/, queries/, tests/, documents/.
//      Its output objects (and their key insertion order) are preserved
//      exactly so existing bundles compile to the same spec bytes.
//
//   2. TYPED (frontmatter-type-keyed) — the quality-bearing concept types
//      ("Grounding Contract", "Tool Contract", structured "Policy", "Persona",
//      "Error Path", "SLO", "Variant Binding", plus Query Capability
//      dependency sections and root-frontmatter variant/provenance). Each
//      grammar is deterministic: frontmatter scalars + conventional sections
//      (tables and `key: value` bullets), no free-form inference.
//
// Everything here is pure and deterministic (no clock, no randomness, no IO
// except `readBundleConcepts`).

import { readdir } from "node:fs/promises";
import { basename, join } from "node:path";

import { bodySections, extractLinks, readConceptFile, slug, GE_OKF_CONCEPT_TYPES } from "../index.mjs";
import { COMPILE_ERROR_CODES as E, compileError } from "./errors.mjs";

// ─── concept-type vocabulary ─────────────────────────────────────────────────

/** Types the legacy spec→OKF converter emits (type-blind directories aside). */
const LEGACY_EMITTED_TYPES = [
  "Knowledge Bundle", "Log", "Playbook", "Index", "Source System", "Data Entity",
  "Agent Tool", "Workflow Stage", "Source Document", "Query Capability",
  "Eval Scenario", "Claim", "Policy", "Proof Obligation", "KPIs", "Evals",
];

export const KNOWN_CONCEPT_TYPES = new Set([...GE_OKF_CONCEPT_TYPES, ...LEGACY_EMITTED_TYPES]);

const IDEMPOTENCY_VALUES = new Set(["safe", "idempotent", "effectful"]);
const CONFIRMATION_VALUES = new Set(["never", "destructive", "always"]);
const TRIGGER_KINDS = new Set(["entity_condition", "request_category", "authority_missing", "data_sensitivity"]);
const FAILURE_MODES = new Set(["rate_limited", "timeout", "conflict", "validation_error", "not_found", "permission_denied", "unavailable"]);
const ERROR_BEHAVIORS = new Set(["retry", "inform", "escalate", "degrade"]);
const PATIENCE_VALUES = new Set(["low", "medium", "high"]);
const VARIANT_KINDS = new Set(["vertical", "source-swap", "custom"]);
const PROVENANCE_ORIGINS = new Set(["interview", "deck", "migration", "variant", "manual"]);
const PROVENANCE_STATUSES = new Set(["draft", "registered", "promoted", "retired"]);
const CAPABILITY_FALLBACKS = new Set(["degrade", "refuse", "escalate"]);
const ESCALATION_ACTIONS = new Set(["escalate_to_human", "refuse", "request_more_info", "use_fallback_tool"]);
const SENSITIVITY_VALUES = new Set(["none", "personal", "sensitive", "regulated"]);

// ─── shared micro-parsers ────────────────────────────────────────────────────

/** Parse a `# Schema` markdown table into field objects (legacy, verbatim). */
function parseSchemaTable(sectionText) {
  const lines = String(sectionText || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));
  if (lines.length < 2) return [];
  const cells = (line) =>
    line
      .slice(1, line.endsWith("|") ? -1 : undefined)
      .split("|")
      .map((c) => c.trim());
  const header = cells(lines[0]).map((h) => h.toLowerCase());
  const fields = [];
  for (const row of lines.slice(2)) {
    const values = cells(row);
    if (!values[0] || values.every((v) => /^-+$/.test(v) || v === "")) continue;
    const field = {};
    header.forEach((h, i) => {
      const v = values[i];
      if (!v) return;
      if (h === "field") field.name = v;
      else if (h === "type") field.type = v;
      else if (h === "constraints") field.constraints = v;
    });
    if (field.constraints) {
      field.required = /required/.test(field.constraints);
      const valuesMatch = field.constraints.match(/values:\s*(.*)$/);
      if (valuesMatch) field.values = valuesMatch[1].split(",").map((s) => s.trim());
      delete field.constraints;
    }
    if (field.name) fields.push(field);
  }
  return fields;
}

function bullets(sectionText) {
  return String(sectionText || "")
    .split("\n")
    .map((l) => l.match(/^-\s+(.*)$/))
    .filter(Boolean)
    .map((m) => m[1].trim())
    .filter((x) => x && x !== "None specified." && !/^_.*_$/.test(x));
}

/** Strip markdown link syntax, returning the bare label. */
function delink(text) {
  return String(text || "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
}

/** Parse a generic markdown table into row objects keyed by lowercased header. */
function parseMdTable(sectionText) {
  const lines = String(sectionText || "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));
  if (lines.length < 2) return [];
  const cells = (line) =>
    line
      .slice(1, line.endsWith("|") ? -1 : undefined)
      .split("|")
      .map((c) => c.trim());
  const header = cells(lines[0]).map((h) => h.toLowerCase());
  const rows = [];
  for (const raw of lines.slice(2)) {
    const values = cells(raw);
    if (values.every((v) => /^-+$/.test(v) || v === "")) continue;
    const row = {};
    header.forEach((h, i) => {
      if (values[i]) row[h] = values[i];
    });
    if (Object.keys(row).length) rows.push(row);
  }
  return rows;
}

/** Parse `key: value` bullets into an insertion-ordered plain object. */
function kvBullets(sectionText) {
  const out = {};
  for (const item of bullets(sectionText)) {
    const m = item.match(/^([^:]+):\s*(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

/** Parse `key = value` pairs from a `; `-separated clause list. */
function eqClauses(text) {
  const out = {};
  for (const clause of String(text || "").split(";")) {
    const m = clause.match(/^\s*([^=]+?)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const asFiniteNumber = (raw) => {
  const n = Number(String(raw).trim());
  return Number.isFinite(n) ? n : null;
};

// ─── bundle IO ───────────────────────────────────────────────────────────────

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(abs)));
    else if (entry.name.endsWith(".md")) out.push(abs);
  }
  return out;
}

/**
 * Read every concept in a bundle into a Map keyed by relPath-minus-`.md`
 * (walk order preserved — the legacy extraction depends on it).
 */
export async function readBundleConcepts(root) {
  const files = await walk(root);
  const concepts = new Map();
  for (const abs of files) {
    const relNoExt = abs.slice(root.length + 1).replace(/\.md$/, "");
    const parsed = await readConceptFile(abs);
    concepts.set(relNoExt, { ...parsed, sections: bodySections(parsed.body) });
  }
  return concepts;
}

/** Build the concepts Map from in-memory `{ relPath, frontmatter, body }` entries. */
export function conceptsFromEntries(entries) {
  const concepts = new Map();
  for (const entry of entries) {
    concepts.set(entry.relPath, {
      frontmatter: entry.frontmatter || {},
      body: entry.body || "",
      sections: bodySections(entry.body || ""),
    });
  }
  return concepts;
}

// ─── IR shape ────────────────────────────────────────────────────────────────

export function makeEmptyIr() {
  return {
    root: { variantOf: null, provenance: null },
    playbook: null,
    systems: [],
    entities: [],
    tools: [],
    workflow: null,
    queries: [],
    evals: [],
    documents: [],
    // Quality-bearing extensions (typed pass):
    groundingContracts: [],
    toolContracts: [],
    refusalPolicies: [],
    escalationPolicies: [],
    personas: [],
    errorPaths: [],
    slos: null,
    capabilityDependencies: [],
    bindings: null,
    // Escalation rules contributed by variant policy overlays (resolve stage).
    escalationRules: [],
  };
}

// ─── typed-pass grammars ─────────────────────────────────────────────────────

function parseGroundingContract(id, c, errors) {
  const path = `${id}.md`;
  const claimType = c.frontmatter.claim_type || c.frontmatter.title;
  if (!claimType) {
    errors.push(compileError(E.INVALID_FIELD, path, "Grounding Contract needs `claim_type` (or `title`) frontmatter.", "add `claim_type: <claim type>` to the concept frontmatter"));
    return null;
  }
  const rawCitation = c.frontmatter.citation_required;
  let citationRequired = false;
  if (rawCitation === "true") citationRequired = true;
  else if (rawCitation !== undefined && rawCitation !== "false") {
    errors.push(compileError(E.INVALID_FIELD, path, `citation_required must be "true" or "false", got "${rawCitation}".`, 'set `citation_required: "true"` or `citation_required: "false"`'));
  }
  const evidence = parseMdTable(c.sections.Evidence).map((row) => {
    const ref = { system: delink(row.system || "") };
    if (row.tool) ref.tool = delink(row.tool);
    if (row.entity) ref.entity = delink(row.entity);
    if (row.field) ref.field = delink(row.field);
    return ref;
  }).filter((ref) => ref.system);
  if (!evidence.length) {
    errors.push(compileError(E.GROUNDING_EMPTY, path, `Grounding Contract "${claimType}" declares no evidence rows.`, "add an `## Evidence` table with System|Tool|Entity|Field columns (System required)"));
    return null;
  }
  return { claimType, evidence, citationRequired };
}

function parseToolContract(id, c, errors) {
  const path = `${id}.md`;
  const tool = c.frontmatter.tool;
  if (!tool) {
    errors.push(compileError(E.INVALID_FIELD, path, "Tool Contract needs `tool` frontmatter naming the toolIntent it governs.", "add `tool: <toolIntent name>` to the concept frontmatter"));
    return null;
  }
  const idempotency = c.frontmatter.idempotency;
  if (!IDEMPOTENCY_VALUES.has(idempotency)) {
    errors.push(compileError(E.INVALID_FIELD, path, `idempotency must be one of safe|idempotent|effectful, got "${idempotency}".`, "set `idempotency: safe` (read-only), `idempotent` (replay-safe write), or `effectful`"));
    return null;
  }
  const confirmationPolicy = c.frontmatter.confirmation_policy;
  if (!CONFIRMATION_VALUES.has(confirmationPolicy)) {
    errors.push(compileError(E.INVALID_FIELD, path, `confirmation_policy must be one of never|destructive|always, got "${confirmationPolicy}".`, "set `confirmation_policy: never`, `destructive`, or `always`"));
    return null;
  }
  return {
    tool,
    preconditions: bullets(c.sections.Preconditions).map(delink),
    postconditions: bullets(c.sections.Postconditions).map(delink),
    idempotency,
    confirmationPolicy,
  };
}

/** Structured Policy: only when frontmatter carries policy_kind + trigger_kind. */
function parseStructuredPolicy(id, c, errors) {
  const path = `${id}.md`;
  const kind = c.frontmatter.policy_kind;
  const triggerKind = c.frontmatter.trigger_kind;
  if (!kind && !triggerKind) return null; // legacy prose Policy — not ours
  if (kind !== "refusal" && kind !== "escalation") {
    errors.push(compileError(E.INVALID_FIELD, path, `policy_kind must be refusal|escalation, got "${kind}".`, "set `policy_kind: refusal` or `policy_kind: escalation`"));
    return null;
  }
  if (!TRIGGER_KINDS.has(triggerKind)) {
    errors.push(compileError(E.INVALID_FIELD, path, `trigger_kind must be one of ${[...TRIGGER_KINDS].join("|")}, got "${triggerKind}".`, "set `trigger_kind:` to one of the four typed trigger kinds"));
    return null;
  }
  const sensitivity = c.frontmatter.trigger_sensitivity;
  if (sensitivity !== undefined && !SENSITIVITY_VALUES.has(sensitivity)) {
    errors.push(compileError(E.INVALID_FIELD, path, `trigger_sensitivity must be one of ${[...SENSITIVITY_VALUES].join("|")}, got "${sensitivity}".`, "set `trigger_sensitivity: none|personal|sensitive|regulated`"));
    return null;
  }
  const response = (c.sections.Response || "").trim();
  const rationale = (c.sections.Rationale || "").trim();
  if (!response || !rationale) {
    errors.push(compileError(E.INVALID_FIELD, path, "Structured Policy needs non-empty `## Response` and `## Rationale` sections.", "add `## Response` (what the agent says/does) and `## Rationale` sections"));
    return null;
  }
  const trigger = { kind: triggerKind };
  if (c.frontmatter.trigger_entity) trigger.entity = c.frontmatter.trigger_entity;
  if (c.frontmatter.trigger_condition) trigger.condition = c.frontmatter.trigger_condition;
  if (c.frontmatter.trigger_category) trigger.category = c.frontmatter.trigger_category;
  if (c.frontmatter.trigger_authority) trigger.authority = c.frontmatter.trigger_authority;
  if (sensitivity) trigger.sensitivity = sensitivity;
  const policy = { id: c.frontmatter.source_id || basename(id), trigger, response, rationale };
  if (kind === "escalation" && c.frontmatter.handoff_target) policy.handoffTarget = c.frontmatter.handoff_target;
  return { kind, policy };
}

function parsePersona(id, c, errors) {
  const path = `${id}.md`;
  const personaId = c.frontmatter.persona_id || c.frontmatter.source_id || basename(id);
  const role = (c.sections.Role || "").trim() || c.frontmatter.title;
  if (!role) {
    errors.push(compileError(E.INVALID_FIELD, path, "Persona needs a `## Role` section (or `title` frontmatter).", "add a `## Role` section describing who this simulated user is"));
    return null;
  }
  const goals = bullets(c.sections.Goals);
  if (!goals.length) {
    errors.push(compileError(E.INVALID_FIELD, path, `Persona "${personaId}" declares no goals.`, "add a `## Goals` section with at least one `- <goal>` bullet"));
    return null;
  }
  const patience = c.frontmatter.patience;
  if (patience !== undefined && !PATIENCE_VALUES.has(patience)) {
    errors.push(compileError(E.INVALID_FIELD, path, `patience must be low|medium|high, got "${patience}".`, "set `patience: low`, `medium`, or `high` (or omit it)"));
    return null;
  }
  const adversarialRaw = c.frontmatter.adversarial;
  if (adversarialRaw !== undefined && adversarialRaw !== "true" && adversarialRaw !== "false") {
    errors.push(compileError(E.INVALID_FIELD, path, `adversarial must be "true" or "false", got "${adversarialRaw}".`, 'set `adversarial: "true"` or `adversarial: "false"` (or omit it)'));
    return null;
  }
  const persona = { id: personaId, role, goals };
  const vocabulary = (c.sections.Vocabulary || "").trim();
  if (vocabulary) persona.vocabulary = vocabulary;
  if (patience) persona.patience = patience;
  if (adversarialRaw !== undefined) persona.adversarial = adversarialRaw === "true";
  const sim = (c.sections["Simulation Instruction"] || "").trim();
  if (sim) persona.simulationInstruction = sim;
  return persona;
}

function parseErrorPath(id, c, errors) {
  const path = `${id}.md`;
  const failureMode = c.frontmatter.failure_mode;
  if (!FAILURE_MODES.has(failureMode)) {
    errors.push(compileError(E.INVALID_FIELD, path, `failure_mode must be one of ${[...FAILURE_MODES].join("|")}, got "${failureMode}".`, "set `failure_mode:` to one of the declared failure modes"));
    return null;
  }
  const behavior = c.frontmatter.behavior;
  if (!ERROR_BEHAVIORS.has(behavior)) {
    errors.push(compileError(E.INVALID_FIELD, path, `behavior must be retry|inform|escalate|degrade, got "${behavior}".`, "set `behavior: retry|inform|escalate|degrade`"));
    return null;
  }
  const node = { failureMode, behavior };
  if (c.frontmatter.max_retries !== undefined) {
    const n = asFiniteNumber(c.frontmatter.max_retries);
    if (n === null) {
      errors.push(compileError(E.INVALID_FIELD, path, `max_retries must be a number, got "${c.frontmatter.max_retries}".`, 'set `max_retries: "3"` (numeric)'));
      return null;
    }
    node.maxRetries = n;
  }
  const fallback = (c.sections.Fallback || "").trim();
  if (fallback) node.fallback = fallback;
  const overrideBullets = bullets(c.sections["Tool Overrides"]);
  if (overrideBullets.length) {
    const toolOverrides = {};
    for (const item of overrideBullets) {
      const m = item.match(/^([^:]+):\s*(.*)$/);
      if (!m) {
        errors.push(compileError(E.INVALID_FIELD, path, `Unparseable tool override bullet: "${item}".`, "use `- <tool>: behavior = <kind>; max_retries = <n>; fallback = <text>`"));
        continue;
      }
      const clauses = eqClauses(m[2]);
      const ovBehavior = clauses.behavior;
      if (!ERROR_BEHAVIORS.has(ovBehavior)) {
        errors.push(compileError(E.INVALID_FIELD, path, `Tool override for "${m[1].trim()}" needs behavior = retry|inform|escalate|degrade.`, "add `behavior = <kind>` to the override bullet"));
        continue;
      }
      const override = { behavior: ovBehavior };
      if (clauses.max_retries !== undefined) {
        const n = asFiniteNumber(clauses.max_retries);
        if (n === null) {
          errors.push(compileError(E.INVALID_FIELD, path, `Tool override max_retries must be a number, got "${clauses.max_retries}".`, "use `max_retries = <integer>`"));
          continue;
        }
        override.maxRetries = n;
      }
      if (clauses.fallback) override.fallback = clauses.fallback;
      toolOverrides[delink(m[1].trim())] = override;
    }
    if (Object.keys(toolOverrides).length) node.toolOverrides = toolOverrides;
  }
  return node;
}

function parseSlo(id, c, errors) {
  const path = `${id}.md`;
  const slos = {};
  const numeric = (raw, label, fix) => {
    const n = asFiniteNumber(raw);
    if (n === null) errors.push(compileError(E.INVALID_FIELD, path, `${label} must be a number, got "${raw}".`, fix));
    return n;
  };
  const task = kvBullets(c.sections["Task Success"]);
  if (task.definition || task.target !== undefined) {
    const target = numeric(task.target, "Task Success target", "use `- target: 0.9` (a 0.0–1.0 fraction)");
    if (task.definition && target !== null) slos.taskSuccess = { definition: task.definition, target };
    else if (!task.definition) errors.push(compileError(E.INVALID_FIELD, path, "Task Success needs a `- definition:` bullet.", "add `- definition: <what counts as success>`"));
  }
  const latency = kvBullets(c.sections.Latency);
  if (latency.p95_ttft_ms !== undefined || latency.p95_full_ms !== undefined) {
    const node = {};
    if (latency.p95_ttft_ms !== undefined) {
      const n = numeric(latency.p95_ttft_ms, "Latency p95_ttft_ms", "use `- p95_ttft_ms: 1200`");
      if (n !== null) node.p95TtftMs = n;
    }
    if (latency.p95_full_ms !== undefined) {
      const n = numeric(latency.p95_full_ms, "Latency p95_full_ms", "use `- p95_full_ms: 8000`");
      if (n !== null) node.p95FullMs = n;
    }
    if (Object.keys(node).length) slos.latency = node;
  }
  const containment = kvBullets(c.sections.Containment);
  if (containment.target !== undefined) {
    const n = numeric(containment.target, "Containment target", "use `- target: 0.75` (a 0.0–1.0 fraction)");
    if (n !== null) slos.containment = { target: n };
  }
  return Object.keys(slos).length ? slos : null;
}

function parseVariantBinding(id, c, errors) {
  const path = `${id}.md`;
  const bindings = {};
  const systemRows = parseMdTable(c.sections["System Bindings"]);
  if (systemRows.length) {
    bindings.systems = {};
    for (const row of systemRows) {
      if (row.from && row.to) bindings.systems[delink(row.from)] = delink(row.to);
      else errors.push(compileError(E.INVALID_FIELD, path, "System Bindings rows need From and To columns.", "use a `| From | To |` table with both cells filled"));
    }
  }
  const termRows = parseMdTable(c.sections.Terminology);
  if (termRows.length) {
    bindings.terminology = {};
    for (const row of termRows) {
      if (row.from && row.to) bindings.terminology[row.from] = row.to;
      else errors.push(compileError(E.INVALID_FIELD, path, "Terminology rows need From and To columns.", "use a `| From | To |` table with both cells filled"));
    }
  }
  const overlayBullets = bullets(c.sections["Policy Overlays"]);
  if (overlayBullets.length) {
    bindings.policyOverlays = [];
    for (const item of overlayBullets) {
      const m = item.match(/^(refusal|escalation):\s*(.*)$/);
      if (!m) {
        errors.push(compileError(E.INVALID_FIELD, path, `Unparseable policy overlay bullet: "${item}".`, "use `- refusal: <rule>` or `- escalation: trigger = <t>; action = <a>; handoff = <h>; rationale = <r>`"));
        continue;
      }
      if (m[1] === "refusal") {
        bindings.policyOverlays.push({ kind: "refusal", rule: m[2].trim() });
      } else {
        const clauses = eqClauses(m[2]);
        if (!clauses.trigger || !clauses.action) {
          errors.push(compileError(E.INVALID_FIELD, path, "Escalation overlay needs `trigger =` and `action =` clauses.", "use `- escalation: trigger = <t>; action = escalate_to_human; rationale = <r>`"));
          continue;
        }
        if (!ESCALATION_ACTIONS.has(clauses.action)) {
          errors.push(compileError(E.INVALID_FIELD, path, `Escalation overlay action must be one of ${[...ESCALATION_ACTIONS].join("|")}, got "${clauses.action}".`, "use `action = escalate_to_human` (or refuse/request_more_info/use_fallback_tool)"));
          continue;
        }
        const rule = { trigger: clauses.trigger, action: clauses.action, rationale: clauses.rationale || "" };
        if (clauses.handoff) rule.handoffTarget = clauses.handoff;
        bindings.policyOverlays.push({ kind: "escalation", rule });
      }
    }
    if (!bindings.policyOverlays.length) delete bindings.policyOverlays;
  }
  const overrideBullets = bullets(c.sections["Workflow Overrides"]);
  if (overrideBullets.length) {
    const overrides = {};
    const steps = [];
    for (const item of overrideBullets) {
      const modeMatch = item.match(/^mode:\s*(sequential|parallel)\s*$/);
      if (modeMatch) {
        overrides.mode = modeMatch[1];
        continue;
      }
      const stepMatch = item.match(/^step\s+([^:]+):\s*(.*)$/);
      if (!stepMatch) {
        errors.push(compileError(E.INVALID_FIELD, path, `Unparseable workflow override bullet: "${item}".`, "use `- mode: parallel`, `- step <id>: remove`, or `- step <id>: label = <text>; tools = a, b`"));
        continue;
      }
      const stepId = delink(stepMatch[1].trim());
      const rest = stepMatch[2].trim();
      const step = { id: stepId };
      if (rest === "remove") {
        step.remove = true;
      } else {
        const clauses = eqClauses(rest);
        if (clauses.label) step.label = clauses.label;
        if (clauses.description) step.description = clauses.description;
        if (clauses.tools) step.tools = clauses.tools.split(",").map((t) => delink(t.trim())).filter(Boolean);
        if (Object.keys(step).length === 1) {
          errors.push(compileError(E.INVALID_FIELD, path, `Workflow override for step "${stepId}" changes nothing.`, "add `remove`, `label = <text>`, `description = <text>`, or `tools = a, b`"));
          continue;
        }
      }
      steps.push(step);
    }
    if (steps.length) overrides.steps = steps;
    if (Object.keys(overrides).length) bindings.workflowOverrides = overrides;
  }
  return Object.keys(bindings).length ? bindings : null;
}

function parseRootExtensions(rootConcept, errors) {
  const out = { variantOf: null, provenance: null };
  if (!rootConcept) return out;
  const fm = rootConcept.frontmatter;
  const path = "index.md";
  if (fm.variant_of) {
    const kind = fm.variant_kind || "custom";
    if (!VARIANT_KINDS.has(kind)) {
      errors.push(compileError(E.INVALID_FIELD, path, `variant_kind must be vertical|source-swap|custom, got "${kind}".`, "set `variant_kind: source-swap` (or vertical/custom) in the root index.md frontmatter"));
    } else {
      out.variantOf = { baseId: fm.variant_of, kind };
    }
  }
  if (fm.provenance_origin) {
    if (!PROVENANCE_ORIGINS.has(fm.provenance_origin)) {
      errors.push(compileError(E.INVALID_FIELD, path, `provenance_origin must be one of ${[...PROVENANCE_ORIGINS].join("|")}, got "${fm.provenance_origin}".`, "set `provenance_origin:` to interview|deck|migration|variant|manual"));
    } else if (fm.provenance_status !== undefined && !PROVENANCE_STATUSES.has(fm.provenance_status)) {
      errors.push(compileError(E.INVALID_FIELD, path, `provenance_status must be one of ${[...PROVENANCE_STATUSES].join("|")}, got "${fm.provenance_status}".`, "set `provenance_status:` to draft|registered|promoted|retired"));
    } else {
      const provenance = { origin: fm.provenance_origin };
      if (fm.provenance_source_ref) provenance.sourceRef = fm.provenance_source_ref;
      if (fm.provenance_version !== undefined) provenance.version = fm.provenance_version;
      if (fm.provenance_owner) provenance.owner = fm.provenance_owner;
      if (fm.provenance_status) provenance.status = fm.provenance_status;
      if (fm.provenance_created_at) provenance.createdAt = fm.provenance_created_at;
      if (Array.isArray(fm.provenance_lineage) && fm.provenance_lineage.length) provenance.lineage = fm.provenance_lineage;
      out.provenance = provenance;
    }
  }
  return out;
}

/** Query Capability dependency sections → capabilityDependencies entries. */
function parseCapabilityDependency(queryId, c, errors) {
  const requiresBullets = bullets(c.sections["Requires Systems"]);
  if (!requiresBullets.length) return null;
  const requires = requiresBullets.map((item) => {
    const links = extractLinks(item).filter((l) => l.startsWith("systems/"));
    return links.length ? basename(links[0]) : delink(item);
  });
  const node = { capability: queryId, requires };
  const fallbackText = bullets(c.sections.Fallback)[0] || (c.sections.Fallback || "").trim();
  if (fallbackText) {
    const m = fallbackText.match(/^(degrade|refuse|escalate)\s*(?::\s*(.*))?$/);
    if (!m) {
      errors.push(compileError(E.INVALID_FIELD, `${queryId}.md`, `Fallback must start with degrade|refuse|escalate, got "${fallbackText}".`, "use `- degrade: <what still works>`, `- refuse`, or `- escalate: <to whom>`"));
    } else {
      node.fallback = m[1];
      if (m[2]) node.fallbackDetail = m[2].trim();
    }
  }
  return node;
}

// ─── the parse pass ──────────────────────────────────────────────────────────

/**
 * Parse a bundle's concepts (Map relPath → {frontmatter, body, sections}) into
 * `{ ir, errors }`. Never throws on content: malformed concepts become
 * structured errors and are excluded from the IR (visibly, not silently).
 */
export function parseBundle(concepts) {
  const errors = [];
  const ir = makeEmptyIr();

  const get = (id) => concepts.get(id);
  const inDir = (dir) =>
    [...concepts.entries()]
      .filter(([id]) => id.startsWith(`${dir}/`) && basename(id) !== "index")
      .map(([id, c]) => ({ id, ...c }));

  // Original id of a concept: prefer the persisted `source_id` frontmatter
  // (written by spec-to-okf), else fall back to the slugged filename.
  const sourceId = (concept) => {
    const sid = concept && concept.frontmatter && concept.frontmatter.source_id;
    return (typeof sid === "string" && sid) ? sid : null;
  };
  const originalIdForLink = (linkId) => {
    const c = get(linkId);
    return sourceId(c) || basename(linkId);
  };

  // ── unknown-type detection (whole bundle, reserved paths excluded) ────────
  for (const [id, c] of concepts.entries()) {
    const name = basename(id);
    if (name === "index" || name === "log") continue;
    const type = String(c.frontmatter.type || "").trim();
    if (!type) {
      errors.push(compileError(E.UNKNOWN_CONCEPT_TYPE, `${id}.md`, "Concept frontmatter.type is missing (required by base OKF conformance).", "add `type: <concept type>` to the frontmatter"));
    } else if (!KNOWN_CONCEPT_TYPES.has(type)) {
      errors.push(compileError(E.UNKNOWN_CONCEPT_TYPE, `${id}.md`, `Unknown concept type "${type}".`, `use one of the GE profile types (see geOkfProfile().conceptTypes) or remove the concept`));
    }
  }

  // ── LEGACY extraction (byte-compatible port of okf-to-spec.mjs) ───────────
  const playbook = get("playbook");
  if (playbook) {
    const s = playbook.sections;
    ir.playbook = {
      role: (s.Role || "").trim() || undefined,
      primaryObjective: (s["Primary objective"] || "").trim() || undefined,
      inScope: bullets(s["In scope"]),
      outOfScope: bullets(s["Out of scope"]),
      refusalRules: bullets(s["Refusal rules"]),
    };
  }

  ir.systems = inDir("systems").map((c) => {
    const fm = c.frontmatter;
    const protoMatch = (c.body || "").match(/\*\*Protocol:\*\*\s*([^\n]+)/);
    const schema = c.sections.Schema || "";
    const owns = extractLinks(schema)
      .filter((l) => l.startsWith("tables/"))
      .map((l) => basename(l));
    return {
      id: c.id.replace(/^systems\//, ""),
      name: fm.title || c.id,
      protocol: protoMatch ? protoMatch[1].trim().replace(/—/, "").trim() || undefined : undefined,
      owns,
    };
  });

  ir.entities = inDir("tables").map((c) => {
    const ownerLink = extractLinks(c.sections.Citations || c.body).find((l) => l.startsWith("systems/"));
    return {
      name: c.frontmatter.title || c.id.replace(/^tables\//, ""),
      sourceSystemId: ownerLink ? basename(ownerLink) : undefined,
      fields: parseSchemaTable(c.sections.Schema),
    };
  });

  ir.tools = inDir("tools").map((c) => {
    const s = c.sections;
    const sysLink = extractLinks(c.body).find((l) => l.startsWith("systems/"));
    const kindMatch = (c.body || "").match(/\*\*Kind:\*\*\s*([^\n]+)/);
    return {
      name: c.frontmatter.title || basename(c.id),
      kind: kindMatch ? kindMatch[1].trim() : undefined,
      sourceSystemId: sysLink ? basename(sysLink) : undefined,
      description: c.frontmatter.description || undefined,
      requiredInputs: bullets(s["Required inputs"]),
      produces: bullets(s.Produces),
      evidenceEmitted: bullets(s["Evidence emitted"]),
    };
  });

  const workflowIndex = get("workflow/index");
  if (workflowIndex) {
    const modeMatch = (workflowIndex.body || "").match(/\*\*Mode:\*\*\s*([^\n]+)/);
    const orderedLinks = extractLinks(workflowIndex.body).filter((l) => l.startsWith("workflow/"));
    const stepConcepts = new Map(inDir("workflow").map((c) => [c.id, c]));
    const steps = orderedLinks
      .map((linkId) => stepConcepts.get(linkId))
      .filter(Boolean)
      .map((c) => ({
        id: sourceId(c) || c.id.replace(/^workflow\//, ""),
        label: c.frontmatter.title || basename(c.id),
        description: c.frontmatter.description || (c.sections._preamble || "").trim() || undefined,
        tools: extractLinks(c.sections.Tools || "")
          .filter((l) => l.startsWith("tools/"))
          .map((l) => {
            const tool = ir.tools.find((t) => `tools/${slug(t.name)}` === l);
            return tool ? tool.name : delink(basename(l));
          }),
      }));
    ir.workflow = { mode: modeMatch ? modeMatch[1].trim() : "sequential", steps };
  }

  const toolNameByConcept = new Map(ir.tools.map((t) => [`tools/${slug(t.name)}`, t.name]));
  const toolNameFromLink = (l) => toolNameByConcept.get(l) || basename(l);

  const queryConcepts = inDir("queries");
  ir.queries = queryConcepts.map((c) => {
    const s = c.sections;
    const tools = extractLinks(s["Tools used"] || "")
      .filter((l) => l.startsWith("tools/"))
      .map(toolNameFromLink);
    const stageLink = extractLinks(s["Runs in"] || "").find((l) => l.startsWith("workflow/"));
    return {
      id: sourceId(c) || c.id.replace(/^queries\//, ""),
      request: c.frontmatter.description || (c.sections._preamble || "").replace(/^#\s*/, "").trim() || c.id,
      tools,
      evidence: bullets(s["Evidence expected"]),
      stage: stageLink ? originalIdForLink(stageLink) : undefined,
    };
  });

  ir.evals = inDir("tests").map((c) => {
    const s = c.sections;
    const mechanisms = extractLinks(s["Mechanisms to call"] || "")
      .filter((l) => l.startsWith("tools/"))
      .map(toolNameFromLink);
    const validatesLink = extractLinks(s.Validates || "").find((l) => l.startsWith("queries/"));
    const rubric = (s["Success rubric"] || "").trim();
    return {
      id: sourceId(c) || c.id.replace(/^tests\//, ""),
      prompt: c.frontmatter.description || (c.sections._preamble || "").replace(/^#\s*/, "").trim() || c.id,
      mechanisms,
      expectedToolCalls: mechanisms,
      expectedActionOutcome: rubric || undefined,
      validates: validatesLink ? originalIdForLink(validatesLink) : undefined,
    };
  });

  ir.documents = inDir("documents").map((c) => {
    const typeMatch = (c.body || "").match(/\*\*Type:\*\*\s*([^\n]+)/);
    return {
      id: sourceId(c) || c.id.replace(/^documents\//, ""),
      title: c.frontmatter.title || basename(c.id),
      type: typeMatch ? typeMatch[1].trim() : "document",
      anchors: bullets(c.sections["Citation anchors"]),
    };
  });

  // ── TYPED extraction (new concept types, sorted by concept id) ────────────
  const byType = (type) =>
    [...concepts.entries()]
      .filter(([id, c]) => basename(id) !== "index" && basename(id) !== "log" && String(c.frontmatter.type || "").trim() === type)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([id, c]) => ({ id, ...c }));

  for (const c of byType("Grounding Contract")) {
    const node = parseGroundingContract(c.id, c, errors);
    if (node) ir.groundingContracts.push(node);
  }
  for (const c of byType("Tool Contract")) {
    const node = parseToolContract(c.id, c, errors);
    if (node) ir.toolContracts.push(node);
  }
  for (const c of byType("Policy")) {
    const parsed = parseStructuredPolicy(c.id, c, errors);
    if (!parsed) continue;
    if (parsed.kind === "refusal") ir.refusalPolicies.push(parsed.policy);
    else ir.escalationPolicies.push(parsed.policy);
  }
  for (const c of byType("Persona")) {
    const node = parsePersona(c.id, c, errors);
    if (node) ir.personas.push(node);
  }
  for (const c of byType("Error Path")) {
    const node = parseErrorPath(c.id, c, errors);
    if (node) ir.errorPaths.push(node);
  }
  for (const c of byType("SLO")) {
    const node = parseSlo(c.id, c, errors);
    if (node) ir.slos = { ...(ir.slos || {}), ...node };
  }
  for (const c of byType("Variant Binding")) {
    const node = parseVariantBinding(c.id, c, errors);
    if (!node) continue;
    const merged = ir.bindings || {};
    if (node.systems) merged.systems = { ...(merged.systems || {}), ...node.systems };
    if (node.terminology) merged.terminology = { ...(merged.terminology || {}), ...node.terminology };
    if (node.policyOverlays) merged.policyOverlays = [...(merged.policyOverlays || []), ...node.policyOverlays];
    if (node.workflowOverrides) {
      merged.workflowOverrides = {
        ...(merged.workflowOverrides || {}),
        ...node.workflowOverrides,
        steps: [...(merged.workflowOverrides?.steps || []), ...(node.workflowOverrides.steps || [])],
      };
      if (!merged.workflowOverrides.steps.length) delete merged.workflowOverrides.steps;
    }
    ir.bindings = merged;
  }

  // Capability dependencies ride on Query Capability concepts.
  for (const c of queryConcepts) {
    const queryId = sourceId(c) || c.id.replace(/^queries\//, "");
    const node = parseCapabilityDependency(queryId, c, errors);
    if (node) ir.capabilityDependencies.push(node);
  }

  ir.root = parseRootExtensions(get("index"), errors);

  return { ir, errors };
}
