#!/usr/bin/env node
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { parseFlagArgs } from "../../../tools/lib/cli-args.mjs";
import { existsSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

const parseArgs = (argv) => parseFlagArgs(argv).flags;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile() && path.endsWith(".tsx")) files.push(path);
  }
  return files;
}

function unescapeText(value = "") {
  return value.replace(/\\"/g, '"').replace(/\\'/g, "'");
}

function inferDataKind(source) {
  const text = `${source.system} ${source.description} ${source.category} ${source.protocol}`.toLowerCase();
  if (/vertex|gemini|document ai|bigquery ml/.test(text)) return "ai_or_model";
  if (/bigquery|looker|warehouse|analytics|dashboard|metric|time-series|score|model/.test(text)) return "analytics_warehouse";
  if (/drive|docs|confluence|sharepoint|document|policy|pdf|guide|content|knowledge/.test(text)) return "document_store";
  if (/chat|slack|email|gmail|calendar|workspace|collaboration/.test(text)) return "collaboration_event";
  if (/workday|benefit|benefitfocus|salesforce|servicenow|sap|coupa|ariba|hubspot|marketo|concur|fieldglass|beeline|erp|crm|hris|clm|vms/.test(text)) return "operational_system";
  if (/d&b|rapidratings|bitsight|resilinc|gartner|g2|trustpilot|benchmark|market|external|news|intent/.test(text)) return "external_feed";
  return "operational_system";
}

function recommendedMock(source) {
  const kind = inferDataKind(source);
  if (kind === "analytics_warehouse") return { local: "fixtures/tables", cloud: "BigQuery table", shape: "metrics, snapshots, facts, time series" };
  if (kind === "document_store") return { local: "fixtures/documents + documents_manifest", cloud: "Cloud Storage + BigQuery documents_manifest", shape: "documents with metadata, sections, citations" };
  if (kind === "collaboration_event") return { local: "fixtures/tables", cloud: "BigQuery event table; optional API mock", shape: "messages, events, notifications, delivery state" };
  if (kind === "external_feed") return { local: "fixtures/tables", cloud: "BigQuery raw/staged feed table", shape: "provider snapshots, scores, observations, timestamps" };
  if (kind === "ai_or_model") return { local: "not a data source", cloud: "model/runtime dependency", shape: "do not generate mock tables except eval prompts" };
  return { local: "fixtures/tables", cloud: "BigQuery table or API-backed operational mock", shape: "source records with IDs, status, timestamps, audit fields" };
}

function parseUseCase(file, rootDir) {
  const text = file.text;
  const title = text.match(/title="([^"]+)"/)?.[1] || basename(file.path, ".tsx");
  const systemsRaw = text.match(/systems=\{\[([\s\S]*?)\]\}/)?.[1] || "";
  const systems = Array.from(systemsRaw.matchAll(/"([^"]+)"/g)).map((m) => m[1]);
  const sources = [];
  const connectionRe = /\{\s*system:\s*"([^"]+)",\s*description:\s*"([\s\S]*?)",\s*direction:\s*"([^"]+)",\s*protocol:\s*"([^"]+)",\s*category:\s*"([^"]+)"\s*\}/g;
  for (const match of text.matchAll(connectionRe)) {
    const source = {
      system: unescapeText(match[1]),
      description: unescapeText(match[2]),
      direction: match[3],
      protocol: match[4],
      category: match[5],
    };
    source.dataKind = inferDataKind(source);
    source.recommended = recommendedMock(source);
    sources.push(source);
  }
  for (const system of systems) {
    if (!sources.some((source) => source.system.toLowerCase() === system.toLowerCase())) {
      const source = { system, description: "Declared on UseCaseSlide systems prop.", direction: "read", protocol: "unknown", category: "declared" };
      source.dataKind = inferDataKind(source);
      source.recommended = recommendedMock(source);
      sources.push(source);
    }
  }
  return {
    id: basename(file.path, ".tsx"),
    department: relative(rootDir, dirname(file.path)).split("/")[0] || "unknown",
    title,
    path: relative(process.cwd(), file.path),
    systems,
    sources,
  };
}

function renderMarkdown(useCases) {
  const byKind = new Map();
  for (const useCase of useCases) {
    for (const source of useCase.sources) {
      if (!byKind.has(source.dataKind)) byKind.set(source.dataKind, new Map());
      const systems = byKind.get(source.dataKind);
      if (!systems.has(source.system)) systems.set(source.system, { count: 0, examples: [], recommended: source.recommended });
      const item = systems.get(source.system);
      item.count += 1;
      if (item.examples.length < 4) item.examples.push(`${useCase.department}/${useCase.id}`);
    }
  }

  const lines = [
    "# Use Case Data Source Map",
    "",
    "Generated from `src/components/slides/use-cases`. Use this to choose the right mock source shape before generating fixtures.",
    "",
    "## Source Classes",
    "",
  ];
  for (const [kind, systems] of Array.from(byKind.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`### ${kind}`, "");
    lines.push("| System | Uses | Recommended Cloud Target | Data Shape | Examples |");
    lines.push("| --- | ---: | --- | --- | --- |");
    for (const [system, item] of Array.from(systems.entries()).sort(([a], [b]) => a.localeCompare(b))) {
      lines.push(`| ${system} | ${item.count} | ${item.recommended.cloud} | ${item.recommended.shape} | ${item.examples.join(", ")} |`);
    }
    lines.push("");
  }

  lines.push("## Per Use Case", "");
  for (const useCase of useCases) {
    lines.push(`### ${useCase.department}/${useCase.id} — ${useCase.title}`, "");
    lines.push("| System | Kind | Direction | Protocol | Mock Target |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const source of useCase.sources) {
      lines.push(`| ${source.system} | ${source.dataKind} | ${source.direction} | ${source.protocol} | ${source.recommended.cloud} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const rootDir = resolve(flags.slides || "../presentation/src/components/slides/use-cases");
  if (!existsSync(rootDir)) throw new Error(`Slides directory not found: ${rootDir}`);
  const files = await walk(rootDir);
  const loaded = await Promise.all(files.map(async (path) => ({ path, text: await readFile(path, "utf8") })));
  const useCases = loaded.map((file) => parseUseCase(file, rootDir));
  const outJson = resolve(flags.json || "src/use-case-source-map.generated.json");
  const outMd = resolve(flags.md || "docs/use-case-data-source-map.md");
  await mkdir(dirname(outJson), { recursive: true });
  await mkdir(dirname(outMd), { recursive: true });
  await writeFile(outJson, JSON.stringify({ generatedAt: new Date().toISOString(), sourceRoot: rootDir, useCases }, null, 2) + "\n", "utf8");
  await writeFile(outMd, renderMarkdown(useCases) + "\n", "utf8");
  console.log(JSON.stringify({ ok: true, useCases: useCases.length, json: outJson, markdown: outMd }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
