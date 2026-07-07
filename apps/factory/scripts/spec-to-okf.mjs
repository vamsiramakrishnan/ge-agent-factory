#!/usr/bin/env node
// spec-to-okf.mjs
//
// Convert a GE use-case agent spec into a conformant OKF v0.1 Knowledge Bundle.
//
//   node scripts/spec-to-okf.mjs --id <useCaseId> [--out <dir>]
//   node scripts/spec-to-okf.mjs --spec <path.json>  [--out <dir>]
//
// Default out dir: artifacts/okf/<id>/
//
// Mapping (spec -> OKF concept):
//   spec.{persona,subtitle,behaviorContract}      -> index.md   (Knowledge Bundle, root, okf_version)
//   (generation time)                             -> log.md     (chronological history)
//   behaviorContract.{role,scope,rules}           -> playbook.md (Playbook)
//   generationSpec.sourceSystems[]               -> systems/<id>.md (Source System)
//   generationSpec.entities[]                    -> tables/<entity>.md (Data Entity)
//   behaviorContract.toolIntents[]               -> tools/<name>.md (Agent Tool)
//   behaviorContract.workflow.steps[]            -> workflow/<step>.md (Workflow Stage)
//   spec.kpis[]                                  -> kpis.md (KPIs)
//   behaviorContract.goldenEvals[]              -> evals.md (Evals)

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  OKF_VERSION,
  findUseCase,
  joinBundle,
  link,
  renderConcept,
  slug,
  writeConceptFile,
} from "@ge/okf";
import {
  deriveAnswerableQueries,
  deriveTestMechanisms,
  specDocuments,
} from "./lib/okf-capabilities.mjs";
import {
  body,
  bullets,
  entityFields,
  fieldName,
  mdTable,
} from "./factory/okf/markdown.mjs";
import { getUseCases } from "../src/use-cases.js";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(SCRIPT_DIR, "..");

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--id") args.id = argv[++i];
    else if (token === "--spec") args.spec = argv[++i];
    else if (token === "--out") args.out = argv[++i];
    else if (token === "--help" || token === "-h") args.help = true;
  }
  return args;
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && String(item).length);
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function compactList(items) {
  return (items || []).filter((item) => item !== undefined && item !== null && String(item).length);
}

function isWriteLikeTool(tool = {}) {
  const text = [tool.name, tool.kind, tool.description].filter(Boolean).join(" ").toLowerCase();
  return /\b(action|write|create|update|delete|post|submit|approve|execute|close|send|notify)\b/.test(text);
}

function policyText(policy) {
  if (policy.kind === "refusal") return policy.rule;
  if (policy.kind === "escalation") {
    return [
      policy.rule?.trigger ? `When ${policy.rule.trigger}` : null,
      policy.rule?.action ? `action: ${policy.rule.action}` : null,
      policy.rule?.handoffTarget ? `handoff: ${policy.rule.handoffTarget}` : null,
    ]
      .filter(Boolean)
      .join("; ");
  }
  return policy.rule || policy.title;
}

function specGeneratedFields({ source, inferred = false, from } = {}) {
  return {
    source_kind: "generationSpec",
    source_path: source || from,
    generation_status: inferred ? "inferred" : "generated",
    ge_status: inferred ? "inferred" : "generated",
  };
}

/**
 * Build the in-memory bundle (list of `{ relPath, fields, body }` concepts)
 * from a spec. Pure: takes the spec, returns concepts — easy to test.
 */
