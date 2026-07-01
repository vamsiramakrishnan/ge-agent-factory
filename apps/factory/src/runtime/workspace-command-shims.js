// Verbatim extraction from apps/factory/src/server.js's startAgentRun (see
// REFACTOR-HANDOFF.md §3's "workspace-command shim materialization" debt item).
// Only call site: startAgentRun, right after it resolves the run's working directory.
import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function materializeWorkspaceCommandShims(workspaceDir) {
  const binDir = join(workspaceDir, ".ge-harness", "bin");
  mkdirSync(binDir, { recursive: true });
  const script = `#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const args = process.argv.slice(2);
const cmd = args[0] || "status";

// readJson/writeJson come from the shared atomic json-io helper (imported above).

function status() {
  const manifest = readJson(join(cwd, "workspace.json"), {});
  const fixtures = readJson(join(cwd, "fixtures", "manifest.json"), {});
  const pipeline = readJson(join(cwd, "mock_systems", "pipeline.json"), null);
  const tables = Array.isArray(fixtures.tables) ? fixtures.tables : [];
  console.log(JSON.stringify({
    ok: true,
    workspace: manifest.id || cwd,
    capabilities: manifest.capabilities || [],
    readiness: manifest.readiness || {},
    nextAction: manifest.nextAction || (manifest.nextActions || [])[0] || null,
    fixtures: {
      tables: tables.length,
      totalRows: tables.reduce((total, table) => total + Number(table.rowCount || table.rows || 0), 0),
    },
    pipeline: pipeline && pipeline.pipeline ? pipeline.pipeline : undefined,
  }, null, 2));
}

function validate() {
  const checks = [];
  const has = (path, label) => {
    const ok = existsSync(join(cwd, path));
    checks.push({ id: label, ok, path });
    return ok;
  };
  has("pyproject.toml", "pyproject");
  has("app/agent.py", "agent");
  has("app/tools.py", "tools");
  has("fixtures/manifest.json", "fixtures");
  has("tests", "tests");
  let testExitCode = null;
  if (existsSync(join(cwd, "pyproject.toml")) && existsSync(join(cwd, "tests"))) {
    const env = { ...process.env, PYTHONPATH: [cwd, process.env.PYTHONPATH].filter(Boolean).join(":") };
    const command = existsSync(join(cwd, ".venv")) ? ["uv", ["run", "pytest"]] : ["python3", ["-m", "pytest"]];
    let result = spawnSync(command[0], command[1], { cwd, stdio: "inherit", env });
    if ((result.error || result.status === 127) && command[0] !== "uv") {
      result = spawnSync("uv", ["run", "pytest"], { cwd, stdio: "inherit", env });
    }
    testExitCode = result.status == null ? 1 : result.status;
  }
  const ok = checks.every((check) => check.ok) && (testExitCode == null || testExitCode === 0);
  mkdirSync(join(cwd, "artifacts"), { recursive: true });
  const report = { ok, checks, testExitCode, generatedAt: new Date().toISOString() };
  writeJson(join(cwd, "artifacts", "validation-report.json"), report);
  const pipelinePath = join(cwd, "mock_systems", "pipeline.json");
  const pipeline = readJson(pipelinePath, { steps: {} });
  pipeline.steps = pipeline.steps || {};
  pipeline.steps.test = {
    ...(pipeline.steps.test || {}),
    status: ok ? "done" : "failed",
    exitCode: testExitCode,
    completedAt: report.generatedAt,
  };
  writeJson(pipelinePath, pipeline);
  const manifestPath = join(cwd, "workspace.json");
  const manifest = readJson(manifestPath, {});
  if (manifest && Object.keys(manifest).length) {
    manifest.readiness = manifest.readiness || {};
    manifest.readiness.tests = {
      status: ok ? "passing" : "failing",
      lastExitCode: testExitCode,
      output: "tests/test_smoke.py",
    };
    manifest.capabilities = Array.from(new Set([...(manifest.capabilities || []), ...(ok ? ["smoke_tests"] : [])]));
    manifest.nextActions = ok ? ["preview"] : ["validate"];
    manifest.nextAction = manifest.nextActions[0];
    manifest.updatedAt = report.generatedAt;
    writeJson(manifestPath, manifest);
  }
  console.log(JSON.stringify(report, null, 2));
  process.exit(ok ? 0 : 1);
}

if (cmd === "validate") validate();
else status();
`;
  for (const name of ["ge", "factory"]) {
    const target = join(binDir, name);
    writeFileSync(target, script, "utf8");
    chmodSync(target, 0o755);
  }
  return binDir;
}
