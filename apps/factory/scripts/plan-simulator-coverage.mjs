#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { parseFlagArgs } from "../../../tools/lib/cli-args.mjs";
import { dirname, resolve } from "node:path";
import { findSimulatorForSystem, loadSimulatorRegistry } from "./factory/simulators/registry.mjs";

const FIRST_PARTY_MCP_PATTERNS = [
  /bigquery/i,
  /google drive/i,
  /google docs/i,
  /google sheets/i,
  /google slides/i,
  /google calendar/i,
  /gmail/i,
  /youtube/i,
  /maps/i,
];

const PLATFORM_PATTERNS = [
  /vertex ai/i,
  /gemini/i,
  /document ai/i,
  /looker/i,
];

const DOMAIN_FACADE_PATTERNS = [
  /slack/i,
  /google workspace/i,
  /google chat/i,
  /confluence/i,
  /sharepoint/i,
  /policy docs?/i,
  /contract repository/i,
];

const parseArgs = (argv) => parseFlagArgs(argv).flags;

function matchesAny(name, patterns) {
  return patterns.some((pattern) => pattern.test(name));
}

function isOperational(source) {
  return source.dataKind === "operational_system" || source.category === "erp" || source.category === "clm";
}

function coverageForSource(source, inventoryByName, simulatorRegistry) {
  const name = source.system || "unknown";
  const inventory = inventoryByName.get(name);
  const simulator = findSimulatorForSystem(name, simulatorRegistry);
  if (simulator) {
    return {
      status: "simulator",
      simulatorId: simulator.id,
      maturity: simulator.maturity,
      detail: `${simulator.displayName} simulator`,
    };
  }
  if (matchesAny(name, FIRST_PARTY_MCP_PATTERNS)) {
    return { status: "first_party_mcp", detail: "Prefer first-party Google MCP or managed Google API surface" };
  }
  if (source.dataKind === "ai_or_model" || matchesAny(name, PLATFORM_PATTERNS)) {
    return { status: "platform_dependency", detail: "Runtime/platform dependency; no third-party simulator required" };
  }
  if (matchesAny(name, DOMAIN_FACADE_PATTERNS)) {
    return { status: "domain_facade", detail: "Use document/event facade over fixture or cloud stores" };
  }
  if (inventory?.priority === "tier-1-cross-domain-simulator" || (isOperational(source) && source.direction !== "read")) {
    return { status: "missing", detail: "Needs simulator-backed behavior or explicit exception" };
  }
  if (isOperational(source)) {
    return { status: "generic_fixture", detail: "Operational fixture fallback until simulator is implemented" };
  }
  return { status: "generic_fixture", detail: "Fixture/feed fallback is acceptable for now" };
}

function severity(status) {
  if (status === "missing") return "fail";
  if (status === "generic_fixture") return "warn";
  return "pass";
}

function renderMarkdown(report) {
  const lines = [
    "# Simulator Coverage Report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    `Use cases: ${report.useCaseCount}`,
    "",
    `Sources: ${report.sourceCount}`,
    "",
    "## Summary",
    "",
    "| Status | Count |",
    "| --- | ---: |",
  ];
  for (const [status, count] of Object.entries(report.summary)) {
    lines.push(`| ${status} | ${count} |`);
  }
  lines.push("", "## Gate Results", "");
  lines.push(`- Failing sources: ${report.gates.failures.length}`);
  lines.push(`- Warning sources: ${report.gates.warnings.length}`);
  lines.push("");

  lines.push("## Failing Sources", "");
  lines.push("| Use Case | System | Direction | Kind | Reason |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const item of report.gates.failures.slice(0, 120)) {
    lines.push(`| ${item.useCase} | ${item.system} | ${item.direction} | ${item.dataKind} | ${item.detail} |`);
  }
  lines.push("");

  lines.push("## Coverage By Use Case", "");
  for (const useCase of report.useCases) {
    const failCount = useCase.sources.filter((s) => s.severity === "fail").length;
    const warnCount = useCase.sources.filter((s) => s.severity === "warn").length;
    if (failCount === 0 && warnCount === 0) continue;
    lines.push(`### ${useCase.department}/${useCase.id} - ${useCase.title}`, "");
    lines.push("| System | Coverage | Severity | Detail |");
    lines.push("| --- | --- | --- | --- |");
    for (const source of useCase.sources) {
      if (source.severity === "pass") continue;
      lines.push(`| ${source.system} | ${source.coverage} | ${source.severity} | ${source.detail} |`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const sourcePath = resolve(flags.source || "apps/factory/src/use-case-source-map.generated.json");
  const inventoryPath = resolve(flags.inventory || "apps/factory/artifacts/upstream-system-inventory.json");
  const outJson = resolve(flags.json || "apps/factory/artifacts/simulator-coverage.json");
  const outMd = resolve(flags.md || "apps/factory/artifacts/simulator-coverage.md");
  const sourceMap = JSON.parse(await readFile(sourcePath, "utf8"));
  const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
  const simulatorRegistry = loadSimulatorRegistry();
  const inventoryByName = new Map(inventory.systems.map((system) => [system.name, system]));

  const summary = {};
  const failures = [];
  const warnings = [];
  let sourceCount = 0;
  const useCases = (sourceMap.useCases || []).map((useCase) => {
    const sources = (useCase.sources || []).map((source) => {
      sourceCount += 1;
      const coverage = coverageForSource(source, inventoryByName, simulatorRegistry);
      summary[coverage.status] = (summary[coverage.status] || 0) + 1;
      const row = {
        system: source.system,
        direction: source.direction,
        dataKind: source.dataKind,
        coverage: coverage.status,
        severity: severity(coverage.status),
        simulatorId: coverage.simulatorId || null,
        maturity: coverage.maturity || null,
        detail: coverage.detail,
      };
      const gateItem = {
        useCase: `${useCase.department}/${useCase.id}`,
        system: row.system,
        direction: row.direction,
        dataKind: row.dataKind,
        detail: row.detail,
      };
      if (row.severity === "fail") failures.push(gateItem);
      if (row.severity === "warn") warnings.push(gateItem);
      return row;
    });
    return {
      id: useCase.id,
      department: useCase.department,
      title: useCase.title,
      sources,
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    source: sourcePath,
    inventory: inventoryPath,
    useCaseCount: useCases.length,
    sourceCount,
    summary,
    gates: {
      pass: failures.length === 0,
      failures,
      warnings,
    },
    simulatorRegistry: {
      path: simulatorRegistry.path,
      version: simulatorRegistry.version,
    },
    implementedSimulators: simulatorRegistry.simulators,
    useCases,
  };

  await mkdir(dirname(outJson), { recursive: true });
  await mkdir(dirname(outMd), { recursive: true });
  await writeFile(outJson, JSON.stringify(report, null, 2) + "\n", "utf8");
  await writeFile(outMd, renderMarkdown(report) + "\n", "utf8");
  console.log(JSON.stringify({ ok: true, pass: report.gates.pass, failures: failures.length, warnings: warnings.length, json: outJson, markdown: outMd }, null, 2));
  if (flags.check === "true" && !report.gates.pass) process.exit(2);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
