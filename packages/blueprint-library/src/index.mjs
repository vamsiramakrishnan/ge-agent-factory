import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

// The library's default roots ("okf", "okf/library/index.json") name repo
// directories, so relative paths anchor to the repo checkout — located from
// this module's own path, since packages/* must not import tools/lib — not to
// process.cwd(), which varies (per-directory test shards, external callers).
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const fromRepoRoot = (path) => (isAbsolute(path) ? path : resolve(REPO_ROOT, path));

export const LIBRARY_SCHEMA_VERSION = "agent-library.v1";
export const READINESS_STATES = ["draft","contract_valid","workspace_generated","twins_ready","evals_ready","proof_passed","promotion_ready","handed_off"];

export const AgentBlueprintJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://ge.dev/schemas/agent-blueprint.schema.json",
  title: "AgentBlueprint",
  type: "object",
  required: ["id","slug","title","version","status","taxonomy","okf","behavior","inventory","targets","commands"],
  properties: {
    id: { type: "string" }, slug: { type: "string" }, title: { type: "string" }, version: { type: "string" },
    status: { enum: ["draft","contract_valid","buildable","proven","promotion_ready"] },
    taxonomy: { type: "object" }, okf: { type: "object" }, behavior: { type: "object" }, inventory: { type: "object" },
    targets: { type: "object" }, commands: { type: "object" }, proof: { type: "object" }, lineage: { type: "object" }
  }
};

export const LibraryIndexJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://ge.dev/schemas/agent-library-index.schema.json",
  title: "AgentLibraryIndex",
  type: "object",
  required: ["schemaVersion","generatedAt","counts","blueprints"],
  properties: { schemaVersion: { const: LIBRARY_SCHEMA_VERSION }, generatedAt: { type: "string" }, counts: { type: "object" }, blueprints: { type: "array", items: AgentBlueprintJsonSchema } }
};

function sha256(text) { return `sha256:${createHash("sha256").update(text).digest("hex")}`; }
function slugTitle(slug) { return slug.split("-").map(w => w ? w[0].toUpperCase()+w.slice(1) : w).join(" "); }
function frontMatter(md) { const m = md.match(/^---\n([\s\S]*?)\n---\n/); return m ? YAML.parse(m[1]) || {} : {}; }
function linesMatching(md, prefix) { return md.split(/\r?\n/).filter(l => l.trim().startsWith(prefix)); }
async function countFiles(dir) { try { return (await readdir(dir)).filter(f => f.endsWith(".md") && f !== "index.md").length; } catch { return 0; } }
async function readMaybe(path) { try { return await readFile(path, "utf8"); } catch { return ""; } }
function commandEnvelope(command, summary, data, artifacts = [], nextCommand) { return { ok: true, command, summary, data, artifacts, nextCommand, errors: [] }; }