export function buildBundle(spec, { timestamp = new Date().toISOString() } = {}) {
  const gen = spec.generationSpec || {};
  const bc = gen.behaviorContract || {};
  const id = spec.id || slug(spec.title || "agent-spec");
  const department = spec.department || "";
  const tags = [department, "okf", "brd"].filter(Boolean);
  const objective = bc.primaryObjective || spec.subtitle || spec.title || id;

  const sourceSystems = gen.sourceSystems || [];
  const entities = gen.entities || [];
  const toolIntents = bc.toolIntents || [];
  const apis = gen.apis || [];
  const workflow = bc.workflow && Array.isArray(bc.workflow.steps) ? bc.workflow : null;

  // --- id maps (stable, slugged, collision-disambiguated) ------------------
  // Per concept-kind we keep a set of slugs already taken; when two source ids
  // slug to the same value (e.g. `notify_manager` and `notify-manager`), the
  // second deterministically gets `-2`, the third `-3`, ... so no concept file
  // silently overwrites another. The SAME disambiguated slug is used for the
  // concept's relPath AND every link/reference to it (via these maps).
  const makeSlugger = () => {
    const used = new Set();
    const assigned = new Map(); // sourceKey -> slug
    return (sourceKey, raw) => {
      if (assigned.has(sourceKey)) return assigned.get(sourceKey);
      const base = slug(raw);
      let candidate = base;
      let n = 1;
      while (used.has(candidate)) {
        n += 1;
        candidate = `${base}-${n}`;
      }
      used.add(candidate);
      assigned.set(sourceKey, candidate);
      return candidate;
    };
  };

  const slugSystem = makeSlugger();
  const slugEntity = makeSlugger();
  const slugTool = makeSlugger();
  const slugStep = makeSlugger();

  const systemSlug = new Map(); // sourceSystemId -> slug
  for (const sys of sourceSystems) systemSlug.set(sys.id, slugSystem(sys.id, sys.id || sys.name));
  const entitySlug = new Map(); // entity name -> slug
  for (const ent of entities) entitySlug.set(ent.name, slugEntity(ent.name, ent.name));
  const toolSlug = new Map(); // tool name -> slug
  for (const tool of toolIntents) toolSlug.set(tool.name, slugTool(tool.name, tool.name));
  const stepSlug = new Map(); // step id -> slug
  if (workflow) for (const step of workflow.steps) stepSlug.set(step.id, slugStep(step.id, step.id || step.label));

  const sysConceptId = (sysId) => `systems/${systemSlug.get(sysId) || slug(sysId)}`;
  const entConceptId = (name) => `tables/${entitySlug.get(name) || slug(name)}`;
  const toolConceptId = (name) => `tools/${toolSlug.get(name) || slug(name)}`;
  const stepConceptId = (sid) => `workflow/${stepSlug.get(sid) || slug(sid)}`;
  const actionApiForTool = (tool) =>
    apis.find((api) => {
      if (tool.apiId && api.id === tool.apiId) return true;
      if (api.sourceSystemId && tool.sourceSystemId && api.sourceSystemId !== tool.sourceSystemId) return false;
      const method = String(api.method || "").toUpperCase();
      const path = String(api.path || api.id || "").toLowerCase();
      return isWriteLikeTool(tool) && ["POST", "PUT", "PATCH", "DELETE"].includes(method) && path.includes(String(tool.name || "").split("_").at(-1));
    }) || (isWriteLikeTool(tool)
      ? apis.find((api) => api.sourceSystemId === tool.sourceSystemId && ["POST", "PUT", "PATCH", "DELETE"].includes(String(api.method || "").toUpperCase()))
      : null);
  const toolPermissions = (tool, api) => compactList([
    ...asArray(tool.permissions),
    ...asArray(tool.requiredPermissions),
    ...asArray(api?.permissions),
    ...asArray(api?.requiredPermissions),
  ]);
  const toolFailureModes = (tool, api) => compactList([
    ...asArray(tool.failureModes),
    ...(api?.failureModes && !Array.isArray(api.failureModes) ? Object.keys(api.failureModes) : asArray(api?.failureModes)),
  ]);

  // Reverse indexes for relationship edges.
  const toolsBySystem = new Map(); // sysId -> [toolName]
  for (const tool of toolIntents) {
    if (!tool.sourceSystemId) continue;
    if (!toolsBySystem.has(tool.sourceSystemId)) toolsBySystem.set(tool.sourceSystemId, []);
    toolsBySystem.get(tool.sourceSystemId).push(tool.name);
  }
  const entitiesBySystem = new Map(); // sysId -> [entityName]
  for (const ent of entities) {
    const sid = ent.sourceSystemId;
    if (!sid) continue;
    if (!entitiesBySystem.has(sid)) entitiesBySystem.set(sid, []);
    entitiesBySystem.get(sid).push(ent.name);
  }
  // Fall back to a system's declared `owns` list if entities lack sourceSystemId.
  for (const sys of sourceSystems) {
    if (!Array.isArray(sys.owns)) continue;
    for (const owned of sys.owns) {
      if (entities.some((e) => e.name === owned) && !entitiesBySystem.get(sys.id)?.includes(owned)) {
        if (!entitiesBySystem.has(sys.id)) entitiesBySystem.set(sys.id, []);
        if (!entitiesBySystem.get(sys.id).includes(owned)) entitiesBySystem.get(sys.id).push(owned);
      }
    }
  }
  const stepsByTool = new Map(); // toolName -> [stepId]
  if (workflow) {
    for (const step of workflow.steps) {
      for (const t of step.tools || []) {
        if (!stepsByTool.has(t)) stepsByTool.set(t, []);
        stepsByTool.get(t).push(step.id);
      }
    }
  }

  const concepts = [];
  const push = (relPath, fields, body) => concepts.push({ relPath, fields, body });

  // --- root index.md -------------------------------------------------------
  const sectionLinks = [
    link("playbook", "Playbook — role, scope, guardrails"),
    link("systems/index", "Source Systems"),
    link("tables/index", "Data Entities"),
    link("tools/index", "Agent Tools"),
  ];
  if (workflow) sectionLinks.push(link("workflow/index", "Workflow Stages"));
  // Capability spine: what the agent answers + how each is tested + sources.
  const answerableQueries = deriveAnswerableQueries(bc);
  const testMechanisms = deriveTestMechanisms(bc);
  const documents = specDocuments(spec);
  const evidenceRequirements = Array.isArray(bc.evidenceRequirements) ? bc.evidenceRequirements : [];
  const goldenEvals = Array.isArray(bc.goldenEvals) ? bc.goldenEvals : [];
  const claims = evidenceRequirements
    .map((req, index) => ({
      id: req?.id || slug(req?.claim || (typeof req === "string" ? req : `evidence-requirement-${index + 1}`)),
      claim: typeof req === "string" ? req : req?.claim,
      mustCite: typeof req === "string" ? [] : asArray(req?.mustCite),
      sourceSystemIds: typeof req === "string" ? [] : asArray(req?.sourceSystemIds),
      sourceIndex: index,
    }))
    .filter((claim) => claim.claim);
  const policyConcepts = [
    ...(bc.refusalRules || []).map((rule, index) => ({
      id: `refusal-${index + 1}`,
      kind: "refusal",
      title: `Refusal policy ${index + 1}`,
      rule,
      source: `behaviorContract.refusalRules.${index}`,
    })),
    ...(bc.escalationRules || []).map((rule, index) => ({
      id: `escalation-${index + 1}`,
      kind: "escalation",
      title: `Escalation policy ${index + 1}`,
      rule,
      source: `behaviorContract.escalationRules.${index}`,
    })),
    ...toolIntents.flatMap((tool) => {
      const api = actionApiForTool(tool);
      const out = [];
      if (isWriteLikeTool(tool)) {
        out.push({
          id: `confirmation-${toolSlug.get(tool.name) || slug(tool.name)}`,
          kind: "tool confirmation",
          title: `Confirmation policy — ${tool.name}`,
          toolName: tool.name,
          rule: `Confirm before invoking write-like tool ${tool.name}.`,
          source: `behaviorContract.toolIntents.${tool.name}`,
          inferred: true,
        });
      }
      const idempotency = tool.idempotencyKey || tool.idempotency_key || api?.idempotencyKey;
      if (idempotency || asArray(tool.requiredInputs).some((input) => /idempotency[_-]?key/i.test(input))) {
        out.push({
          id: `idempotency-${toolSlug.get(tool.name) || slug(tool.name)}`,
          kind: "tool idempotency",
          title: `Idempotency policy — ${tool.name}`,
          toolName: tool.name,
          rule: idempotency ? `Use idempotency key ${idempotency} for ${tool.name}.` : `Supply the declared idempotency key input for ${tool.name}.`,
          source: api?.id ? `generationSpec.apis.${api.id}` : `behaviorContract.toolIntents.${tool.name}`,
          inferred: !idempotency,
        });
      }
      return out;
    }),
  ];
  const proofObligations = [
    ...claims.map((claim) => ({
      id: `evidence-${claim.id}`,
      kind: "evidence requirement",
      title: `Evidence obligation — ${claim.claim}`,
      source: `behaviorContract.evidenceRequirements.${claim.sourceIndex}`,
      claimId: claim.id,
      mustCite: claim.mustCite,
      sourceSystemIds: claim.sourceSystemIds,
    })),
    ...testMechanisms.map((test, index) => {
      const sourceEval = goldenEvals.find((entry) => entry && typeof entry === "object" && entry.id === test.id) || goldenEvals[index] || {};
      return {
        id: `eval-${test.id}`,
        kind: "golden eval",
        title: `Golden eval obligation — ${test.prompt}`,
        source: `behaviorContract.goldenEvals.${index}`,
        evalId: test.id,
        mechanisms: test.mechanisms || sourceEval.expectedToolCalls || [],
        mustCiteDocuments: test.mustCiteDocuments?.length ? test.mustCiteDocuments : sourceEval.mustCiteDocuments || [],
        mustReferenceEntities: test.mustReferenceEntities?.length ? test.mustReferenceEntities : sourceEval.mustReferenceEntities || [],
        forbiddenBehaviors: test.forbiddenBehaviors?.length ? test.forbiddenBehaviors : sourceEval.forbiddenBehaviors || [],
        validates: test.validates,
      };
    }),
  ];
  if (answerableQueries.length) sectionLinks.push(link("queries/index", "Query Capabilities"));
  if (testMechanisms.length) sectionLinks.push(link("tests/index", "Eval Scenarios"));
  if (documents.length) sectionLinks.push(link("documents/index", "Source Documents"));
  if (claims.length) sectionLinks.push(link("claims/index", "Claims"));
  if (policyConcepts.length) sectionLinks.push(link("policies/index", "Policies"));
  if (proofObligations.length) sectionLinks.push(link("proof-obligations/index", "Proof Obligations"));
  sectionLinks.push(link("kpis", "KPIs"));
  sectionLinks.push(link("evals", "Golden Evals"));

  const kpiSummary = (spec.kpis || [])
    .map((k) => `- **${k.label}**: ${k.before} → ${k.after}`)
    .join("\n");

  const slugClaim = makeSlugger();
  const claimSlug = new Map();
  for (const claim of claims) claimSlug.set(claim.id, slugClaim(claim.id, claim.id));
  const claimConceptId = (claimId) => `claims/${claimSlug.get(claimId) || slug(claimId)}`;

  const slugPolicy = makeSlugger();
  const policySlug = new Map();
  for (const policy of policyConcepts) policySlug.set(policy.id, slugPolicy(policy.id, policy.id));
  const policyConceptId = (policyId) => `policies/${policySlug.get(policyId) || slug(policyId)}`;

  const slugProof = makeSlugger();
  const proofSlug = new Map();
  for (const proof of proofObligations) proofSlug.set(proof.id, slugProof(proof.id, proof.id));
  const proofConceptId = (proofId) => `proof-obligations/${proofSlug.get(proofId) || slug(proofId)}`;

  const policiesByTool = new Map();
  for (const policy of policyConcepts) {
    if (!policy.toolName) continue;
    if (!policiesByTool.has(policy.toolName)) policiesByTool.set(policy.toolName, []);
    policiesByTool.get(policy.toolName).push(policy);
  }
  const evalsByTool = new Map();
  for (const evalScenario of testMechanisms) {
    for (const toolName of evalScenario.mechanisms || evalScenario.expectedToolCalls || []) {
      if (!evalsByTool.has(toolName)) evalsByTool.set(toolName, []);
      evalsByTool.get(toolName).push(evalScenario);
    }
  }
  const slugTest = makeSlugger();
  const testSlug = new Map(); // test id -> slug
  for (const t of testMechanisms) testSlug.set(t.id, slugTest(t.id, t.id));
  const testConceptId = (tid) => `tests/${testSlug.get(tid) || slug(tid)}`;

  push(
    "index",
    {
      okf_version: OKF_VERSION,
      type: "Knowledge Bundle",
      title: spec.title || id,
      description: objective,
      tags,
      timestamp,
    },
    [
      `# ${spec.title || id}`,
      "",
      spec.subtitle ? `> ${spec.subtitle}` : "",
      "",
      "## Overview",
      "",
      `- **Persona:** ${spec.persona || "—"}`,
      `- **Department:** ${department || "—"}`,
      `- **Objective:** ${objective}`,
      "",
      "## KPI summary",
      "",
      kpiSummary || "_No KPIs defined._",
      "",
      "## Contents",
      "",
      sectionLinks.map((l) => `- ${l}`).join("\n"),
    ].join("\n"),
  );

  // --- log.md --------------------------------------------------------------
  push(
    "log",
    { type: "Log", title: "History", timestamp },
    ["# Log", "", `- ${timestamp} — Generated from spec \`${id}\` at ${timestamp}.`].join("\n"),
  );

  // --- playbook.md ---------------------------------------------------------
  push(
    "playbook",
    {
      type: "Playbook",
      title: `${spec.title || id} — Playbook`,
      description: `Operating contract for the ${spec.title || id} agent.`,
      tags,
      timestamp,
    },
    [
      "# Playbook",
      "",
      "## Role",
      "",
      bc.role || "_Not specified._",
      "",
      "## Primary objective",
      "",
      objective,
      "",
      "## In scope",
      "",
      bullets(bc.inScope),
      "",
      "## Out of scope",
      "",
      bullets(bc.outOfScope),
      "",
      "## Escalation rules",
      "",
      (bc.escalationRules || []).length
        ? mdTable(
            ["Trigger", "Action", "Rationale"],
            (bc.escalationRules || []).map((r) => [r.trigger, r.action, r.rationale]),
          )
        : "_None specified._",
      "",
      "## Refusal rules",
      "",
      bullets(bc.refusalRules),
      "",
      "## Hard guardrails",
      "",
      bullets([
        ...(bc.refusalRules || []),
        bc.evidenceRequirements?.length ? "Every published claim must cite its source-system evidence (see evidence requirements)." : null,
      ]),
      "",
      "## See also",
      "",
      `- ${link("tools/index", "Agent Tools")}`,
      workflow ? `- ${link("workflow/index", "Workflow Stages")}` : null,
      documents.length ? "" : null,
      documents.length ? "# Citations" : null,
      documents.length ? "" : null,
      documents.length
        ? documents.map((d) => `- ${link(`documents/${slug(d.id)}`, d.title || d.id)}`).join("\n")
        : null,
    ]
      .filter((x) => x !== null)
      .join("\n"),
  );

  // --- systems/ ------------------------------------------------------------
  const connByName = new Map();
  for (const conn of spec.architecture?.connections || []) connByName.set(conn.system, conn);

  push(
    "systems/index",
    { type: "Index", title: "Source Systems", timestamp },
    [
      "# Source Systems",
      "",
      sourceSystems.length
        ? sourceSystems.map((s) => `- ${link(sysConceptId(s.id), s.name || s.id)}`).join("\n")
        : "_No source systems._",
    ].join("\n"),
  );

  for (const sys of sourceSystems) {
    const conn = connByName.get(sys.name) || connByName.get(sys.id);
    const ownedEntities = entitiesBySystem.get(sys.id) || sys.owns || [];
    const usingTools = toolsBySystem.get(sys.id) || [];
    push(
      sysConceptId(sys.id),
      {
        type: "Source System",
        title: sys.name || sys.id,
        description: conn?.description || `${sys.name || sys.id} source system.`,
        resource: sys.resource || undefined,
        tags,
        timestamp,
      },
      body([
        `# ${sys.name || sys.id}`,
        "",
        conn?.description ? conn.description : null,
        conn?.description ? "" : null,
        `- **Protocol:** ${sys.protocol || conn?.protocol || "—"}`,
        sys.localBacking?.length ? `- **Local backing:** ${sys.localBacking.join(", ")}` : null,
        "",
        "# Schema",
        "",
        ownedEntities.length
          ? ownedEntities
              .map((name) => (entities.some((e) => e.name === name) ? `- ${link(entConceptId(name), name)}` : `- ${name}`))
              .join("\n")
          : "_No entities._",
        "",
        "## Tools using this system",
        "",
        usingTools.length ? usingTools.map((t) => `- ${link(toolConceptId(t), t)}`).join("\n") : "_None._",
      ]),
    );
  }

  // --- tables/ -------------------------------------------------------------
  push(
    "tables/index",
    { type: "Index", title: "Data Entities", timestamp },
    [
      "# Data Entities",
      "",
      entities.length
        ? entities.map((e) => `- ${link(entConceptId(e.name), e.name)}`).join("\n")
        : "_No data entities._",
    ].join("\n"),
  );

  for (const ent of entities) {
    const fields = entityFields(ent);
    const rows = fields.map((f) => {
      if (typeof f === "string") return [f, "", ""];
      const constraints = [
        f.required ? "required" : "",
        f.primaryKey || ent.primaryKey === f.name ? "primary key" : "",
        Array.isArray(f.values) ? `values: ${f.values.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("; ");
      return [fieldName(f), f.type || "", constraints];
    });
    const ownerSys = sourceSystems.find((s) => s.id === ent.sourceSystemId || (Array.isArray(s.owns) && s.owns.includes(ent.name)));
    push(
      entConceptId(ent.name),
      {
        type: "Data Entity",
        title: ent.name,
        description: `Data entity ${ent.name}${ownerSys ? ` owned by ${ownerSys.name || ownerSys.id}` : ""}.`,
        tags,
        timestamp,
      },
      body([
        `# ${ent.name}`,
        "",
        "# Schema",
        "",
        rows.length ? mdTable(["Field", "Type", "Constraints"], rows) : "_No fields defined._",
        "",
        ownerSys ? `# Citations\n\n- Owned by ${link(sysConceptId(ownerSys.id), ownerSys.name || ownerSys.id)}` : null,
      ]),
    );
  }

  // --- tools/ --------------------------------------------------------------
  push(
    "tools/index",
    { type: "Index", title: "Agent Tools", timestamp },
    [
      "# Agent Tools",
      "",
      toolIntents.length
        ? toolIntents.map((t) => `- ${link(toolConceptId(t.name), t.name)}`).join("\n")
        : "_No tools._",
    ].join("\n"),
  );

  for (const tool of toolIntents) {
    const ownerSys = sourceSystems.find((s) => s.id === tool.sourceSystemId);
    const usingSteps = stepsByTool.get(tool.name) || [];
    const sampleArgs = (tool.requiredInputs || []).map((i) => `${i}=<${i}>`).join(", ");
    const api = actionApiForTool(tool);
    const isWriteTool = isWriteLikeTool(tool);
    const idempotency = tool.idempotencyKey || tool.idempotency_key || api?.idempotencyKey;
    const permissions = toolPermissions(tool, api);
    const failureModes = toolFailureModes(tool, api);
    const relatedPolicies = policiesByTool.get(tool.name) || [];
    const relatedEvals = evalsByTool.get(tool.name) || [];
    const sideEffects = compactList([
      ...asArray(tool.sideEffects),
      ...asArray(tool.side_effects),
      isWriteTool ? `May change ${ownerSys?.name || tool.sourceSystemId || "the source system"} state because the spec classifies it as ${tool.kind || "write-like"}.` : null,
      !isWriteTool ? "No mutation is declared by the spec for this tool." : null,
    ]);
    push(
      toolConceptId(tool.name),
      {
        type: "Agent Tool",
        title: tool.name,
        description: tool.description || `${tool.kind || "tool"} tool ${tool.name}.`,
        tags,
        timestamp,
        ...specGeneratedFields({ source: "behaviorContract.toolIntents", inferred: false }),
      },
      body([
        `# ${tool.name}`,
        "",
        tool.description || null,
        tool.description ? "" : null,
        `- **Kind:** ${tool.kind || "—"}`,
        `- **Source system:** ${ownerSys ? link(sysConceptId(ownerSys.id), ownerSys.name || ownerSys.id) : tool.sourceSystemId || "—"}`,
        api ? `- **API:** ${api.method || ""} ${api.path || api.id}`.trim() : null,
        "",
        "## Inputs",
        "",
        bullets(tool.requiredInputs),
        "",
        "## Outputs",
        "",
        bullets(tool.produces),
        "",
        "## Side Effects",
        "",
        bullets(sideEffects),
        "",
        "## Idempotency",
        "",
        idempotency
          ? `Declared idempotency key: ${idempotency}.`
          : isWriteTool
            ? "No idempotency key is declared in the spec or matched API; require one before production writes."
            : "No idempotency key declared; no mutation is declared by the spec for this tool.",
        "",
        "## Confirmation",
        "",
        relatedPolicies.some((policy) => policy.kind === "tool confirmation")
          ? relatedPolicies.filter((policy) => policy.kind === "tool confirmation").map((policy) => `- ${link(policyConceptId(policy.id), policy.title)}`).join("\n")
          : isWriteTool
            ? "Write-like tool; confirmation policy is inferred from the tool kind."
            : "No write confirmation policy is derivable from the spec.",
        "",
        "## Permissions",
        "",
        permissions.length
          ? bullets(permissions)
          : ownerSys
            ? `No explicit permission scopes declared; source-system access is tied to ${link(sysConceptId(ownerSys.id), ownerSys.name || ownerSys.id)}.`
            : "No source-system permission profile declared.",
        "",
        "## Failure Modes",
        "",
        failureModes.length ? bullets(failureModes) : "No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.",
        "",
        "## Used By",
        "",
        usingSteps.length
          ? usingSteps.map((sid) => `- ${link(stepConceptId(sid), sid)}`).join("\n")
          : "_Not bound to a workflow stage._",
        "",
        "## Evals",
        "",
        relatedEvals.length
          ? relatedEvals.map((evalScenario) => `- ${link(testConceptId(evalScenario.id), evalScenario.prompt)}`).join("\n")
          : "_No eval scenario explicitly exercises this tool._",
        "",
        "## Evidence emitted",
        "",
        bullets(tool.evidenceEmitted),
        "",
        "## Required inputs",
        "",
        bullets(tool.requiredInputs),
        "",
        "## Produces",
        "",
        bullets(tool.produces),
        "",
        "# Examples",
        "",
        "```",
        `${tool.name}(${sampleArgs})`,
        "```",
        "",
        "# Citations",
        "",
        compactList([
          ownerSys ? `- ${link(sysConceptId(ownerSys.id), ownerSys.name || ownerSys.id)}` : null,
          ...relatedPolicies.map((policy) => `- ${link(policyConceptId(policy.id), policy.title)}`),
        ]).join("\n") || "_No source-system or policy citations derivable from the spec._",
      ]),
    );
  }

  // --- workflow/ (only if present) -----------------------------------------
  if (workflow) {
    push(
      "workflow/index",
      { type: "Index", title: "Workflow Stages", description: `Workflow mode: ${workflow.mode || "sequential"}.`, timestamp },
      [
        "# Workflow Stages",
        "",
        `- **Mode:** ${workflow.mode || "sequential"}`,
        "",
        workflow.steps.map((s, i) => `${i + 1}. ${link(stepConceptId(s.id), s.label || s.id)}`).join("\n"),
      ].join("\n"),
    );

    workflow.steps.forEach((step, idx) => {
      const next = workflow.mode === "sequential" ? workflow.steps[idx + 1] : null;
      push(
        stepConceptId(step.id),
        {
          type: "Workflow Stage",
          title: step.label || step.id,
          description: step.description || step.label || step.id,
          source_id: step.id,
          tags,
          timestamp,
        },
        body([
          `# ${step.label || step.id}`,
          "",
          step.description || null,
          step.description ? "" : null,
          `- **Mode:** ${workflow.mode || "sequential"}`,
          `- **Stage:** ${idx + 1} of ${workflow.steps.length}`,
          "",
          "## Tools",
          "",
          (step.tools || []).length
            ? (step.tools || [])
                .map((t) => (toolSlug.has(t) ? `- ${link(toolConceptId(t), t)}` : `- ${t}`))
                .join("\n")
            : "_No tools._",
          next ? "" : null,
          next ? `Next: ${link(stepConceptId(next.id), next.label || next.id)}` : null,
        ]),
      );
    });
  }

  // --- documents/ (Source Document concepts) -------------------------------
  const slugDoc = makeSlugger();
  const docSlug = new Map(); // doc id -> slug
  for (const d of documents) docSlug.set(d.id, slugDoc(d.id, d.id));
  const docConceptId = (docId) => `documents/${docSlug.get(docId) || slug(docId)}`;
  if (documents.length) {
    push(
      "documents/index",
      { type: "Index", title: "Source Documents", timestamp },
      [
        "# Source Documents",
        "",
        documents.map((d) => `- ${link(docConceptId(d.id), d.title || d.id)}`).join("\n"),
      ].join("\n"),
    );
    for (const doc of documents) {
      push(
        docConceptId(doc.id),
        {
          type: "Source Document",
          title: doc.title || doc.id,
          description: doc.description || `${doc.type || "document"} source document.`,
          source_id: doc.id,
          tags,
          timestamp,
        },
        body([
          `# ${doc.title || doc.id}`,
          "",
          doc.description || null,
          doc.description ? "" : null,
          `- **Type:** ${doc.type || "document"}`,
          "",
          "## Citation anchors",
          "",
          bullets(doc.anchors),
        ]),
      );
    }
  }

  const docById = new Map(documents.map((d) => [d.id, d]));
  const citationLinks = (docIds = []) => {
    const scoped = (docIds || []).filter((id) => docById.has(id));
    const sourceDocs = scoped.length ? scoped.map((id) => docById.get(id)) : documents;
    return sourceDocs.length
      ? sourceDocs.map((d) => `- ${link(docConceptId(d.id), d.title || d.id)}`).join("\n")
      : "_No external citations generated; link source documents before production use._";
  };

  // --- claims/ (Claim concepts from evidence requirements) -------------------
  if (claims.length) {
    push(
      "claims/index",
      { type: "Index", title: "Claims", description: "Claims that require source-system evidence.", timestamp },
      ["# Claims", "", claims.map((claim) => `- ${link(claimConceptId(claim.id), claim.claim)}`).join("\n")].join("\n"),
    );
    for (const claim of claims) {
      push(
        claimConceptId(claim.id),
        {
          type: "Claim",
          title: claim.claim,
          description: `Evidence-backed claim: ${claim.claim}`,
          source_id: claim.id,
          tags,
          timestamp,
          ...specGeneratedFields({ source: `behaviorContract.evidenceRequirements.${claim.sourceIndex}`, inferred: false }),
        },
        body([
          `# ${claim.claim}`,
          "",
          "## Authority",
          "",
          claim.sourceSystemIds.length
            ? claim.sourceSystemIds.map((sysId) => (systemSlug.has(sysId) ? `- ${link(sysConceptId(sysId), sysId)}` : `- ${sysId}`)).join("\n")
            : "_No source systems listed on this evidence requirement._",
          "",
          "## Required Evidence",
          "",
          bullets(claim.mustCite),
          "",
          "## Citation Requirements",
          "",
          claim.mustCite.length ? `Must cite: ${claim.mustCite.join(", ")}` : "Must cite linked source-system evidence before answering.",
          "",
          "## Proof obligations",
          "",
          `- ${link(proofConceptId(`evidence-${claim.id}`), `Evidence obligation — ${claim.claim}`)}`,
          "",
          "# Citations",
          "",
          citationLinks(),
        ]),
      );
    }
  }

  // --- policies/ (Policy concepts from guardrails/tool gates) --------------
  if (policyConcepts.length) {
    push(
      "policies/index",
      { type: "Index", title: "Policies", description: "Refusal, escalation, confirmation, and idempotency policies derivable from the spec.", timestamp },
      ["# Policies", "", policyConcepts.map((policy) => `- ${link(policyConceptId(policy.id), policy.title)}`).join("\n")].join("\n"),
    );
    for (const policy of policyConcepts) {
      const linkedTool = policy.toolName && toolSlug.has(policy.toolName) ? toolConceptId(policy.toolName) : null;
      push(
        policyConceptId(policy.id),
        {
          type: "Policy",
          title: policy.title,
          description: policyText(policy),
          source_id: policy.id,
          tags,
          timestamp,
          ...specGeneratedFields({ source: policy.source, inferred: Boolean(policy.inferred), from: policy.source }),
        },
        body([
          `# ${policy.title}`,
          "",
          `- **Policy kind:** ${policy.kind}`,
          `- **Spec source:** ${policy.source}`,
          linkedTool ? `- **Tool:** ${link(linkedTool, policy.toolName)}` : null,
          "",
          "## Rule",
          "",
          policy.kind === "escalation"
            ? mdTable(
                ["Trigger", "Action", "Handoff", "Rationale"],
                [[policy.rule.trigger, policy.rule.action, policy.rule.handoffTarget || "", policy.rule.rationale || ""]],
              )
            : policy.rule,
          policy.kind === "refusal" || policy.kind === "escalation" ? "" : null,
          policy.kind === "refusal" || policy.kind === "escalation" ? "## Used by" : null,
          policy.kind === "refusal" || policy.kind === "escalation" ? "" : null,
          policy.kind === "refusal" || policy.kind === "escalation" ? `- ${link("playbook", "Playbook")}` : null,
          "",
          "# Citations",
          "",
          linkedTool ? `- ${link(linkedTool, policy.toolName)}` : `- ${link("playbook", "Playbook")}`,
        ]),
      );
    }
  }

  // --- proof-obligations/ --------------------------------------------------
  if (proofObligations.length) {
    push(
      "proof-obligations/index",
      { type: "Index", title: "Proof Obligations", description: "Assertions the bundle must prove through evidence requirements and golden evals.", timestamp },
      ["# Proof Obligations", "", proofObligations.map((proof) => `- ${link(proofConceptId(proof.id), proof.title)}`).join("\n")].join("\n"),
    );
    for (const proof of proofObligations) {
      const linkedClaim = proof.claimId ? claimConceptId(proof.claimId) : null;
      const linkedEval = proof.evalId ? testConceptId(proof.evalId) : null;
      push(
        proofConceptId(proof.id),
        {
          type: "Proof Obligation",
          title: proof.title,
          description: `${proof.kind} proof obligation`,
          source_id: proof.id,
          tags,
          timestamp,
          ...specGeneratedFields({ source: proof.source, inferred: false }),
        },
        body([
          `# ${proof.title}`,
          "",
          `- **Kind:** ${proof.kind}`,
          `- **Spec source:** ${proof.source}`,
          linkedClaim ? `- **Claim:** ${link(linkedClaim, claims.find((claim) => claim.id === proof.claimId)?.claim || proof.claimId)}` : null,
          linkedEval ? `- **Eval:** ${link(linkedEval, proof.evalId)}` : null,
          "",
          proof.mustCite?.length ? "## Required citations" : null,
          proof.mustCite?.length ? "" : null,
          proof.mustCite?.length ? bullets(proof.mustCite) : null,
          proof.sourceSystemIds?.length ? "" : null,
          proof.sourceSystemIds?.length ? "## Source systems" : null,
          proof.sourceSystemIds?.length ? "" : null,
          proof.sourceSystemIds?.length
            ? proof.sourceSystemIds.map((sysId) => (systemSlug.has(sysId) ? `- ${link(sysConceptId(sysId), sysId)}` : `- ${sysId}`)).join("\n")
            : null,
          proof.mechanisms?.length ? "" : null,
          proof.mechanisms?.length ? "## Mechanisms" : null,
          proof.mechanisms?.length ? "" : null,
          proof.mechanisms?.length
            ? proof.mechanisms.map((toolName) => (toolSlug.has(toolName) ? `- ${link(toolConceptId(toolName), toolName)}` : `- ${toolName}`)).join("\n")
            : null,
          proof.mustReferenceEntities?.length ? "" : null,
          proof.mustReferenceEntities?.length ? "## Entities that must be referenced" : null,
          proof.mustReferenceEntities?.length ? "" : null,
          proof.mustReferenceEntities?.length ? bullets(proof.mustReferenceEntities) : null,
          proof.forbiddenBehaviors?.length ? "" : null,
          proof.forbiddenBehaviors?.length ? "## Forbidden behaviors" : null,
          proof.forbiddenBehaviors?.length ? "" : null,
          proof.forbiddenBehaviors?.length ? bullets(proof.forbiddenBehaviors) : null,
          proof.mustCiteDocuments?.length ? "" : null,
          proof.mustCiteDocuments?.length ? "# Citations" : null,
          proof.mustCiteDocuments?.length ? "" : null,
          proof.mustCiteDocuments?.length
            ? proof.mustCiteDocuments.map((docId) => (docSlug.has(docId) ? `- ${link(docConceptId(docId), docId)}` : `- ${docId}`)).join("\n")
            : null,
        ]),
      );
    }
  }

  // --- queries/ (Query Capability concepts) --------------------------------
  const slugQuery = makeSlugger();
  const querySlug = new Map(); // query id -> slug
  for (const q of answerableQueries) querySlug.set(q.id, slugQuery(q.id, q.id));
  const queryConceptId = (qid) => `queries/${querySlug.get(qid) || slug(qid)}`;
  const evalsForQuery = (query) => {
    const direct = testMechanisms.filter((test) => {
      if (test.validates === query.id) return true;
      const testTools = new Set(test.mechanisms || test.expectedToolCalls || []);
      return (query.tools || []).some((tool) => testTools.has(tool));
    });
    if (direct.length) return direct;
    return testMechanisms.filter((test) => /end-to-end|workflow|current period/i.test(`${test.id || ""} ${test.prompt || ""}`));
  };
  if (answerableQueries.length) {
    push(
      "queries/index",
      {
        type: "Index",
        title: "Query Capabilities",
        description: "The questions and requests this agent can answer, each with the tools it uses.",
        timestamp,
      },
      [
        "# Query Capabilities",
        "",
        answerableQueries.map((q) => `- ${link(queryConceptId(q.id), q.request)}`).join("\n"),
      ].join("\n"),
    );
    for (const q of answerableQueries) {
      const stageConcept = q.stage && stepSlug.has(q.stage) ? stepConceptId(q.stage) : null;
      const coveredBy = evalsForQuery(q);
      push(
        queryConceptId(q.id),
        {
          type: "Query Capability",
          title: q.request.length > 80 ? `${q.request.slice(0, 77)}...` : q.request,
          description: q.request,
          source_id: q.id,
          generation_status: Array.isArray(bc.answerableQueries) && bc.answerableQueries.length ? "generated" : "inferred",
          tags,
          timestamp,
        },
        body([
          `# ${q.request}`,
          "",
          "## Tools used",
          "",
          (q.tools || []).length
            ? q.tools.map((t) => (toolSlug.has(t) ? `- ${link(toolConceptId(t), t)}` : `- ${t}`)).join("\n")
            : "_No tools._",
          "",
          stageConcept ? "## Runs in" : null,
          stageConcept ? "" : null,
          stageConcept ? `- ${link(stageConcept, q.stage)}` : null,
          stageConcept ? "" : null,
          "## Evidence expected",
          "",
          bullets(q.evidence),
          "",
          "## Evals",
          "",
          coveredBy.length
            ? coveredBy.map((test) => `- ${link(testConceptId(test.id), test.prompt || test.id)}`).join("\n")
            : "_No eval mapped yet._",
          documents.length ? "" : null,
          documents.length ? "# Citations" : null,
          documents.length ? "" : null,
          documents.length
            ? documents.map((d) => `- ${link(docConceptId(d.id), d.title || d.id)}`).join("\n")
            : null,
        ]),
      );
    }
  }

  // --- tests/ (Eval Scenario concepts) -------------------------------------
  if (testMechanisms.length) {
    push(
      "tests/index",
      {
        type: "Index",
        title: "Eval Scenarios",
        description: "How each Query Capability is tested: the mechanisms (tools) a test must exercise.",
        timestamp,
      },
      [
        "# Eval Scenarios",
        "",
        testMechanisms.map((t) => `- ${link(testConceptId(t.id), t.prompt)}`).join("\n"),
      ].join("\n"),
    );
    for (const t of testMechanisms) {
      const validatesConcept = t.validates && answerableQueries.some((q) => q.id === t.validates)
        ? queryConceptId(t.validates)
        : null;
      push(
        testConceptId(t.id),
        {
          type: "Eval Scenario",
          title: t.prompt.length > 80 ? `${t.prompt.slice(0, 77)}...` : t.prompt,
          description: t.prompt,
          source_id: t.id,
          generation_status: Array.isArray(bc.goldenEvals) && bc.goldenEvals.some((e) => e && typeof e === "object" && Array.isArray(e.mechanisms)) ? "generated" : "inferred",
          tags,
          timestamp,
        },
        body([
          `# ${t.prompt}`,
          "",
          validatesConcept ? "## Validates" : null,
          validatesConcept ? "" : null,
          validatesConcept ? `- ${link(validatesConcept, t.validates)}` : null,
          validatesConcept ? "" : null,
          "## Mechanisms to call",
          "",
          (t.mechanisms || []).length
            ? t.mechanisms.map((m) => (toolSlug.has(m) ? `- ${link(toolConceptId(m), m)}` : `- ${m}`)).join("\n")
            : "_No mechanisms specified._",
          "",
          "## Success rubric",
          "",
          t.rubric || "Exercises every mechanism above and grounds its answer in the cited evidence.",
          (t.mustCiteDocuments || []).length ? "" : null,
          (t.mustCiteDocuments || []).length ? "# Citations" : null,
          (t.mustCiteDocuments || []).length ? "" : null,
          (t.mustCiteDocuments || []).length
            ? t.mustCiteDocuments
                .map((d) => (docById.has(d) ? `- ${link(docConceptId(d), docById.get(d).title || d)}` : `- ${d}`))
                .join("\n")
            : null,
        ]),
      );
    }
  }

  // --- kpis.md -------------------------------------------------------------
  push(
    "kpis",
    { type: "KPIs", title: "KPIs", timestamp },
    [
      "# KPIs",
      "",
      (spec.kpis || []).length
        ? mdTable(["KPI", "Before", "After"], (spec.kpis || []).map((k) => [k.label, k.before, k.after]))
        : "_No KPIs defined._",
    ].join("\n"),
  );

  // --- evals.md ------------------------------------------------------------
  const evals = bc.goldenEvals || [];
  push(
    "evals",
    { type: "Evals", title: "Golden Evals", timestamp },
    [
      "# Golden Evals",
      "",
      evals.length
        ? evals
            .map((e, i) => {
              const prompt = typeof e === "string" ? e : e.prompt || e.input || e.question || JSON.stringify(e);
              const expect = typeof e === "string" ? "" : e.expected || e.expect || e.rubric || "";
              return [`### Eval ${i + 1}`, "", `- **Prompt:** ${prompt}`, expect ? `- **Expected:** ${expect}` : null]
                .filter(Boolean)
                .join("\n");
            })
            .join("\n\n")
        : "_No golden evals defined._",
    ].join("\n"),
  );

  return concepts;
}

