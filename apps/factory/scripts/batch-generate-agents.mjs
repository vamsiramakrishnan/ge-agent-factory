#!/usr/bin/env node
/**
 * Batch-generate local-first GE agent workspaces.
 *
 * Pipeline per use case:
 *   create workspace/mock data/ADK files -> validate -> adk run preview -> deploy plan
 *
 * This is intentionally console-first. It uses the existing harness CLI for
 * deterministic generation/validation/planning and the local web/daemon API
 * for the ADK run preview.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { parseList } from "@ge/std/list";
import { parseFlagArgs, boolFlag } from "@ge/std/cli-args";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getUseCases } from "../src/use-cases.js";
import { slug as baseSlug } from "@ge/std/naming";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, "..");
const DEFAULT_WEB_URL = process.env.GE_HARNESS_WEB_URL || "http://localhost:17655";

const parseArgs = (argv) => parseFlagArgs(argv).flags;

// boolFlag imported from @ge/std/cli-args

const slug = (value) => baseSlug(value, { max: 72 });

function selectUseCases(flags) {
  if (flags.usecases) {
    const wanted = new Set(parseList(String(flags.usecases)));
    const selected = getUseCases().filter((item) => wanted.has(item.id) || wanted.has(item.title));
    const missing = [...wanted].filter((id) => !selected.some((item) => item.id === id || item.title === id));
    if (missing.length) throw new Error(`Unknown use case(s): ${missing.join(", ")}`);
    return selected;
  }

  const department = flags.department || flags.domain || "hr";
  const offset = Number(flags.offset || 0);
  const limit = Number(flags.limit || 3);
  return getUseCases()
    .filter((item) => item.department === department)
    .slice(offset, offset + limit);
}

function resolveRows(useCase, flags) {
  const raw = String(flags.rows || "auto").toLowerCase();
  if (raw !== "auto") {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 1) throw new Error(`Invalid --rows value: ${flags.rows}`);
    return { rows: Math.floor(parsed), reason: "manual override" };
  }

  const haystack = [
    useCase.id,
    useCase.title,
    useCase.subtitle,
    useCase.persona,
    useCase.layer,
    useCase.triggerType,
    ...(useCase.systems || []),
    ...(useCase.asIs || []),
    ...(useCase.toBe || []),
  ].join(" ").toLowerCase();

  let rows = 40;
  let reason = "workflow default";
  if (/(bigquery|warehouse|analytics|dashboard|report|forecast|prediction|model|benchmark|cohort|trend)/.test(haystack)) {
    rows = 150;
    reason = "analytics/OLAP workload";
  } else if (/(scheduling|orchestration|enrollment|case|ticket|workflow|approval|routing|transaction)/.test(haystack)) {
    rows = 80;
    reason = "transactional workflow";
  } else if (/(q&a|query|assistant|policy|knowledge|document|communication|draft)/.test(haystack)) {
    rows = 48;
    reason = "chat/document workflow";
  }

  const systemCount = Array.isArray(useCase.systems) ? useCase.systems.length : 0;
  if (systemCount >= 5) rows = Math.max(rows, 100);
  if (systemCount <= 2) rows = Math.min(rows, 60);

  const scale = Number(flags["row-scale"] || 1);
  if (!Number.isFinite(scale) || scale <= 0) throw new Error(`Invalid --row-scale value: ${flags["row-scale"]}`);
  rows = Math.round(rows * scale);

  const minRows = Number(flags["min-rows"] || 24);
  const maxRows = Number(flags["max-rows"] || 300);
  rows = Math.max(minRows, Math.min(maxRows, rows));
  return { rows, reason };
}

function extractJson(stdout) {
  const text = String(stdout || "").trim();
  const objects = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (start < 0) {
      if (ch === "{") {
        start = i;
        depth = 1;
      }
      continue;
    }
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === "\"") inString = false;
      continue;
    }
    if (ch === "\"") inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        const candidate = text.slice(start, i + 1);
        try {
          objects.push(JSON.parse(candidate));
        } catch {
          // Keep scanning; non-JSON braces in logs should not break the batch.
        }
        start = -1;
      }
    }
  }
  if (!objects.length) throw new Error(`Command did not emit JSON: ${text.slice(-800)}`);
  return objects[objects.length - 1];
}

function runNodeCli(args, { verbose = false } = {}) {
  const result = spawnSync(process.execPath, ["src/cli.js", ...args], {
    cwd: REPO_ROOT,
    env: process.env,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  if (verbose && stdout) process.stdout.write(stdout);
  if (verbose && stderr) process.stderr.write(stderr);
  return {
    code: result.error ? 1 : result.status ?? 0,
    signal: result.signal,
    stdout,
    stderr: result.error ? `${stderr}${result.error.message}` : stderr,
  };
}

async function runJsonCli(args, options = {}) {
  const result = runNodeCli(args, options);
  if (result.code !== 0) {
    throw new Error(`node src/cli.js ${args.join(" ")} failed with ${result.code}\n${result.stderr || result.stdout}`);
  }
  return { raw: result, json: extractJson(result.stdout) };
}

async function runAdkPreview({ webUrl, workspaceId, prompt }) {
  const url = `${webUrl.replace(/\/+$/, "")}/api/workspaces/${encodeURIComponent(workspaceId)}/adk-run`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`ADK preview endpoint did not return JSON (${response.status}). Is the dev server running at ${webUrl}?\n${text.slice(0, 800)}`);
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || `ADK preview failed with ${response.status}`);
  return data.result;
}

function printStep(workspace, step, detail = "") {
  const suffix = detail ? ` ${detail}` : "";
  console.log(`[${workspace}] ${step}${suffix}`);
}

async function writeSummary(summary) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = join(REPO_ROOT, ".ge", "factory", "artifacts", `batch-agent-generation-${stamp}.json`);
  const mdPath = join(REPO_ROOT, ".ge", "factory", "artifacts", `batch-agent-generation-${stamp}.md`);
  await mkdir(dirname(jsonPath), { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  await writeFile(mdPath, renderMarkdown(summary), "utf8");
  return { jsonPath, mdPath };
}

function renderMarkdown(summary) {
  const lines = [
    "# Batch Agent Generation",
    "",
    `Generated: ${summary.generatedAt}`,
    `Mode: ${summary.options.agentsCli ? "agents-cli scaffold" : "local fast scaffold"}`,
    "",
    "| Workspace | Use case | Create | Validate | Preview | Plan | Next |",
    "| --- | --- | --- | --- | --- | --- | --- |",
  ];
  for (const item of summary.results) {
    lines.push([
      item.workspaceId || item.workspaceName,
      item.useCaseId,
      item.create?.ok ? "ok" : "fail",
      item.validate?.ok ? `ok (${item.validate.testExitCode ?? "?"})` : item.validate ? "fail" : "-",
      item.preview?.ok ? "ok" : item.preview ? "fail" : "-",
      item.deployPlan?.ok ? "ok" : item.deployPlan ? "fail" : "-",
      item.nextAction || "-",
    ].map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | "));
  }
  lines.push("", "## Failures", "");
  const failures = summary.results.filter((item) => item.error);
  if (!failures.length) lines.push("None.");
  for (const item of failures) lines.push(`- ${item.workspaceName}: ${item.error}`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

async function processUseCase(useCase, index, flags) {
  const rowDecision = resolveRows(useCase, flags);
  const rows = String(rowDecision.rows);
  const baseSeed = Number(flags.seed || 101);
  const seed = String(baseSeed + index);
  const department = flags.department || flags.domain || useCase.department || "hr";
  const prefix = flags.prefix || department;
  const workspaceName = slug(`${prefix}-${useCase.id}`);
  const prompt = flags.prompt || "hello";
  const verbose = boolFlag(flags, "verbose", false);
  const agentsCli = boolFlag(flags, "agents-cli", false);
  const preview = boolFlag(flags, "preview", true);
  const planDeploy = boolFlag(flags, "deploy-plan", true);
  const webUrl = flags["web-url"] || DEFAULT_WEB_URL;

  const item = {
    useCaseId: useCase.id,
    title: useCase.title,
    workspaceName,
    systems: useCase.systems || [],
    rows: rowDecision.rows,
    rowReason: rowDecision.reason,
  };

  printStep(workspaceName, "create", `${useCase.title} · rows=${rows} (${rowDecision.reason})`);
  const createArgs = ["create", "--usecase", useCase.id, "--name", workspaceName, "--domain", department, "--rows", rows, "--seed", seed];
  if (!agentsCli) createArgs.push("--no-agents-cli", "true");
  const created = await runJsonCli(createArgs, { verbose });
  item.create = { ok: created.json.ok === true, nextActions: created.json.nextActions || [] };
  item.workspaceId = created.json.workspace?.id || workspaceName;
  item.workspacePath = created.json.workspace?.path || null;

  printStep(item.workspaceId, "validate");
  const validated = await runJsonCli(["validate", item.workspaceId], { verbose });
  item.validate = {
    ok: validated.json.ok === true,
    testExitCode: validated.json.testExitCode,
    summary: validated.json.summary,
  };

  if (preview) {
    printStep(item.workspaceId, "preview", prompt);
    const previewResult = await runAdkPreview({ webUrl, workspaceId: item.workspaceId, prompt });
    item.preview = {
      ok: previewResult.ok === true,
      code: previewResult.code,
      response: previewResult.response || "",
      report: previewResult.previewReport || null,
      promotionPacket: previewResult.promotionPacket || null,
    };
  }

  if (planDeploy) {
    printStep(item.workspaceId, "deploy:plan");
    const planned = await runJsonCli(["deploy:plan", item.workspaceId, "--target", flags.target || "agent_runtime"], { verbose });
    item.deployPlan = {
      ok: planned.json.ok === true,
      nextActions: planned.json.nextActions || [],
      plan: planned.json.plan || "artifacts/DEPLOY_PLAN.md",
    };
  }

  item.nextAction = item.deployPlan?.nextActions?.[0]
    || item.preview?.promotionPacket?.nextActions?.[0]
    || created.json.nextActions?.[0]
    || null;
  return item;
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  if (boolFlag(flags, "help", false)) {
    console.log(`Usage:
  node scripts/batch-generate-agents.mjs [options]

Options:
  --department hr                 Department to select from when --usecases is absent
  --usecases id1,id2              Explicit use case ids or titles
  --limit 3                       Number of department use cases to process
  --offset 0                      Offset into selected department use cases
  --rows auto                     Rows per generated table, or a fixed integer
  --row-scale 1                   Multiplier for auto rows
  --min-rows 24                   Lower bound for auto rows
  --max-rows 300                  Upper bound for auto rows
  --seed 101                      Base seed; increments per use case
  --prefix hr                     Workspace name prefix
  --web-url http://localhost:17655 Local GE web URL for ADK preview
  --prompt hello                  ADK preview prompt
  --preview false                 Skip ADK run preview
  --deploy-plan false             Skip deploy plan artifact
  --agents-cli true               Use agents-cli scaffold before mock generation
  --continue true                 Continue after a use case fails
  --dry-run true                  Print selected use cases only
  --verbose true                  Stream child command output
`);
    return;
  }

  const selected = selectUseCases(flags);
  if (!selected.length) throw new Error("No use cases selected.");

  if (boolFlag(flags, "dry-run", false)) {
    for (const item of selected) {
      const rowDecision = resolveRows(item, flags);
      console.log(`${item.id}\t${item.department}\trows=${rowDecision.rows}\t${rowDecision.reason}\t${item.title}`);
    }
    return;
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    options: {
      department: flags.department || flags.domain || "hr",
      rows: flags.rows || "auto",
      rowScale: Number(flags["row-scale"] || 1),
      minRows: Number(flags["min-rows"] || 24),
      maxRows: Number(flags["max-rows"] || 300),
      seed: Number(flags.seed || 101),
      preview: boolFlag(flags, "preview", true),
      deployPlan: boolFlag(flags, "deploy-plan", true),
      agentsCli: boolFlag(flags, "agents-cli", false),
      webUrl: flags["web-url"] || DEFAULT_WEB_URL,
    },
    results: [],
  };

  const shouldContinue = boolFlag(flags, "continue", false);
  for (let i = 0; i < selected.length; i += 1) {
    const useCase = selected[i];
    try {
      const result = await processUseCase(useCase, i, flags);
      summary.results.push(result);
      printStep(result.workspaceId, "done", `next=${result.nextAction || "unknown"}`);
    } catch (error) {
      const failed = {
        useCaseId: useCase.id,
        title: useCase.title,
        workspaceName: slug(`${flags.prefix || flags.department || useCase.department || "agent"}-${useCase.id}`),
        error: error instanceof Error ? error.message : String(error),
      };
      summary.results.push(failed);
      console.error(`[${failed.workspaceName}] failed: ${failed.error}`);
      if (!shouldContinue) break;
    }
  }

  const paths = await writeSummary(summary);
  console.log(JSON.stringify({ ok: summary.results.every((item) => !item.error), summary: paths, results: summary.results }, null, 2));
  if (summary.results.some((item) => item.error)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