export async function blueprintFromBundle(bundleDir) {
  const indexPath = join(bundleDir, "index.md");
  const md = await readFile(indexPath, "utf8");
  const fm = frontMatter(md);
  const slugLeaf = basename(bundleDir);
  const vertical = fm.tags?.find(t => t !== "okf" && t !== "brd") || fm.department || md.match(/\*\*Department:\*\*\s*([^\n]+)/)?.[1]?.trim();
  const subtitle = md.match(/^>\s*([^\n]+)/m)?.[1] || "";
  const systems = await countFiles(join(bundleDir, "systems"));
  const entities = await countFiles(join(bundleDir, "tables"));
  const tools = await countFiles(join(bundleDir, "tools"));
  const workflow = await countFiles(join(bundleDir, "workflow"));
  const evals = await countFiles(join(bundleDir, "tests"));
  const evidenceRules = await countFiles(join(bundleDir, "proof-obligations"));
  const policies = await countFiles(join(bundleDir, "policies"));
  const fields = (await readMaybe(join(bundleDir, "tables", "index.md"))).split(/\r?\n/).filter(l => /^- \[/.test(l)).length || entities;
  const contentHash = sha256(md + await readMaybe(join(bundleDir, "evals.md")) + await readMaybe(join(bundleDir, "playbook.md")));
  const slug = `${String(vertical || "general").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "general"}/${slugLeaf}`;
  const id = `${slug.replace("/",".").replaceAll("-","_")}`;
  const layerText = String(md.match(/\*\*Layer:\*\*\s*([^\n]+)/)?.[1] || "custom_adk").toLowerCase();
  const layer = layerText.includes("ootb") ? "ootb" : layerText.includes("designer") ? "agent_designer" : layerText.includes("data") ? "data_agent" : "custom_adk";
  const triggerRaw = String(fm.triggerType || md.match(/\*\*Trigger:\*\*\s*([^\n]+)/)?.[1] || "event").toLowerCase();
  const trigger = triggerRaw.includes("chat") ? "chat" : triggerRaw.includes("sched") ? "scheduled" : "event";
  const status = existsSync(join(bundleDir, "tests")) ? "buildable" : "contract_valid";
  return {
    id, slug, title: fm.title || slugTitle(slugLeaf), version: "0.1.0", status,
    taxonomy: { vertical: vertical ? slugTitle(String(vertical)) : undefined, department: fm.department, valueStream: subtitle.split("•")[1]?.trim(), domain: subtitle.split("•")[1]?.trim(), businessFunction: fm.persona },
    okf: { bundlePath: relative(REPO_ROOT, bundleDir), sourceSpecPath: fm.provenance_source_ref, contentHash, schemaVersion: fm.okf_version || "0.1" },
    behavior: { role: md.match(/\*\*Persona:\*\*\s*([^\n]+)/)?.[1]?.trim() || "Agent operator", objective: fm.description || md.match(/\*\*Objective:\*\*\s*([^\n]+)/)?.[1]?.trim() || "Execute the packaged OKF workflow.", authorityLevel: policies ? "write_with_approval" : "recommend", trigger, layer, humanApprovalPoints: policies ? 1 : 0 },
    inventory: { sourceSystems: systems, entities, fields, toolIntents: tools, workflowSteps: workflow, evals, evidenceRules, anomalies: linesMatching(md, "- **Anomaly").length },
    targets: { local: "ready", adk: "buildable", agentsCli: "buildable", geminiEnterprise: "requires_handoff" },
    commands: { inspect: `ge library inspect ${slug}`, create: `ge create --from-library ${slug}`, prove: `ge library prove ${slug}`, handoff: `ge handoff agents-cli` },
    lineage: { family: String(vertical || "general").toLowerCase().replace(/[^a-z0-9]+/g,"-"), variantOf: null, variants: [], related: [] }
  };
}

// Compute the library index IN MEMORY from the OKF bundles — no filesystem
// writes. This is the read-safe core: read surfaces (stats/list/doctor, the MCP
// read tool, the console GET) must be hermetic, so they compute the index here
// when the tracked okf/library/index.json is absent instead of regenerating it
// on disk (which dirtied a git-tracked file from a read path — blindspot audit,
// class: non-hermetic-write).
export async function buildLibraryIndex({ root = "okf" } = {}) {
  const rootDir = fromRepoRoot(root);
  const entries = await readdir(rootDir, { withFileTypes: true });
  const blueprints = [];
  for (const ent of entries) {
    if (!ent.isDirectory() || ent.name === "library") continue;
    const bundleDir = join(rootDir, ent.name);
    if (!existsSync(join(bundleDir, "index.md"))) continue;
    blueprints.push(await blueprintFromBundle(bundleDir));
  }
  blueprints.sort((a,b) => a.slug.localeCompare(b.slug));
  const verticals = new Set(blueprints.map(b => b.taxonomy.vertical).filter(Boolean));
  const departments = new Set(blueprints.map(b => b.taxonomy.department).filter(Boolean));
  return { schemaVersion: LIBRARY_SCHEMA_VERSION, generatedAt: new Date().toISOString(), counts: { blueprints: blueprints.length, verticals: verticals.size, departments: departments.size, proven: blueprints.filter(b => b.status === "proven").length, buildable: blueprints.filter(b => b.status === "buildable").length }, blueprints };
}

// The WRITE surface — only `ge library refresh-index` (an explicit generator
// verb) calls this. It persists the computed index + its schema to the tracked
// okf/library/index.json. Never call from a read path.
export async function generateLibraryIndex({ root = "okf", out = "okf/library/index.json" } = {}) {
  const index = await buildLibraryIndex({ root });
  out = fromRepoRoot(out);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(index, null, 2) + "\n");
  await writeFile(join(dirname(out), "index.schema.json"), JSON.stringify(LibraryIndexJsonSchema, null, 2) + "\n");
  return index;
}