async function loadSpec(args) {
  if (args.spec) {
    const spec = JSON.parse(await readFile(resolve(args.spec), "utf8"));
    // Workspace specs may nest under `spec` or be the bare object.
    return spec.generationSpec ? spec : spec.spec || spec;
  }
  if (!args.id) throw new Error("Provide --id <useCaseId> or --spec <path.json>.");
  // Load the catalog through getUseCases() (the autosync loader every catalog
  // consumer shares) — never a raw read of the git-ignored artifact, which would
  // ENOENT on a fresh checkout. Parity with the sibling spec-to-skill.mjs.
  const spec = findUseCase(getUseCases(), args.id);
  if (!spec) throw new Error(`Use case '${args.id}' not found in the use-case catalog.`);
  return spec;
}

/**
 * A STABLE timestamp for a bundle, so re-emitting an unchanged spec is
 * byte-identical (no spurious git diffs). Preference order:
 *   1. the spec's own generation / last-change time, if present;
 *   2. SOURCE_DATE_EPOCH (seconds since the Unix epoch) when set;
 *   3. a single value derived deterministically from the spec id (so it is
 *      stable across runs of the same spec, but distinct per spec).
 */
export function stableTimestamp(spec = {}) {
  const candidate =
    spec.generatedAt ||
    spec.generationTime ||
    spec.lastChangedAt ||
    spec.updatedAt ||
    spec.createdAt ||
    spec.timestamp ||
    spec.generationSpec?.generatedAt ||
    spec.generationSpec?.timestamp;
  if (candidate) {
    const d = new Date(candidate);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  const epoch = process.env.SOURCE_DATE_EPOCH;
  if (epoch && /^\d+$/.test(epoch.trim())) {
    return new Date(Number(epoch.trim()) * 1000).toISOString();
  }
  // Deterministic per-spec fallback: epoch 0 is byte-stable and obviously a
  // placeholder, so an unchanged spec always re-emits identically.
  return new Date(0).toISOString();
}

export async function specToOkf(args) {
  const spec = await loadSpec(args);
  const id = spec.id || slug(spec.title || "agent-spec");
  const outDir = resolve(args.out || resolve(APP_ROOT, "artifacts", "okf", id));
  const concepts = buildBundle(spec, { timestamp: stableTimestamp(spec) });

  const files = [];
  for (const concept of concepts) {
    const abs = joinBundle(outDir, `${concept.relPath}.md`);
    await writeConceptFile(abs, renderConcept(concept.fields, concept.body));
    files.push(`${concept.relPath}.md`);
  }

  return { bundle: outDir, conceptCount: concepts.length, files: files.sort() };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(
      "usage: spec-to-okf.mjs --id <useCaseId> [--out <dir>] | --spec <path.json> [--out <dir>]\n",
    );
    return;
  }
  const summary = await specToOkf(args);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

if (import.meta.main || process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message || error}\n`);
    process.exit(1);
  });
}
