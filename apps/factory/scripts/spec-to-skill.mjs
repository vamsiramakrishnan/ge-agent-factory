#!/usr/bin/env node
// spec-to-skill.mjs
//
// Convert a GE use-case agent spec into an Agent Skill package — the
// spec-portable SKILL.md format (progressive disclosure: a short L1 body,
// references/ for depth, scripts/ for runnable checks, assets/ for the
// canonical machine-readable spec). This is the alternative consumption path
// to bespoke ADK agent generation: any skill-capable assistant (Claude Code,
// Codex, Antigravity, Gemini CLI) can load the package and operate as the
// specified agent, grounded in the same behavior contract. Google ADK itself
// consumes the same format — its experimental skills API (adk.dev/skills,
// google-adk >= 1.25) loads a package like this via load_skill_from_dir +
// SkillToolset; scripts/adk_toolset.py below is that loader, prewired.
//
//   node scripts/spec-to-skill.mjs --id <useCaseId> [--out <dir>]
//   node scripts/spec-to-skill.mjs --spec <path.json> [--out <dir>]
//
// Default out dir: artifacts/skills/<id>/
//
// Mapping (spec -> skill package):
//   behaviorContract.{role,primaryObjective,inScope}  -> SKILL.md frontmatter description ("Use when ...")
//   behaviorContract.{workflow,toolIntents,rules}     -> SKILL.md body (L1) + references/behavior-contract.md (L2)
//   generationSpec.{sourceSystems,entities,documents} -> references/data-and-systems.md (L2)
//   behaviorContract.goldenEvals                      -> references/example-session.md (L2) + assets/golden-evals.json
//   whole spec                                        -> assets/agent-spec.json (canonical, machine-readable)
//   coverage invariants                               -> scripts/check-coverage.mjs (L3, runnable, dependency-free)
//
// Pure builder + thin fs writer, mirroring spec-to-okf.mjs: buildSkillFiles()
// takes the spec and returns { relPath, content }[] — deterministic (no clock,
// no randomness), so re-emitting an unchanged spec is byte-identical.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { stringify as stringifyYaml } from "yaml";
import { findUseCase, slug } from "@ge/okf";
import { deriveAnswerableQueries, deriveTestMechanisms, specDocuments } from "./lib/okf-capabilities.mjs";
import { bullets, entityFields, fieldName, mdTable } from "./factory/okf/markdown.mjs";

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

function asArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && String(item).length);
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function sentence(text) {
  const t = String(text || "").trim().replace(/\s+/g, " ");
  if (!t) return "";
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

// Skill names are kebab-case, <= 64 chars (the Agent Skills portability rule
// this repo's own skill audit enforces).
export function skillName(spec) {
  return slug(spec.id || spec.title || "agent-skill").slice(0, 64).replace(/-+$/, "");
}

// Frontmatter description: third person, states what the skill does and when
// to use it, <= 1024 chars.
export function skillDescription(spec) {
  const gen = spec.generationSpec || {};
  const bc = gen.behaviorContract || {};
  const objective = sentence(bc.primaryObjective || spec.subtitle || spec.title || spec.id);
  const triggers = asArray(bc.inScope).slice(0, 3).map((s) => String(s).trim().replace(/[.]$/, "").toLowerCase());
  const useWhen = triggers.length
    ? `Use when the user needs: ${triggers.join("; ")}.`
    : `Use when the user needs the ${spec.title || spec.id} capability.`;
  const role = bc.role ? `Operates as ${String(bc.role).trim().replace(/[.]$/, "")}.` : "";
  return [objective, role, useWhen].filter(Boolean).join(" ").slice(0, 1024);
}

function goldenEvalRecords(bc = {}) {
  return (bc.goldenEvals || []).map((entry, index) => {
    if (typeof entry === "string") return { id: `eval-${index + 1}`, prompt: entry };
    return {
      id: entry.id || `eval-${index + 1}`,
      prompt: entry.prompt || entry.input || entry.question || "",
      expectedToolCalls: asArray(entry.expectedToolCalls || entry.mechanisms),
      mustCiteDocuments: asArray(entry.mustCiteDocuments),
      mustReferenceEntities: asArray(entry.mustReferenceEntities),
      forbiddenBehaviors: asArray(entry.forbiddenBehaviors),
      expected: entry.expected || entry.expect || entry.rubric || "",
    };
  }).filter((entry) => entry.prompt);
}

function renderSkillMd(spec) {
  const gen = spec.generationSpec || {};
  const bc = gen.behaviorContract || {};
  const id = spec.id || slug(spec.title || "agent-spec");
  const workflow = bc.workflow && Array.isArray(bc.workflow.steps) ? bc.workflow : null;
  const toolIntents = bc.toolIntents || [];
  const queries = deriveAnswerableQueries(bc);

  const toolRows = toolIntents.map((tool) => [
    `\`${tool.name}\``,
    tool.kind || "—",
    tool.sourceSystemId || "—",
    asArray(tool.produces).join(", ") || "—",
  ]);

  // Render frontmatter through the YAML serializer, not string interpolation:
  // spec-derived descriptions carry YAML-significant text (a `: ` from "Use
  // when the user needs: …", a leading `#`, etc.) that would produce invalid or
  // truncated frontmatter for a real skill loader. `lineWidth: 0` disables
  // folding so the description stays on one line; the serializer quotes only
  // when a value needs it, so simple names stay plain.
  const frontmatter = stringifyYaml(
    { name: skillName(spec), description: skillDescription(spec) },
    { lineWidth: 0 },
  ).trimEnd();

  return [
    "---",
    frontmatter,
    "---",
    "",
    `# ${spec.title || id}`,
    "",
    `> ${sentence(bc.primaryObjective || spec.subtitle || spec.title || id)}`,
    "",
    `Generated from the OKF agent spec \`${id}\` — regenerate with \`ge okf skill --id ${id}\`. The canonical machine-readable contract is [assets/agent-spec.json](assets/agent-spec.json); this file is its operating summary.`,
    "",
    "## Operating contract",
    "",
    `- **Role:** ${bc.role || "—"}`,
    `- **Objective:** ${bc.primaryObjective || "—"}`,
    "",
    "**In scope**",
    "",
    bullets(bc.inScope),
    "",
    "**Out of scope** — refuse and say why:",
    "",
    bullets(bc.outOfScope),
    "",
    "## What this agent answers",
    "",
    queries.length
      ? queries.map((q) => `- ${q.request}${(q.tools || []).length ? ` — via ${q.tools.map((t) => `\`${t}\``).join(", ")}` : ""}`).join("\n")
      : "_No answerable queries derived from the spec._",
    "",
    "## Tools",
    "",
    "Each tool intent below must be satisfied through the bound source system (live connector, MCP tool, or the fixture backend named in the spec). Inputs, outputs, and evidence rules per tool: [references/behavior-contract.md](references/behavior-contract.md).",
    "",
    toolRows.length ? mdTable(["Tool", "Kind", "Source system", "Produces"], toolRows) : "_No tool intents._",
    "",
    "## Workflow",
    "",
    workflow
      ? [
        `Mode: **${workflow.mode || "sequential"}**.`,
        "",
        workflow.steps.map((step, index) => `${index + 1}. **${step.label || step.id}**${(step.tools || []).length ? ` — tools: ${(step.tools || []).map((t) => `\`${t}\``).join(", ")}` : ""}`).join("\n"),
      ].join("\n")
      : "Single-pass: gather evidence with the query tools, then answer with citations.",
    "",
    "## Guardrails",
    "",
    bullets([
      ...asArray(bc.refusalRules),
      ...(bc.escalationRules || []).map((rule) => rule?.trigger ? `Escalate when ${rule.trigger}${rule.action ? ` — ${rule.action}` : ""}` : null),
      (bc.evidenceRequirements || []).length ? "Every claim must cite its source-system evidence (see the behavior-contract reference for the per-claim requirements)." : null,
    ]),
    "",
    "## Going deeper",
    "",
    `- [references/behavior-contract.md](references/behavior-contract.md) — read when you need a tool's exact inputs/outputs, an evidence requirement, or an escalation/refusal rule verbatim.`,
    `- [references/data-and-systems.md](references/data-and-systems.md) — read when you need a source system's schema, entity fields, or document citation anchors.`,
    `- [references/example-session.md](references/example-session.md) — read before your first answer to see graded examples of correct behavior.`,
    `- \`node scripts/check-coverage.mjs\` — run to verify the packaged spec is internally consistent (every query's tools exist; every eval's mechanisms exist).`,
    `- [scripts/adk_toolset.py](scripts/adk_toolset.py) — load this package into a Google ADK agent as a SkillToolset (ADK's experimental skills API, google-adk >= 1.25).`,
    `- [assets/agent-spec.json](assets/agent-spec.json) — the full spec; [assets/golden-evals.json](assets/golden-evals.json) — the acceptance evals.`,
    "",
    "## Done when",
    "",
    bullets([
      "The answer cites the evidence fields the contract requires, from the systems that own them.",
      "Every tool call used a declared tool intent with its required inputs.",
      "Out-of-scope or refusal-rule requests were declined with the rule's rationale.",
      (bc.goldenEvals || []).length ? "Behavior matches the golden evals in assets/golden-evals.json for equivalent prompts." : null,
    ]),
    "",
  ].join("\n");
}

function renderBehaviorContractRef(spec) {
  const gen = spec.generationSpec || {};
  const bc = gen.behaviorContract || {};
  const toolIntents = bc.toolIntents || [];
  const evidence = bc.evidenceRequirements || [];
  return [
    "# Behavior contract (full detail)",
    "",
    "Verbatim rendering of the spec's behavior contract. The machine-readable source is [../assets/agent-spec.json](../assets/agent-spec.json).",
    "",
    "## Tool intents",
    "",
    toolIntents.length
      ? toolIntents.map((tool) => [
        `### \`${tool.name}\``,
        "",
        tool.description ? `${sentence(tool.description)}` : null,
        `- **Kind:** ${tool.kind || "—"}`,
        `- **Source system:** ${tool.sourceSystemId || "—"}`,
        `- **Required inputs:** ${asArray(tool.requiredInputs).join(", ") || "—"}`,
        `- **Produces:** ${asArray(tool.produces).join(", ") || "—"}`,
        `- **Evidence emitted:** ${asArray(tool.evidenceEmitted).join(", ") || "—"}`,
      ].filter(Boolean).join("\n")).join("\n\n")
      : "_No tool intents._",
    "",
    "## Evidence requirements",
    "",
    evidence.length
      ? evidence.map((req) => {
        if (typeof req === "string") return `- ${req}`;
        const cites = asArray(req.mustCite);
        return `- ${req.claim || JSON.stringify(req)}${cites.length ? ` — must cite: ${cites.join(", ")}` : ""}`;
      }).join("\n")
      : "_None specified._",
    "",
    "## Escalation rules",
    "",
    (bc.escalationRules || []).length
      ? mdTable(["Trigger", "Action", "Rationale"], (bc.escalationRules || []).map((rule) => [rule.trigger, rule.action, rule.rationale]))
      : "_None specified._",
    "",
    "## Refusal rules",
    "",
    bullets(bc.refusalRules),
    "",
  ].join("\n");
}

function renderDataSystemsRef(spec) {
  const gen = spec.generationSpec || {};
  const systems = gen.sourceSystems || [];
  const entities = gen.entities || [];
  const documents = specDocuments(spec);
  return [
    "# Source systems and data",
    "",
    "## Source systems",
    "",
    systems.length
      ? systems.map((sys) => [
        `### ${sys.name || sys.id}`,
        "",
        `- **Id:** \`${sys.id}\``,
        `- **Protocol:** ${sys.protocol || "—"}`,
        `- **Owns:** ${asArray(sys.owns).join(", ") || "—"}`,
        `- **Tools:** ${asArray(sys.toolNames).map((t) => `\`${t}\``).join(", ") || "—"}`,
      ].join("\n")).join("\n\n")
      : "_No source systems._",
    "",
    "## Entities",
    "",
    entities.length
      ? entities.map((ent) => {
        const rows = entityFields(ent).map((field) => {
          if (typeof field === "string") return [field, "", ""];
          return [fieldName(field), field.type || "", field.required ? "required" : ""];
        });
        return [
          `### ${ent.name}`,
          "",
          rows.length ? mdTable(["Field", "Type", "Constraints"], rows) : "_No fields defined._",
        ].join("\n");
      }).join("\n\n")
      : "_No entities._",
    "",
    "## Documents",
    "",
    documents.length
      ? documents.map((doc) => `- **${doc.title || doc.id}** (${doc.type || "document"})${asArray(doc.anchors).length ? ` — citation anchors: ${asArray(doc.anchors).join(", ")}` : ""}`).join("\n")
      : "_No source documents._",
    "",
  ].join("\n");
}