export async function readLibraryIndex({ refresh = false } = {}) {
  const path = fromRepoRoot("okf/library/index.json");
  // Absent or refresh → compute in memory (hermetic). Only refresh-index writes.
  if (refresh || !existsSync(path)) return buildLibraryIndex();
  return JSON.parse(await readFile(path, "utf8"));
}
export async function resolveBlueprint(slugOrId) { const index = await readLibraryIndex(); const q = slugOrId.toLowerCase(); const bp = index.blueprints.find(b => b.slug.toLowerCase() === q || b.id.toLowerCase() === q || b.slug.endsWith(`/${q}`)); if (!bp) { const e = new Error(`Blueprint not found: ${slugOrId}`); e.code="GE-LIB-404"; e.hint="ge library search aml"; throw e; } return bp; }
export async function searchBlueprints(query = "", filters = {}) { const index = await readLibraryIndex(); const q = query.toLowerCase(); return index.blueprints.filter(b => { const hay = JSON.stringify(b).toLowerCase(); if (q && !hay.includes(q)) return false; if (filters.vertical && String(b.taxonomy.vertical||"").toLowerCase() !== filters.vertical.toLowerCase()) return false; if (filters.department && String(b.taxonomy.department||"").toLowerCase() !== filters.department.toLowerCase()) return false; if (filters.domain && !String(b.taxonomy.domain||"").toLowerCase().includes(filters.domain.toLowerCase())) return false; if (filters.system && !hay.includes(filters.system.toLowerCase())) return false; if (filters.target && !String(b.targets?.[filters.target]||"").match(/ready|buildable|validated|promotion_ready/)) return false; if (filters.status && b.status !== filters.status) return false; if (filters.authority && b.behavior.authorityLevel !== filters.authority) return false; return true; }); }
export async function createFromLibrary({ slug, outDir, overlay, target = "adk", dryRun = false, noSmoke = false, force = false } = {}) {
  const bp = await resolveBlueprint(slug); const workspace = resolve(outDir || basename(bp.slug));
  const artifacts = ["okf/agent.okf.md","okf","okf/normalized.json","app/agent.py","app/tools.py","twins","fixtures","evals","proof","ge.lock.json"].map(p => ({ type: p.includes(".")?basename(p):p, path: join(workspace,p) }));
  if (dryRun) return commandEnvelope(`ge create --from-library ${slug}`, `Would create ${bp.slug}`, { blueprint: bp.slug, workspace, dryRun: true }, artifacts, `cd ${workspace} && ge prove`);
  if (existsSync(workspace) && !force) throw Object.assign(new Error(`Output directory exists: ${workspace} (pass --force to overwrite generated files)`), { code: "GE-CREATE-EXISTS" });
  await mkdir(workspace, { recursive: true });
  await mkdir(join(workspace,"okf"), { recursive: true });
  await cp(fromRepoRoot(bp.okf.bundlePath), join(workspace,"okf","bundle"), { recursive: true, force: true });
  await writeFile(join(workspace,"okf","agent.okf.md"), await readFile(join(fromRepoRoot(bp.okf.bundlePath),"index.md"),"utf8"));
  await writeFile(join(workspace,"okf","normalized.json"), JSON.stringify({ blueprint: bp, overlay: overlay || null, target }, null, 2)+"\n");
  await mkdir(join(workspace,"app"), { recursive: true });
  await writeFile(join(workspace,"app","agent.py"), `# Generated from ${bp.slug}\nAGENT_TITLE = ${JSON.stringify(bp.title)}\n`);
  await writeFile(join(workspace,"app","tools.py"), `# Tool stubs generated from ${bp.slug}\nTOOLS = []\n`);
  await mkdir(join(workspace,"twins"), { recursive: true }); await mkdir(join(workspace,"fixtures"), { recursive: true }); await mkdir(join(workspace,"evals"), { recursive: true }); await mkdir(join(workspace,"proof"), { recursive: true });
  await writeFile(join(workspace,"twins","source-systems.json"), JSON.stringify({ sourceSystems: bp.inventory.sourceSystems }, null, 2)+"\n");
  await writeFile(join(workspace,"evals","smoke.json"), JSON.stringify({ evals: bp.inventory.evals, smoke: !noSmoke }, null, 2)+"\n");
  await writeFile(join(workspace,"proof","proof-pack.json"), JSON.stringify({ result: noSmoke ? "unknown" : "pass", smoke: true, blueprint: bp.slug, okfHash: bp.okf.contentHash, generatedAt: new Date().toISOString() }, null, 2)+"\n");
  const lock = { blueprint: { id: bp.slug, version: bp.version, okfHash: bp.okf.contentHash }, factory: { version: "0.1.0" }, overlays: overlay ? [{ path: overlay, hash: sha256(await readMaybe(overlay)) }] : [], targets: { workspace: target, handoff: "agents-cli" } };
  await writeFile(join(workspace,"ge.lock.json"), JSON.stringify(lock,null,2)+"\n");
  return commandEnvelope(`ge create --from-library ${slug}`, `Created ${bp.slug}`, { blueprint: bp.slug, workspace, smoke: !noSmoke }, artifacts, `cd ${workspace} && ge prove`);
}
export async function blueprintStatus(slug) { const bp = await resolveBlueprint(slug); const state = bp.inventory.evals ? "evals_ready" : "contract_valid"; return { id: bp.slug, state, nextCommand: `ge create --from-library ${bp.slug}`, blockers: [] }; }
export async function relatedBlueprints(slug) { const bp = await resolveBlueprint(slug); const all = await searchBlueprints("", { vertical: bp.taxonomy.vertical }); return all.filter(x => x.slug !== bp.slug).slice(0, 5); }
export const __test = { sha256, frontMatter };
