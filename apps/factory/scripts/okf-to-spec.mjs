#!/usr/bin/env node
// okf-to-spec.mjs
//
// Reverse the OKF bundle back into a partial GE use-case spec, closing the
// authoring loop: an OKF Knowledge Bundle becomes an ingestible BRD.
//
//   node scripts/okf-to-spec.mjs --bundle <dir>
//
// Reconstructs (best-effort, from frontmatter + conventional sections):
//   - behaviorContract { role, primaryObjective, inScope, outOfScope,
//                        toolIntents[], workflow{mode,steps[]} }
//   - generationSpec.sourceSystems[] (id, name, protocol, owns)
//   - generationSpec.entities[] (name, sourceSystemId, fields[])

import { readdir, stat } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { bodySections, extractLinks, readConceptFile, slug } from "@ge/okf";

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--bundle") args.bundle = argv[++i];
    else if (token === "--help" || token === "-h") args.help = true;
  }
  return args;
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(abs)));
    else if (entry.name.endsWith(".md")) out.push(abs);
  }
  return out;
}

/** Parse a `# Schema` markdown table into field objects. */
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

export async function okfToSpec(bundleDir) {
  const root = resolve(bundleDir);
  const files = await walk(root);
  const concepts = new Map(); // conceptId -> { frontmatter, body, sections }
  for (const abs of files) {
    const relNoExt = abs.slice(root.length + 1).replace(/\.md$/, "");
    const parsed = await readConceptFile(abs);
    concepts.set(relNoExt, { ...parsed, sections: bodySections(parsed.body) });
  }

  const get = (id) => concepts.get(id);
  const inDir = (dir) =>
    [...concepts.entries()]
      .filter(([id]) => id.startsWith(`${dir}/`) && basename(id) !== "index")
      .map(([id, c]) => ({ id, ...c }));

  // Original id of a concept: prefer the persisted `source_id` frontmatter
  // (written by spec-to-okf), else fall back to the slugged filename. This
  // makes spec→OKF→spec lossless for underscore/hyphen ids and keeps
  // cross-refs (`stage`, `validates`) resolvable.
  const sourceId = (concept) => {
    const sid = concept && concept.frontmatter && concept.frontmatter.source_id;
    return (typeof sid === "string" && sid) ? sid : null;
  };
  // Map a bundle link target (e.g. `workflow/balance-document-pull`) back to
  // the referenced concept's original id.
  const originalIdForLink = (linkId) => {
    const c = get(linkId);
    return sourceId(c) || basename(linkId);
  };

  // --- behaviorContract from playbook.md -----------------------------------
  const playbook = get("playbook");
  const behaviorContract = {};
  if (playbook) {
    const s = playbook.sections;
    behaviorContract.role = (s.Role || "").trim() || undefined;
    behaviorContract.primaryObjective = (s["Primary objective"] || "").trim() || undefined;
    behaviorContract.inScope = bullets(s["In scope"]);
    behaviorContract.outOfScope = bullets(s["Out of scope"]);
    const refusal = bullets(s["Refusal rules"]);
    if (refusal.length) behaviorContract.refusalRules = refusal;
  }

  // --- sourceSystems from systems/* ----------------------------------------
  const sourceSystems = inDir("systems").map((c) => {
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

  // --- entities from tables/* ----------------------------------------------
  const entities = inDir("tables").map((c) => {
    const ownerLink = extractLinks(c.sections.Citations || c.body).find((l) => l.startsWith("systems/"));
    return {
      name: c.frontmatter.title || c.id.replace(/^tables\//, ""),
      sourceSystemId: ownerLink ? basename(ownerLink) : undefined,
      fields: parseSchemaTable(c.sections.Schema),
    };
  });

  // --- toolIntents from tools/* --------------------------------------------
  const toolIntents = inDir("tools").map((c) => {
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

  // --- workflow from workflow/* (order via workflow/index numbering) --------
  let workflow;
  const workflowIndex = get("workflow/index");
  if (workflowIndex) {
    const modeMatch = (workflowIndex.body || "").match(/\*\*Mode:\*\*\s*([^\n]+)/);
    // Ordered step ids come from the numbered list of links in the index.
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
            const tool = toolIntents.find((t) => `tools/${slug(t.name)}` === l);
            return tool ? tool.name : delink(basename(l));
          }),
      }));
    workflow = { mode: modeMatch ? modeMatch[1].trim() : "sequential", steps };
    behaviorContract.workflow = workflow;
  }

  if (toolIntents.length) behaviorContract.toolIntents = toolIntents;

  // Map a tool concept link (`tools/<slug>`) back to its original tool name.
  const toolNameByConcept = new Map(toolIntents.map((t) => [`tools/${slug(t.name)}`, t.name]));
  const toolNameFromLink = (l) => toolNameByConcept.get(l) || basename(l);

  // --- answerableQueries from queries/* ------------------------------------
  const answerableQueries = inDir("queries").map((c) => {
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
  if (answerableQueries.length) behaviorContract.answerableQueries = answerableQueries;

  // --- goldenEvals (+ mechanisms) from tests/* -----------------------------
  const goldenEvals = inDir("tests").map((c) => {
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
  if (goldenEvals.length) behaviorContract.goldenEvals = goldenEvals;

  // --- documents from documents/* ------------------------------------------
  const documents = inDir("documents").map((c) => {
    const typeMatch = (c.body || "").match(/\*\*Type:\*\*\s*([^\n]+)/);
    return {
      id: sourceId(c) || c.id.replace(/^documents\//, ""),
      title: c.frontmatter.title || basename(c.id),
      type: typeMatch ? typeMatch[1].trim() : "document",
      anchors: bullets(c.sections["Citation anchors"]),
    };
  });

  return {
    behaviorContract,
    generationSpec: { sourceSystems, entities, documents, behaviorContract },
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.bundle) {
    process.stdout.write("usage: okf-to-spec.mjs --bundle <dir>\n");
    if (!args.bundle && !args.help) process.exit(1);
    return;
  }
  const info = await stat(args.bundle).catch(() => null); // best-effort: null converts to the explicit bundle-not-found throw below
  if (!info || !info.isDirectory()) throw new Error(`Bundle directory not found: ${args.bundle}`);
  const spec = await okfToSpec(args.bundle);
  process.stdout.write(`${JSON.stringify(spec, null, 2)}\n`);
}

if (import.meta.main || process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message || error}\n`);
    process.exit(1);
  });
}
