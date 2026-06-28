#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    flags[key] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
  }
  return flags;
}

function familyOf(system) {
  const s = system.toLowerCase();
  if (/workday|successfactors|cornerstone|greenhouse|lattice|\bats\b|\blms\b|culture amp|mercer/.test(s)) return "hr-talent";
  if (/sap|oracle financial|blackline|anaplan|kyriba|highradius|coupa|ariba|concur|basware|taulia|c2fo|avalara|vertex tax|workiva/.test(s)) return "finance-procurement";
  if (/servicenow|jira|github|datadog|pagerduty|okta|crowdstrike|confluence|sonarqube|kubernetes|terraform|splunk|chronicle/.test(s)) return "it-ops-security";
  if (/salesforce|hubspot|marketo|ga4|google analytics|google ads|linkedin|semrush|ahrefs|sprout|wordpress|figma|canva|bynder|brandfolder/.test(s)) return "crm-marketing";
  if (/icertis|docusign|contract|agiloft/.test(s)) return "contract-lifecycle";
  if (/bigquery|looker|google docs|google drive|google workspace|gmail|google calendar|google sheets|google slides|slack|vertex|gemini|document ai/.test(s)) return "platform-google-collaboration";
  if (/d&b|dun & bradstreet|bloomberg|reuters|gartner|g2|ofac|world-check|lexisnexis|resilinc|everstream|weather|news|platt|moody/.test(s)) return "external-feeds";
  return "long-tail-domain";
}

function priorityOf(record) {
  if (record.dataKinds.has("ai_or_model")) return "platform-dependency";
  if (record.name === "BigQuery" || record.name === "Vertex AI" || record.name === "Vertex AI (Gemini)") return "platform-dependency";
  if (record.count >= 20 && [...record.departments].length >= 2) return "tier-1-cross-domain-simulator";
  if (record.count >= 8) return "tier-2-domain-simulator";
  if (record.count >= 3) return "tier-3-adapter-template";
  return "tier-4-generic-feed-or-fixture";
}

function rowFromRecord(record) {
  return {
    name: record.name,
    count: record.count,
    family: familyOf(record.name),
    priority: priorityOf(record),
    departments: [...record.departments].sort(),
    categories: [...record.categories].sort(),
    protocols: [...record.protocols].sort(),
    directions: [...record.directions].sort(),
    dataKinds: [...record.dataKinds].sort(),
    sampleUseCases: record.useCases.slice(0, 8),
  };
}

function renderMarkdown({ generatedAt, source, useCaseCount, systems }) {
  const lines = [
    "# Upstream System Inventory",
    "",
    `Generated: ${generatedAt}`,
    "",
    `Source: \`${source}\``,
    "",
    `Use cases: ${useCaseCount}`,
    "",
    `Unique upstream systems: ${systems.length}`,
    "",
    "## Priority Model",
    "",
    "- **tier-1-cross-domain-simulator**: high reuse across departments; build stateful simulator first.",
    "- **tier-2-domain-simulator**: domain-specific but recurring; build reusable simulator packs.",
    "- **tier-3-adapter-template**: create schema/tool templates and generic state models.",
    "- **tier-4-generic-feed-or-fixture**: keep as feed fixtures unless a scenario needs richer behavior.",
    "- **platform-dependency**: first-party/runtime dependency, not a third-party simulator.",
    "",
  ];

  const byPriority = new Map();
  for (const system of systems) {
    if (!byPriority.has(system.priority)) byPriority.set(system.priority, []);
    byPriority.get(system.priority).push(system);
  }
  for (const priority of ["tier-1-cross-domain-simulator", "tier-2-domain-simulator", "tier-3-adapter-template", "tier-4-generic-feed-or-fixture", "platform-dependency"]) {
    const group = byPriority.get(priority) || [];
    lines.push(`## ${priority}`, "");
    lines.push("| System | Uses | Family | Departments | Data Kinds | Protocols |");
    lines.push("| --- | ---: | --- | --- | --- | --- |");
    for (const system of group.slice(0, 80)) {
      lines.push(`| ${system.name} | ${system.count} | ${system.family} | ${system.departments.join(", ")} | ${system.dataKinds.join(", ")} | ${system.protocols.join(", ")} |`);
    }
    lines.push("");
  }

  lines.push("## First Simulator Candidates", "");
  lines.push("| Candidate | Why | Simulator Focus |");
  lines.push("| --- | --- | --- |");
  for (const candidate of systems.filter((s) => s.priority === "tier-1-cross-domain-simulator").slice(0, 12)) {
    lines.push(`| ${candidate.name} | ${candidate.count} source references across ${candidate.departments.join(", ")} | ${candidate.family} state, permissions, workflows, audit events |`);
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const source = resolve(flags.source || "apps/factory/src/use-case-source-map.generated.json");
  const outJson = resolve(flags.json || "apps/factory/artifacts/upstream-system-inventory.json");
  const outMd = resolve(flags.md || "apps/factory/artifacts/upstream-system-inventory.md");
  const data = JSON.parse(await readFile(source, "utf8"));
  const records = new Map();

  for (const useCase of data.useCases || []) {
    for (const src of useCase.sources || []) {
      const name = src.system || "unknown";
      const record = records.get(name) || {
        name,
        count: 0,
        departments: new Set(),
        categories: new Set(),
        protocols: new Set(),
        directions: new Set(),
        dataKinds: new Set(),
        useCases: [],
      };
      record.count += 1;
      if (useCase.department) record.departments.add(useCase.department);
      if (src.category) record.categories.add(src.category);
      if (src.protocol) record.protocols.add(src.protocol);
      if (src.direction) record.directions.add(src.direction);
      if (src.dataKind) record.dataKinds.add(src.dataKind);
      record.useCases.push(`${useCase.department}/${useCase.id}`);
      records.set(name, record);
    }
  }

  const systems = [...records.values()]
    .map(rowFromRecord)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const inventory = {
    generatedAt: new Date().toISOString(),
    source,
    useCaseCount: (data.useCases || []).length,
    systemCount: systems.length,
    systems,
  };

  await mkdir(dirname(outJson), { recursive: true });
  await mkdir(dirname(outMd), { recursive: true });
  await writeFile(outJson, JSON.stringify(inventory, null, 2) + "\n", "utf8");
  await writeFile(outMd, renderMarkdown(inventory) + "\n", "utf8");
  console.log(JSON.stringify({ ok: true, systems: systems.length, useCases: inventory.useCaseCount, json: outJson, markdown: outMd }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
