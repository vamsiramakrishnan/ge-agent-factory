// Local-toolchain preflight + unified command/platform doctor. Split out of
// factory-core.mjs because these checks are a cohesive "is this machine/command
// ready" concern, distinct from the cloud/local build-submission ops in
// provision.mjs and the pure tool-plane probes in tool-plane-checks.mjs.
//
// commandDoctor/doctorAll need live `run`/`gcloud` execution plus the already-
// composed dataPlane/factoryPlane instances that only exist once factory-core.mjs
// wires up their own dependencies (config, terraform, etc). Rather than import
// those instances back from factory-core.mjs (which would cycle, since
// factory-core re-exports this module's functions), createCommandDoctor takes
// them as injected dependencies — the same factory-function shape already used
// by createDataPlane/createMcpPlane/createFactoryPlane in this directory.
import { accessSync, constants, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { readJson } from "@ge/std/json-io";
import { resolveGcpProject } from "@ge/std/gcp-config";
import { buildDoctorReport, createCheckCollector, runDoctorSection } from "./report.mjs";
import { STATE_PATHS, REPO_ROOT, displayStatePath } from "../state-paths.mjs";
import { workspaceStoreItems, LOCAL_PROJECTS, LOCAL_PROJECT_STORE } from "../local-workspaces.mjs";
import { selectionDepartments, toolPlaneChecks, shipProxyCheck, gatewayProvisionCheck, bigQueryApiCheck } from "../planes/tool-plane-checks.mjs";
import { resolveRunLedger } from "../planes/run-plane.mjs";
import { AGENTS_CLI_PACKAGE_SPEC, AGENTS_CLI_VERSION } from "../agents-cli-version.mjs";

const noop = () => {};
const UV_CACHE = STATE_PATHS.cache.uv;
const HARNESS_SKILLS_MANIFEST = STATE_PATHS.skills.manifest;

function canWritePath(path) {
  try { accessSync(path, constants.W_OK); return true; } catch { return false; }
}

// Repo-local Python venv for the Antigravity harness *driver* (the interpreter
// that imports google.antigravity). Created with uv — no system-Python pollution,
// no PEP-668 --break-system-packages. Idempotent: only creates/installs when
// missing. Returns the venv's python path (or null if uv/venv unavailable).
export const HARNESS_VENV_DIR = join(REPO_ROOT, ".venv");
export function harnessVenvPython(dir = HARNESS_VENV_DIR) {
  return process.platform === "win32"
    ? join(dir, "Scripts", "python.exe")
    : join(dir, "bin", "python");
}

// Remote ledger probe (ADR 0001 phase 2 verification): the console's Firestore
// branch (apps/console/src/server/transport/ledger.mjs streamFirestoreLedger)
// is documented as "parse/unit-verified offline only... runtime-unverified
// until driven against a hosted project" — this is the one-command live check
// that closes that gap. With a project configured it reads ONE run from the
// Firestore ledger mirror (proving the reader is actually wired end to end,
// not just shape-tested); without a project it's a blocked/skipped check
// naming the fix, and any read failure (missing ADC, network, permissions) is
// reported structurally too — this NEVER throws, matching every other check
// in this file (localPreflight/commandDoctor above all report checks, they
// don't propagate exceptions to the caller).
//
// `createReader` is injectable (default: resolveRunLedger's real remote
// adapter, the run OBSERVATION plane's resolver in ../planes/run-plane.mjs)
// so this is unit-testable against a fake transport, exactly like the other
// pure check helpers in ../planes/tool-plane-checks.mjs.
export async function remoteLedgerCheck(cfg, { createReader = (opts) => resolveRunLedger({ source: "remote", cfg: { project: opts.projectId } }) } = {}) {
  const name = "remote ledger (Firestore)";
  const projectId = cfg?.project || resolveGcpProject({ fallbackEnvVars: ["GE_PROJECT", "GCP_PROJECT_ID"] });
  if (!projectId) {
    return {
      name,
      status: "warn",
      detail: "skipped — no GCP project configured (nothing to connect to)",
      fix: "ge mode remote  (or: ge init --project <id>)",
    };
  }
  let reader;
  try {
    reader = await createReader({ projectId });
  } catch (error) {
    return { name, status: "fail", detail: `error — ${error?.message || String(error)}`, fix: "gcloud auth application-default login" };
  }
  try {
    const runs = await reader.listRuns({ limit: 1 });
    if (!runs.length) {
      return { name, status: "pass", detail: `ok — connected to ${projectId}, no runs recorded yet (empty)`, fix: null };
    }
    return { name, status: "pass", detail: `ok — connected to ${projectId}, latest run ${runs[0].id} (${runs[0].status})`, fix: null };
  } catch (error) {
    return { name, status: "fail", detail: `error — ${error?.message || String(error)}`, fix: "gcloud auth login  (or: gcloud auth application-default login)" };
  }
}

export function createDoctorPlane({ run, gcloud, ensureBin, binCheck, dataPlane, factoryPlane, commandMeta, commandRequirements, doctor, dataDoctor, mcpDoctor } = {}) {
  if (!run || !gcloud || !ensureBin || !binCheck || !dataPlane || !factoryPlane || !commandMeta || !commandRequirements || !doctor || !dataDoctor || !mcpDoctor) {
    throw new Error("createDoctorPlane requires run/gcloud/ensureBin/binCheck/dataPlane/factoryPlane/commandMeta/commandRequirements/doctor/dataDoctor/mcpDoctor");
  }
  const CONFIG_PATH = join(REPO_ROOT, ".ge.json");
  const TF_DIR = join(REPO_ROOT, "installer/terraform");

  function ensureHarnessVenv({ log = noop } = {}) {
    const py = harnessVenvPython();
    if (!existsSync(py)) {
      log("creating repo .venv (uv, python 3.11)…");
      const made = run("uv", ["venv", "--python", "3.11", HARNESS_VENV_DIR], { capture: true, allowFail: true });
      if (!made.ok) run("uv", ["venv", HARNESS_VENV_DIR], { capture: true, allowFail: true });
    }
    if (!existsSync(py)) return null;
    const has = run(py, ["-c", "import google.antigravity"], { allowFail: true });
    if (!has.ok) {
      log("installing google-antigravity into .venv…");
      run("uv", ["pip", "install", "--python", py, "-q", "google-antigravity"], { capture: true, allowFail: true });
    }
    return py;
  }

  // Ensure uv + a SHARED cache for local runs. uv keeps per-project .venvs (good —
  // each agent stays isolated/deployable), but points them all at one cache and
  // hardlinks packages in, so installs are near-instant with ~zero duplication.
  // That's the right "shared venv": shared cache + hardlink, not one .venv.
  function ensureLocalUv({ warm = false, log = noop } = {}) {
    ensureBin("uv", "Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh");
    mkdirSync(UV_CACHE, { recursive: true });
    process.env.UV_CACHE_DIR = process.env.UV_CACHE_DIR || UV_CACHE;
    process.env.UV_LINK_MODE = process.env.UV_LINK_MODE || "hardlink";
    // agents-cli as a shared uv tool (no-op if already installed).
    run("uv", ["tool", "install", "--force", AGENTS_CLI_PACKAGE_SPEC], { capture: true, allowFail: true });
    // google-antigravity SDK — the local harness driver imports google.antigravity.
    // Install it into a repo-local .venv (uv) instead of `pip --break-system-packages`
    // into a PEP-668 externally-managed system Python (the "airlock"). The venv is
    // isolated, repo-owned, and reused across runs; GE_HARNESS_PYTHON points the
    // spawned harness at it (see harness-python.js resolveHarnessPython).
    const venvPy = ensureHarnessVenv({ log });
    if (venvPy) process.env.GE_HARNESS_PYTHON = venvPy;
    if (warm) {
      log("warming shared uv cache (google-adk[eval], pydantic, pytest)…");
      run("uv", ["pip", "install", "--python", "3.11", "--no-installer-metadata", "google-adk", "google-adk[eval]", "pydantic>=2", "pytest>=8"], { capture: true, allowFail: true });
    }
    return process.env.UV_CACHE_DIR;
  }

  // Verify the local toolchain (uv, python 3.11, agents-cli, shared cache).
  function localPreflight() {
    mkdirSync(UV_CACHE, { recursive: true });
    const checks = [];
    const add = (name, ok, detail, fix) => checks.push({ name, status: ok ? "pass" : "fail", detail, fix: fix || null });
    const addStatus = (name, status, detail, fix) => checks.push({ name, status, detail, fix: fix || null });
    const uv = run("uv", ["--version"], { allowFail: true });
    const bun = run("bun", ["--version"], { allowFail: true });
    add("bun installed", bun.ok, bun.ok ? `v${bun.out}` : "not found", "Install Bun from https://bun.sh before running `mise run setup`");
    add("uv installed", uv.ok, uv.ok ? uv.out : "not found", "curl -LsSf https://astral.sh/uv/install.sh | sh");
    const py = run("uv", ["python", "find", "3.11"], { allowFail: true });
    add("python 3.11", py.ok, py.ok ? py.out : "not found", "uv python install 3.11");
    const acli = run("agents-cli", ["--version"], { allowFail: true });
    const agentsCliReady = acli.ok && String(acli.out || "").includes(AGENTS_CLI_VERSION);
    add("agents-cli", agentsCliReady, acli.ok ? acli.out.split("\n")[0] : "not found", `uv tool install --force ${AGENTS_CLI_PACKAGE_SPEC}`);
    const venvPy = harnessVenvPython();
    const harnessPy = process.env.GE_HARNESS_PYTHON || (existsSync(venvPy) ? venvPy : "python3");
    const ag = run(harnessPy, ["-c", "import google.antigravity"], { allowFail: true });
    const where = harnessPy === venvPy ? ".venv" : harnessPy === "python3" ? "python3" : harnessPy;
    add("google-antigravity SDK", ag.ok, ag.ok ? `importable (${where})` : `not importable (${where})`, "mise run deps  (creates .venv via uv + installs the SDK)");
    add("shared uv cache", true, process.env.UV_CACHE_DIR || UV_CACHE, null);
    add("link mode", true, process.env.UV_LINK_MODE || "hardlink", "export UV_LINK_MODE=hardlink");
    const skills = readJson(HARNESS_SKILLS_MANIFEST, null);
    add("harness skills manifest", !!skills?.skills?.length, skills?.skills?.length ? `${skills.skills.length} skills discoverable` : `${displayStatePath(HARNESS_SKILLS_MANIFEST)} missing or empty`, "mise run skills-sync");
    const store = readJson(LOCAL_PROJECT_STORE, { workspaces: [] });
    const projectIds = workspaceStoreItems(store).map((project) => project.id).filter(Boolean);
    const missingProjectDirs = projectIds.filter((id) => !existsSync(join(LOCAL_PROJECTS, id)));
    const localDirs = existsSync(LOCAL_PROJECTS)
      ? readdirSync(LOCAL_PROJECTS, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
      : [];
    const orphanDirs = localDirs.filter((id) => !projectIds.includes(id));
    addStatus(
      "workspace registry",
      missingProjectDirs.length ? "fail" : orphanDirs.length ? "warn" : "pass",
      missingProjectDirs.length
        ? `${missingProjectDirs.length} registry entr${missingProjectDirs.length === 1 ? "y" : "ies"} missing workspace directories`
        : orphanDirs.length
          ? `${orphanDirs.length} workspace director${orphanDirs.length === 1 ? "y is" : "ies are"} not in workspaces.json`
          : `${projectIds.length} registered workspace${projectIds.length === 1 ? "" : "s"}`,
      missingProjectDirs.length || orphanDirs.length ? `ge agents build --local  (or resync ${displayStatePath(LOCAL_PROJECT_STORE)})` : null,
    );
    const gitignore = existsSync(join(REPO_ROOT, ".gitignore")) ? readFileSync(join(REPO_ROOT, ".gitignore"), "utf8") : "";
    addStatus(
      "generated OpenAPI ignored",
      gitignore.includes("apps/factory/simulator-systems/_openapi/") ? "pass" : "warn",
      gitignore.includes("apps/factory/simulator-systems/_openapi/") ? "private-key-like generated payloads excluded" : "generated OpenAPI payloads can trip remote private-key scanners",
      "Add apps/factory/simulator-systems/_openapi/ to .gitignore",
    );
    const localBin = join(homedir(), ".local", "bin");
    const pathDirs = String(process.env.PATH || "").split(process.platform === "win32" ? ";" : ":").filter(Boolean);
    addStatus(
      "~/.local/bin on PATH",
      pathDirs.includes(localBin) ? "pass" : "warn",
      pathDirs.includes(localBin) ? `${localBin} is on PATH` : `${localBin} is not on PATH — the ge command may not be found`,
      `Add to your shell profile:  export PATH="${localBin}:$PATH"`,
    );
    const rootDepsInstalled = existsSync(join(REPO_ROOT, "node_modules"));
    add(
      "root workspace deps installed",
      rootDepsInstalled,
      rootDepsInstalled ? `${displayStatePath(join(REPO_ROOT, "node_modules"))} present` : "node_modules missing at repo root",
      "bun install  (or: mise run setup)",
    );
    // GCP project: not required for local mode itself, but cloud-facing commands
    // (provision/up/data/mcp) and both apps' read paths need it. Falls back to
    // `gcloud config get-value project` / the ge config file when unset here, so
    // this is a warn (not a fail). Uses the canonical resolver (GCP_PROJECT_ID
    // kept as a trailing fallback for `ge`'s own config var).
    const envProject = resolveGcpProject({ fallbackEnvVars: ["GCP_PROJECT_ID"] });
    const gcloudProject = envProject ? null : gcloud(["config", "get-value", "project"], { allowFail: true });
    const resolvedProject = envProject || (gcloudProject?.ok ? gcloudProject.out : "");
    addStatus(
      "GOOGLE_CLOUD_PROJECT",
      resolvedProject ? "pass" : "warn",
      resolvedProject
        ? `resolved to ${resolvedProject}${envProject ? "" : " (via gcloud config)"}`
        : "not set — required for cloud ops (provision/up/data/mcp) and both apps' read paths",
      `cp .env.example .env  then set GOOGLE_CLOUD_PROJECT=<your-project-id>  (or: gcloud config set project <id>)`,
    );
    return { mode: "local", cacheDir: process.env.UV_CACHE_DIR || UV_CACHE, checks, fails: checks.filter((c) => c.status === "fail").length };
  }

  function commandDoctor(cfg, { commandId = "up", selection = null } = {}) {
    const meta = commandMeta(commandId);
    const req = commandRequirements(commandId);
    const collector = createCheckCollector();
    const { add } = collector;
    if (!req) {
      add("command", "fail", `${commandId} is not a known doctor target`, "ge doctor --command up");
      return collector.report({ commandId, project: cfg.project, region: cfg.region });
    }

    add("command", "pass", meta?.cli || commandId, null);

    for (const bin of req.bins || []) {
      const probe = bin === "terraform" ? binCheck(bin, ["-version"]) : binCheck(bin);
      const fix = bin === "gcloud"
        ? "Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install"
        : bin === "terraform"
          ? "mise install (terraform is provisioned via mise.toml's pinned [tools] block)"
          : bin === "uv"
            ? "curl -LsSf https://astral.sh/uv/install.sh | sh"
            : null;
      add(`${bin} available`, probe.ok ? "pass" : "fail", probe.detail, fix);
    }

    for (const key of req.config || []) {
      const value = cfg[key];
      const fix = key === "project"
        ? "ge init  (or set GOOGLE_CLOUD_PROJECT)"
        : key === "geAppId"
          ? "Set GEMINI_ENTERPRISE_APP_ID or run ge init after creating the app"
          : key === "gatewayUrl"
            ? "ge up"
            : key === "dataBucket"
              ? "ge data up"
              : "ge init";
      add(`config ${key}`, value ? "pass" : "fail", value || "<unset>", fix);
    }

    if (req.configWritable) {
      const configExists = existsSync(CONFIG_PATH);
      const writable = configExists ? canWritePath(CONFIG_PATH) : canWritePath(REPO_ROOT);
      add(".ge.json writable", writable ? "pass" : "fail", configExists ? CONFIG_PATH : `${REPO_ROOT} (for .ge.json)`, "Check repository permissions");
    }

    if (req.terraformRoot) {
      add("terraform root", existsSync(join(TF_DIR, "main.tf")) || existsSync(join(TF_DIR, "data_plane.tf")) ? "pass" : "fail", TF_DIR, "Restore installer/terraform");
    }

    if (req.cloudAuth) {
      const g = binCheck("gcloud");
      if (g.ok) {
        const auth = gcloud(["auth", "list", "--filter=status:ACTIVE", "--format=value(account)"], { allowFail: true });
        add("gcloud auth", auth.ok && auth.out ? "pass" : "fail", auth.out || "no active account", "gcloud auth login");
        if (cfg.project) {
          const proj = gcloud(["projects", "describe", cfg.project, "--format=value(projectId)"], { allowFail: true });
          add("project access", proj.ok && proj.out ? "pass" : "fail", proj.out || `${cfg.project} not accessible`, `gcloud config set project ${cfg.project}`);
        }
      }
    }

    if (req.localToolchain) {
      try {
        const local = localPreflight();
        for (const check of local.checks) add(`local ${check.name}`, check.status, check.detail, check.fix);
      } catch (e) {
        add("local toolchain", "fail", e.message, "mise run deps");
      }
    }

    if (req.dataGenerationRuntime) {
      try {
        const runtime = dataPlane.dataRuntimeDoctor();
        for (const check of runtime.checks || []) add(`data runtime ${check.name}`, check.status, check.detail, check.fix);
      } catch (e) {
        add("data runtime", "warn", e.message || String(e), "ge data doctor");
      }
    }

    // Remote build/ship register an agent's tools against its department's MCP
    // service (deployed from local via `ge mcp deploy`). Without it the agent ships
    // with no tools — so gate on the selected agents' departments (all if unknown).
    if (req.toolPlane) {
      const departments = selectionDepartments(selection || {});
      for (const check of toolPlaneChecks(cfg, departments)) add(check.name, check.status, check.detail, check.fix);
    }

    // Ship-only handoff blockers: the cloud-run-proxy gcloud component (the proxy
    // ship opens to the gateway) and GE_ENABLE_AGENT_PROVISION=true on the gateway.
    // Both previously fired mid-run; surface them here, before any cloud work.
    if (req.shipHandoff) {
      const proxy = shipProxyCheck(() => binCheck("gcloud", ["run", "services", "proxy", "--help"]));
      add(proxy.name, proxy.status, proxy.detail, proxy.fix);

      const gateway = gatewayProvisionCheck(cfg, () => factoryPlane.describeRun(cfg, cfg.gatewayService || "ge-agent-factory-gateway"));
      add(gateway.name, gateway.status, gateway.detail, gateway.fix);
    }

    // load_data (ship + data) needs the BigQuery API — a HARD failure here, not the
    // soft ▲ the other doctors show, because it otherwise fails mid load_data.
    if (req.bigQueryHard) {
      const bq = bigQueryApiCheck(() => gcloud(
        ["services", "list", "--enabled", "--project", cfg.project, "--filter=config.name=bigquery.googleapis.com", "--format=value(config.name)"],
        { allowFail: true },
      ));
      add(bq.name, bq.status, bq.detail, bq.fix);
    }

    return collector.report({ commandId, project: cfg.project, region: cfg.region });
  }

  function preflightCommand(cfg, { commandId = "up", selection = null } = {}) {
    const report = commandDoctor(cfg, { commandId, selection });
    return {
      ...report,
      ok: report.fails === 0,
      status: report.fails === 0 ? "pass" : "blocked",
    };
  }

  // ── unified health + status board ─────────────────────────────────────────────
  // One report across every plane. Each section is isolated: a thrown sub-doctor
  // (e.g. no project yet) becomes a failed section rather than aborting the report.
  function doctorAll(cfg, { local = false, cloud = true, data = true, mcp = true, command } = {}) {
    const sections = [];
    const safe = (name, fn) => sections.push(runDoctorSection(name, fn));
    if (command) safe(`readiness: ${command}`, () => commandDoctor(cfg, { commandId: command }));
    if (local) safe("toolchain", () => localPreflight());
    if (cloud) safe("factory", () => doctor(cfg));
    if (data) safe("data plane", () => dataDoctor(cfg));
    if (mcp) safe("tool plane", () => mcpDoctor(cfg));
    return buildDoctorReport({ cfg, sections });
  }

  return { ensureHarnessVenv, ensureLocalUv, localPreflight, commandDoctor, preflightCommand, doctorAll };
}