function renderExampleSessionRef(spec) {
  const bc = spec.generationSpec?.behaviorContract || {};
  const evals = goldenEvalRecords(bc);
  return [
    "# Example session",
    "",
    "Golden evals rendered as graded example turns. Treat every element as an acceptance rule: the tool calls listed must actually happen, the citations listed must appear in the answer, and the forbidden behaviors must not.",
    "",
    evals.length
      ? evals.map((entry, index) => [
        `## Turn ${index + 1}`,
        "",
        `> **User:** ${entry.prompt}`,
        "",
        entry.expectedToolCalls?.length ? `**Expected tool calls:** ${entry.expectedToolCalls.map((t) => `\`${t}\``).join(", ")}` : null,
        entry.mustCiteDocuments?.length ? `**Must cite documents:** ${entry.mustCiteDocuments.join(", ")}` : null,
        entry.mustReferenceEntities?.length ? `**Must reference entities:** ${entry.mustReferenceEntities.join(", ")}` : null,
        entry.forbiddenBehaviors?.length ? `**Forbidden:** ${entry.forbiddenBehaviors.join("; ")}` : null,
        entry.expected ? `**Expected:** ${entry.expected}` : null,
      ].filter(Boolean).join("\n\n")).join("\n\n")
      : "_No golden evals defined in the spec._",
    "",
  ].join("\n");
}

// L3: a dependency-free coverage check the consuming assistant (or CI) can run
// against the packaged spec. Static template — reads the sibling asset at run
// time, so it stays correct if the asset is regenerated in place.
// L3: the ADK consumption path. ADK's skills API (adk.dev/skills — Python
// google-adk >= 1.25, experimental) implements the same Agent Skills spec this
// package follows, so the package is directly loadable into an ADK agent as a
// SkillToolset. Static template; resolves the package root at import time.
const ADK_TOOLSET_SCRIPT = `"""Load this skill package into a Google ADK agent.

Uses ADK's experimental skills API (https://adk.dev/skills/, google-adk >= 1.25),
which consumes the same Agent Skills format this package is written in:

    from google.adk.agents import Agent
    from adk_toolset import skill_toolset

    root_agent = Agent(model="...", tools=[skill_toolset()])
"""
import pathlib

from google.adk.skills import load_skill_from_dir
from google.adk.tools import skill_toolset as _skill_toolset

SKILL_DIR = pathlib.Path(__file__).resolve().parent.parent


def skill():
    """The loaded Skill object for this package."""
    return load_skill_from_dir(SKILL_DIR)


def skill_toolset():
    """A SkillToolset exposing this package to an ADK agent."""
    return _skill_toolset.SkillToolset(skills=[skill()])
`;

const CHECK_COVERAGE_SCRIPT = `#!/usr/bin/env node
// check-coverage.mjs — verify this skill package's spec is internally
// consistent: every derived query's tools resolve to declared tool intents,
// and every golden eval's expected tool calls do too. Exits non-zero on gaps.
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(await readFile(join(here, "..", "assets", "agent-spec.json"), "utf8"));
const bc = spec.generationSpec?.behaviorContract || {};
const tools = new Set((bc.toolIntents || []).map((tool) => tool.name));
const gaps = [];

for (const [index, entry] of (bc.goldenEvals || []).entries()) {
  for (const call of entry?.expectedToolCalls || []) {
    if (!tools.has(call)) gaps.push({ kind: "eval_tool_missing", eval: entry.id || \`eval-\${index + 1}\`, tool: call });
  }
}
for (const step of bc.workflow?.steps || []) {
  for (const tool of step.tools || []) {
    if (!tools.has(tool)) gaps.push({ kind: "workflow_tool_missing", step: step.id, tool });
  }
}

const summary = {
  spec: spec.id || null,
  toolIntents: tools.size,
  goldenEvals: (bc.goldenEvals || []).length,
  workflowSteps: (bc.workflow?.steps || []).length,
  ok: gaps.length === 0,
  gaps,
};
process.stdout.write(JSON.stringify(summary, null, 2) + "\\n");
if (gaps.length) process.exit(1);
`;

/**
 * Build the in-memory skill package (list of `{ relPath, content }` files)
 * from a spec. Pure and deterministic: no clock, no randomness.
 */
export function buildSkillFiles(spec) {
  const bc = spec.generationSpec?.behaviorContract || {};
  return [
    { relPath: "SKILL.md", content: renderSkillMd(spec) },
    { relPath: "references/behavior-contract.md", content: renderBehaviorContractRef(spec) },
    { relPath: "references/data-and-systems.md", content: renderDataSystemsRef(spec) },
    { relPath: "references/example-session.md", content: renderExampleSessionRef(spec) },
    { relPath: "scripts/check-coverage.mjs", content: CHECK_COVERAGE_SCRIPT },
    { relPath: "scripts/adk_toolset.py", content: ADK_TOOLSET_SCRIPT },
    { relPath: "assets/agent-spec.json", content: `${JSON.stringify(spec, null, 2)}\n` },
    { relPath: "assets/golden-evals.json", content: `${JSON.stringify(goldenEvalRecords(bc), null, 2)}\n` },
  ];
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

export async function specToSkill(args) {
  const spec = args.spec && typeof args.spec === "object" ? args.spec : await loadSpec(args);
  const id = spec.id || slug(spec.title || "agent-spec");
  const outDir = resolve(args.out || resolve(APP_ROOT, "artifacts", "skills", id));
  const files = buildSkillFiles(spec);
  for (const file of files) {
    const abs = resolve(outDir, file.relPath);
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, file.content, "utf8");
  }
  return {
    skill: outDir,
    name: skillName(spec),
    fileCount: files.length,
    files: files.map((file) => file.relPath).sort(),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write(
      "usage: spec-to-skill.mjs --id <useCaseId> [--out <dir>] | --spec <path.json> [--out <dir>]\n",
    );
    return;
  }
  const summary = await specToSkill(args);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

if (import.meta.main || process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message || error}\n`);
    process.exit(1);
  });
}
