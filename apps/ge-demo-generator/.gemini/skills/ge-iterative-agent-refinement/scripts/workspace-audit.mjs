#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] || ".");
const files = [];

async function walk(dir, rel = "") {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".env.example") continue;
    const nextRel = rel ? `${rel}/${entry.name}` : entry.name;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, nextRel);
    else if (entry.isFile()) {
      const info = await stat(full);
      files.push({ path: nextRel, size: info.size, mtime: info.mtimeMs });
    }
  }
}

async function readJsonSafe(rel) {
  const path = join(root, rel);
  if (!existsSync(path)) return null;
  try { return JSON.parse(await readFile(path, "utf8")); } catch { return null; }
}

await walk(root);

const manifest = files.find((file) => file.path === "workspace.json");
const runLogs = files.filter((file) => file.path.startsWith("runs/") && file.path.endsWith("events.jsonl"));
const python = files.filter((file) => file.path.endsWith(".py"));
const readmes = files.filter((file) => /readme\.md$/i.test(file.path));
const manifests = files.filter((file) => /manifest.*\.json$|workspace\.json$|agent.*\.json$/i.test(file.path));

console.log(`workspace: ${root}`);
console.log(`files: ${files.length}`);
console.log(`workspace manifest: ${manifest ? "yes" : "no"}`);
console.log(`run logs: ${runLogs.length}`);
console.log(`python files: ${python.length}`);
console.log(`readmes: ${readmes.length}`);
console.log(`json manifests: ${manifests.length}`);

const useCaseSpec = await readJsonSafe("mock_systems/usecase-spec.json");
const fixtureManifest = await readJsonSafe("fixtures/manifest.json");
const golden = await readJsonSafe("evals/golden.json");
const contract = useCaseSpec?.behaviorContract || fixtureManifest?.useCaseSpec?.behaviorContract || null;
const intents = Array.isArray(contract?.toolIntents) ? contract.toolIntents : [];
const nonQuery = intents.filter((intent) => intent && intent.kind && intent.kind !== "query");
const agentText = existsSync(join(root, "app/agent.py")) ? await readFile(join(root, "app/agent.py"), "utf8") : "";
const toolsText = existsSync(join(root, "app/tools.py")) ? await readFile(join(root, "app/tools.py"), "utf8") : "";
const genericStub = /Use the fixture-backed source adapters to inspect available data\. Never invent data\./.test(agentText);
const hasInstructionSections = /PRIMARY OBJECTIVE/.test(agentText) && /TOOL PLAYBOOK/.test(agentText);

console.log("");
console.log("behavior contract:");
console.log(`  present: ${contract ? "yes" : "NO (factory will emit a generic shell)"}`);
console.log(`  tool intents: ${intents.length} (non-query: ${nonQuery.length})`);
console.log(`  evidence requirements: ${(contract?.evidenceRequirements || []).length}`);
console.log(`  escalation rules: ${(contract?.escalationRules || []).length}`);
console.log(`  refusal rules: ${(contract?.refusalRules || []).length}`);
console.log(`  golden evals: ${(contract?.goldenEvals || []).length}`);
console.log(`  evals/golden.json present: ${golden ? "yes" : "no"}`);
console.log(`  agent.py uses generic instruction stub: ${genericStub ? "YES (must replace)" : "no"}`);
console.log(`  agent.py has PRIMARY OBJECTIVE + TOOL PLAYBOOK sections: ${hasInstructionSections ? "yes" : "no"}`);

if (contract) {
  const missingTools = nonQuery
    .map((intent) => (intent.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""))
    .filter((name) => name && !new RegExp(`\\bdef\\s+${name}\\b`).test(toolsText));
  if (missingTools.length) console.log(`  contract tool functions missing from app/tools.py: ${missingTools.join(", ")}`);
}

console.log("");
console.log("top files:");
for (const file of files.slice(0, 30)) {
  console.log(`- ${file.path} (${file.size} bytes)`);
}

if (manifest) {
  console.log("");
  console.log("workspace.json:");
  console.log(await readFile(join(root, manifest.path), "utf8"));
}
