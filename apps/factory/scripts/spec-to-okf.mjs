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

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(SCRIPT_DIR, "..");
const CATALOG_PATH = resolve(APP_ROOT, "generated", "use-cases.generated.json");

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

/** Markdown table from rows of header->value. */
function mdTable(headers, rows) {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((r) => `| ${r.map((c) => String(c ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ")).join(" | ")} |`);
  return [head, sep, ...body].join("\n");
}

/** Join body lines, dropping optional lines (null/undefined) but keeping
 *  intentional blank-line spacers (""). */
function body(lines) {
  return lines.filter((line) => line !== null && line !== undefined).join("\n");
}

function bullets(items) {
  const list = (items || []).filter((x) => x !== undefined && x !== null && String(x).length);
  return list.length ? list.map((x) => `- ${String(x).trim()}`).join("\n") : "_None specified._";
}

function entityFields(entity) {
  return entity.fields || entity.columns || entity.dataContract || entity.schema || [];
}

function fieldName(field) {
  return typeof field === "string" ? field : field.name || field.field || "";
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
  if (answerableQueries.length) sectionLinks.push(link("queries/index", "Query Capabilities"));
  if (testMechanisms.length) sectionLinks.push(link("tests/index", "Eval Scenarios"));
  if (documents.length) sectionLinks.push(link("documents/index", "Source Documents"));
  sectionLinks.push(link("kpis", "KPIs"));
  sectionLinks.push(link("evals", "Golden Evals"));

  const kpiSummary = (spec.kpis || [])
    .map((k) => `- **${k.label}**: ${k.before} → ${k.after}`)
    .join("\n");

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
    push(
      toolConceptId(tool.name),
      {
        type: "Agent Tool",
        title: tool.name,
        description: tool.description || `${tool.kind || "tool"} tool ${tool.name}.`,
        tags,
        timestamp,
      },
      body([
        `# ${tool.name}`,
        "",
        tool.description || null,
        tool.description ? "" : null,
        `- **Kind:** ${tool.kind || "—"}`,
        `- **Source system:** ${ownerSys ? link(sysConceptId(ownerSys.id), ownerSys.name || ownerSys.id) : tool.sourceSystemId || "—"}`,
        "",
        "## Required inputs",
        "",
        bullets(tool.requiredInputs),
        "",
        "## Produces",
        "",
        bullets(tool.produces),
        "",
        "## Evidence emitted",
        "",
        bullets(tool.evidenceEmitted),
        "",
        "# Examples",
        "",
        "```",
        `${tool.name}(${sampleArgs})`,
        "```",
        "",
        "## Used by",
        "",
        usingSteps.length
          ? usingSteps.map((sid) => `- ${link(stepConceptId(sid), sid)}`).join("\n")
          : "_Not bound to a workflow stage._",
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

  // --- queries/ (Query Capability concepts) --------------------------------
  const slugQuery = makeSlugger();
  const querySlug = new Map(); // query id -> slug
  for (const q of answerableQueries) querySlug.set(q.id, slugQuery(q.id, q.id));
  const queryConceptId = (qid) => `queries/${querySlug.get(qid) || slug(qid)}`;
  const docById = new Map(documents.map((d) => [d.id, d]));
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
      push(
        queryConceptId(q.id),
        {
          type: "Query Capability",
          title: q.request.length > 80 ? `${q.request.slice(0, 77)}...` : q.request,
          description: q.request,
          source_id: q.id,
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
  const slugTest = makeSlugger();
  const testSlug = new Map(); // test id -> slug
  for (const t of testMechanisms) testSlug.set(t.id, slugTest(t.id, t.id));
  const testConceptId = (tid) => `tests/${testSlug.get(tid) || slug(tid)}`;
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
  const catalog = JSON.parse(await readFile(CATALOG_PATH, "utf8"));
  const spec = findUseCase(catalog, args.id);
  if (!spec) throw new Error(`Use case '${args.id}' not found in ${CATALOG_PATH}.`);
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
