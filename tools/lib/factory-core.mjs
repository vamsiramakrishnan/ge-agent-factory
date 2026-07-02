// factory-core — the engine behind the `ge` CLI and the MCP server.
//
// Operations return structured data and take an optional `log(msg)` callback for
// human progress; they never print directly and throw Error on failure. This is
// the "one core, two surfaces" seam: tools/ge.mjs renders for humans (or --json),
// tools/mcp-server.mjs exposes the same ops as typed MCP tools.

import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseConcurrency } from "./concurrency.mjs";
import { readJson, writeJson, updateJson } from "@ge/std/json-io";
import { buildFactoryConfig, explainFactoryConfig } from "./config-schema.mjs";
import { commandMeta, commandRequirements } from "./ge-command-registry.mjs";
import { runDoctorSection } from "./doctor/report.mjs";
import { runCommand } from "./factory-exec.mjs";
import { createDataPlane } from "./planes/data-plane.mjs";
import { createMcpPlane } from "./planes/mcp-plane.mjs";
import { createFactoryPlane, serviceUrl } from "./planes/factory-plane.mjs";
import { STATE_PATHS, DEPARTMENTS } from "./state-paths.mjs";
// Week-4: app-domain ops are imported via the two cycle-break boundary modules,
// NOT directly from apps/factory — factory-core keeps zero app imports (enforced
// by tools/check-no-app-imports.mjs).
import { createGatewayClient, postJson } from "./gateway-client.mjs";
import { createDoctorPlane } from "./doctor/engine.mjs";
import { createProvisionOps } from "./provision.mjs";
import { selectionDepartments, toolPlaneChecks, shipProxyCheck, gatewayProvisionCheck, bigQueryApiCheck, selectWorkspacesForRegen } from "./planes/tool-plane-checks.mjs";
import {
  runLedger,
  ledgerWrite,
  ledgerRuns,
  ledgerRun,
  ledgerFleet,
  ledgerBackfillFromDisk,
} from "./ledger/factory-ledger.mjs";
import { mergeLedgerAndFileRuns, listFactoryRuns } from "./factory-runs.mjs";
import { loadCatalog, resolveCatalogId, listUsecases, listSpecs } from "./factory-catalog-search.mjs";
import { reviewSpec } from "./spec-review.mjs";
import { registerSpecWith } from "./register-spec.mjs";
import { createAgentIdentityOps } from "./agent-identity.mjs";
import { createWorkspaceDoctorOps } from "./doctor/workspace.mjs";
import { createFleetOps } from "./fleet-ops.mjs";
import { createApplyOps } from "./apply-ops.mjs";
import { createRemoteRunOps } from "./remote-run-ops.mjs";

export {
  selectionDepartments,
  toolPlaneChecks,
  shipProxyCheck,
  gatewayProvisionCheck,
  bigQueryApiCheck,
  selectWorkspacesForRegen,
} from "./planes/tool-plane-checks.mjs";
export { HARNESS_VENV_DIR, harnessVenvPython } from "./doctor/engine.mjs";
export { runLedger, ledgerRuns, ledgerRun, ledgerFleet, ledgerPlan, ledgerBackfillFromDisk } from "./ledger/factory-ledger.mjs";
export { mergeLedgerAndFileRuns, listFactoryRuns } from "./factory-runs.mjs";
export { loadCatalog, resolveCatalogId, listUsecases, listSpecs } from "./factory-catalog-search.mjs";
export { reviewSpec } from "./spec-review.mjs";


export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CONFIG_PATH = join(REPO_ROOT, ".ge.json");
const TF_DIR = join(REPO_ROOT, "installer/terraform");
const MCP_SERVICE_DIR = join(REPO_ROOT, "apps/factory/mcp-service");
const FACTORY_HARNESS_DIR = STATE_PATHS.factory.root;

export { DEPARTMENTS };

const noop = () => {};

// ── small fs/exec helpers ─────────────────────────────────────────────────────
// Single source of truth for JSON IO: atomic writes (temp+fsync+rename) and
// lockable read-modify-write live in json-io.mjs. Imported for internal use and
// re-exported so existing `import { readJson, writeJson } from "./factory-core.mjs"`
// callers stay valid.
export { readJson, writeJson, updateJson };

// Run listing/summarization (mergeLedgerAndFileRuns, listFactoryRuns) now live in
// factory-runs.mjs; imported below and re-exported for the public API contract
// (see factory-core.export-surface.json / factory-core.export-surface.test.mjs).

export function run(bin, args, { capture = true, allowFail = false, cwd = REPO_ROOT } = {}) {
  const result = runCommand(bin, args, { capture, allowFail, cwd });
  return {
    ok: result.ok,
    out: (result.stdout || "").trim(),
    err: result.stderr || result.failureLine || "",
  };
}
const gcloud = (args, opts) => run("gcloud", args, opts);

export function ensureBin(bin, hint) {
  try { execFileSync(bin, ["--version"], { stdio: "ignore" }); return; } catch {}
  try { execFileSync(bin, ["-version"], { stdio: "ignore" }); return; } catch {}
  throw new Error(`${bin} not found on PATH.${hint ? " " + hint : ""}`);
}
const ensureGcloud = () => ensureBin("gcloud", "Install the Google Cloud CLI: https://cloud.google.com/sdk/docs/install");
const ensureTerraform = () => ensureBin("terraform", "Install it: `mise install` (terraform is provisioned via mise.toml's pinned [tools] block; or https://developer.hashicorp.com/terraform/install).");

function binCheck(bin, args = ["--version"]) {
  const r = run(bin, args, { allowFail: true });
  return { ok: r.ok, detail: r.ok ? (r.out.split("\n")[0] || "available") : "not found" };
}

// ── config ────────────────────────────────────────────────────────────────────
// Scalar fields, project-override guards, and derived defaults live in
// config-schema.mjs so CLI/MCP/console/docs share one config contract.
export function loadConfig(flags = {}) {
  return buildFactoryConfig({ flags, env: process.env, file: readJson(CONFIG_PATH, {}) });
}

// Source-of-each-value report for `ge config explain` (uses the same schema).
// Honors the project-override guard so a flagged project doesn't show another
// project's cached number/bucket/app as if they applied.
export function explainLoadedConfig(flags = {}) {
  return explainFactoryConfig({ flags, env: process.env, file: readJson(CONFIG_PATH, {}) });
}

// ── terraform helpers ─────────────────────────────────────────────────────────
export function tfOutputs() {
  const r = run("terraform", [`-chdir=${TF_DIR}`, "output", "-json"], { allowFail: true });
  if (!r.ok) return {};
  try { const j = JSON.parse(r.out); const o = {}; for (const [k, v] of Object.entries(j)) o[k] = v.value; return o; } catch { return {}; }
}

// Agent Identity org id / principalSet inference + persistence now live in
// agent-identity.mjs; wired here the same way as the plane modules below, since
// they need live gcloud/readJson/writeJson access.
const {
  ensureAgentIdentityConfig,
  persistAgentIdentityConfig,
  describeProjectNumber,
} = createAgentIdentityOps({ gcloud, readJson, writeJson, configPath: CONFIG_PATH, noop });

const gitShortSha = () => { const r = run("git", ["rev-parse", "--short", "HEAD"], { allowFail: true }); return r.ok ? r.out : "manual"; };
export function resolveRepo(cfg) {
  return factoryPlane.resolveRepo(cfg);
}

// ── gateway transport + JSON fetch ────────────────────────────────────────────
// Proxy management, the bounded-retry fetch, and postJson/getJson now live in
// gateway-client.mjs (shared by `status` here and provision.mjs's provision/ship).
// `run` is injected the same way factory-core wires it into the plane modules.
const { withGateway } = createGatewayClient({ run });

// Catalog/use-case/agent-spec search (loadCatalog/resolveCatalogId/listUsecases/
// listSpecs) now lives in factory-catalog-search.mjs; the spec-review workflow
// (reviewSpec) in spec-review.mjs — imported above and re-exported for the public
// API contract (see factory-core.export-surface.json /
// factory-core.export-surface.test.mjs).

// registerSpec's implementation lives in register-spec.mjs; `run`/REPO_ROOT/GEN_DIR
// are injected the same way factory-core wires them into the plane modules (GEN_DIR
// is declared further down, but this reference is deferred until call time).
export function registerSpec(opts) {
  return registerSpecWith({ run, repoRoot: REPO_ROOT, genDir: GEN_DIR }, opts);
}

// ── operations ────────────────────────────────────────────────────────────────
export async function init(cfg, { log = noop } = {}) {
  ensureGcloud();
  if (!cfg.project) { const r = gcloud(["config", "get-value", "project"], { allowFail: true }); cfg.project = r.ok ? r.out : undefined; }
  if (!cfg.project) throw new Error("No project. Pass --project or run `gcloud config set project …`.");

  const tfo = tfOutputs();
  if (Object.keys(tfo).length) log("sourcing config from terraform outputs");
  cfg.project = tfo.project_id || cfg.project;
  cfg.projectNumber = tfo.project_number || cfg.projectNumber;
  cfg.region = tfo.region || cfg.region;
  cfg.bucket = tfo.factory_bucket || cfg.bucket;
  cfg.gatewayUrl = tfo.gateway_url || cfg.gatewayUrl;
  cfg.workerUrl = tfo.worker_url || cfg.workerUrl;
  cfg.serviceAccount = tfo.runner_service_account || cfg.serviceAccount;
  cfg.geAppId = tfo.gemini_enterprise_app_id || cfg.geAppId;
  cfg.geLocation = tfo.gemini_enterprise_location || cfg.geLocation;
  cfg.tasksQueue = tfo.tasks_queue || cfg.tasksQueue;
  cfg.agentIdentityPrincipalSet = tfo.agent_identity_principalset || cfg.agentIdentityPrincipalSet;

  if (!cfg.projectNumber) { const r = gcloud(["projects", "describe", cfg.project, "--format=value(projectNumber)"], { allowFail: true }); if (r.ok) cfg.projectNumber = r.out; }
  ensureAgentIdentityConfig(cfg, { log });
  if (!cfg.gatewayUrl) cfg.gatewayUrl = serviceUrl(factoryPlane.describeRun(cfg, cfg.gatewayService));
  if (!cfg.workerUrl) cfg.workerUrl = serviceUrl(factoryPlane.describeRun(cfg, cfg.workerService));
  cfg.bucket = cfg.bucket || `${cfg.project}-ge-agent-factory`;

  const out = {
    // Points editors at the tracked, generated schema (tools/gen-config-schema.mjs).
    // Every other .ge.json writer merges (`...existing`), so the key survives.
    $schema: "./.ge.schema.json",
    project: cfg.project, projectNumber: cfg.projectNumber, region: cfg.region,
    gatewayService: cfg.gatewayService, workerService: cfg.workerService,
    gatewayUrl: cfg.gatewayUrl, workerUrl: cfg.workerUrl, bucket: cfg.bucket,
    geAppId: cfg.geAppId, geLocation: cfg.geLocation, serviceAccount: cfg.serviceAccount, tasksQueue: cfg.tasksQueue,
    agentsRepo: cfg.agentsRepo || "",
    agentIdentityOrgId: cfg.agentIdentityOrgId || "",
    agentIdentityPrincipalSet: cfg.agentIdentityPrincipalSet || "",
  };
  writeJson(CONFIG_PATH, out);
  return out;
}

export function doctor(cfg) {
  return factoryPlane.doctor(cfg);
}

// Deploy contract: Cloud Build builds images; Terraform owns Cloud Run config
// (env, ingress, SA, scaling, CPU/memory, IAM). So `deploy` = build images, then
// bind them via `terraform apply` — never a direct `gcloud run deploy` (which would
// clobber Terraform-managed config). Memory/CPU/IAP live in Terraform variables.
// Note: terraform apply reconciles the whole module, so target is advisory.
export function deploy(cfg, { target = "all", log = noop } = {}) {
  return factoryPlane.deploy(cfg, { target, log });
}

// Remote run observation + artifact sync (status/logs/sync) now lives in
// remote-run-ops.mjs; wired here the same way as the plane modules below, since
// it needs live run/gcloud plus the composed withGateway client.
export const { status, logs, sync } = createRemoteRunOps({ run, gcloud, ensureGcloud, withGateway });

// Fleet/mission/journey planning + run-log/artifact reads (fleetStatus/
// missionPlan/journeyPlan/tailLog/readArtifact) now live in fleet-ops.mjs;
// wired here the same way as the plane modules below, since they need live
// `gcloud` plus `statusBoard` (which closes over the composed factoryPlane).
// `statusBoard` is a hoisted function declaration, so referencing it here is
// safe — it only runs at call time, after the planes below are composed.
export const { fleetStatus, missionPlan, journeyPlan, tailLog, readArtifact } = createFleetOps({ gcloud, statusBoard });

const GEN_DIR = join(REPO_ROOT, "apps/factory");
const FACTORY_DATA_ROOT = STATE_PATHS.factory.root;

// Ledger read/write (runLedger/ledgerWrite/ledgerReadsEnabled/ledgerRuns/ledgerRun/
// ledgerFleet/ledgerPlan/ledgerBackfillFromDisk) now live in factory-ledger.mjs;
// imported above and re-exported for the public API contract (see
// factory-core.export-surface.json / factory-core.export-surface.test.mjs).

// Declarative reconcile (ADR 0001 phase 5: applyPlan/applyApply) now lives in
// apply-ops.mjs; wired further down (after the provisionOps composition it
// depends on) — see the createApplyOps call below the provision exports.

// Workspace doctor/repair (single-workspace inspect/repair) now live in
// workspace-doctor.mjs; `run`/GEN_DIR are injected the same way factory-core
// wires them into the plane modules.
export const { workspaceDoctor, workspaceRepair } = createWorkspaceDoctorOps({ run, genDir: GEN_DIR });

export function infra(cfg, { sub, gatewayImage, workerImage, yes = false, log = noop } = {}) {
  return factoryPlane.infra(cfg, { sub, gatewayImage, workerImage, yes, log });
}

const factoryPlane = createFactoryPlane({
  repoRoot: REPO_ROOT,
  terraformDir: TF_DIR,
  ensureGcloud,
  ensureTerraform,
  ensureAgentIdentityConfig,
  persistAgentIdentityConfig,
  tfOutputs,
  run,
  gcloud,
  gitShortSha,
  writeTextFile: (path, content) => writeFileSync(path, content, "utf8"),
});

const dataPlane = createDataPlane({
  ensureTerraform,
  ensureGcloud,
  describeProjectNumber,
  infra: (...args) => factoryPlane.infra(...args),
  tfOutputs,
  readConfig: () => readJson(CONFIG_PATH, {}),
  writeConfig: (config) => writeJson(CONFIG_PATH, config),
  gcloud,
});

const mcpPlane = createMcpPlane({
  departments: DEPARTMENTS,
  serviceDir: MCP_SERVICE_DIR,
  repoRoot: REPO_ROOT,
  ensureGcloud,
  describeRun: (...args) => factoryPlane.describeRun(...args),
  serviceUrl,
  readConfig: () => readJson(CONFIG_PATH, {}),
  writeConfig: (config) => writeJson(CONFIG_PATH, config),
  gcloud,
});

// commandDoctor/doctorAll/preflightCommand + local-toolchain preflight now live in
// doctor.mjs; wired here the same way as the plane modules above, since they need
// live run/gcloud plus these already-composed plane instances.
const doctorPlane = createDoctorPlane({
  run,
  gcloud,
  ensureBin,
  binCheck,
  dataPlane,
  factoryPlane,
  commandMeta,
  commandRequirements,
  doctor,
  dataDoctor,
  mcpDoctor,
});
export const { commandDoctor, preflightCommand, doctorAll } = doctorPlane;
export const { localPreflight, ensureHarnessVenv, ensureLocalUv } = doctorPlane;

// provision/provisionLocal/ship/syncLocal/devexCheck/devexSmoke + setMode now live
// in provision.mjs; wired here for the same reason (live run/gcloud/gateway/ledger
// access, which only exist once factory-core.mjs composes them).
const provisionOps = createProvisionOps({
  run,
  gcloud,
  ensureGcloud,
  ensureBin,
  withGateway,
  postJson,
  loadCatalog,
  runLedger,
  ledgerWrite,
  readJson,
  writeJson,
  localPreflight: doctorPlane.localPreflight,
  ensureLocalUv: doctorPlane.ensureLocalUv,
  repoRoot: REPO_ROOT,
  configPath: CONFIG_PATH,
  factoryHarnessDir: FACTORY_HARNESS_DIR,
  factoryDataRoot: FACTORY_DATA_ROOT,
  genDir: GEN_DIR,
});
export const { provision, provisionLocal, setMode, devexSmoke, devexCheck, syncLocal, ship } = provisionOps;

// Declarative reconcile (applyPlan/applyApply) now lives in apply-ops.mjs; wired
// here — after the provisionOps composition it executes fleet steps through —
// with the platform bring-up ops injected. `up`/`dataUp`/`mcpDeploy`/`statusBoard`
// are hoisted function declarations, so referencing them here is safe; they only
// run at call time, once every plane below is composed.
export const { applyPlan, applyApply } = createApplyOps({ statusBoard, up, dataUp, mcpDeploy, provisionOps });

export function build(cfg, { target, log = noop } = {}) {
  return factoryPlane.build(cfg, { target, log });
}

// Adopt a hand-managed project into Terraform (the cracked way): generate
// import {} blocks for the resources that already exist, then a single parallel
// `terraform apply` (additive google_project_iam_member — no serial gcloud loop).
// Plan-by-default so you review the adopt/create diff; --apply runs it, then the
// two-phase image build + doctor (via `up`).
export async function cutover(cfg, { apply = false, log = noop } = {}) {
  ensureTerraform(); ensureGcloud();
  if (!cfg.project) throw new Error("No project. Run `ge init`.");
  if (!cfg.projectNumber) { const r = gcloud(["projects", "describe", cfg.project, "--format=value(projectNumber)"], { allowFail: true }); if (r.ok) cfg.projectNumber = r.out; }
  if (!cfg.geAppId) throw new Error("geAppId required. Set GEMINI_ENTERPRISE_APP_ID.");
  const p = cfg.project, region = cfg.region;
  cfg.bucket = cfg.bucket || `${p}-ge-agent-factory`;
  const sa = (id) => `projects/${p}/serviceAccounts/${id}@${p}.iam.gserviceaccount.com`;

  // Resources likely to already exist on a hand-managed project — adopt them so
  // `apply` reconciles rather than fails on "already exists". `terraform plan`
  // will flag anything else to add here (e.g. an already-deployed Cloud Run
  // service); that's the normal adopt loop.
  const imports = [
    ["google_storage_bucket.factory", cfg.bucket],
    ["google_firestore_database.default", `${p}/(default)`],
    ["google_service_account.runner", sa("ge-agent-factory-runner")],
    ["google_service_account.gateway", sa("ge-agent-factory-runtime")],
    ["google_service_account.builder", sa("ge-agent-factory-builder")],
    ["google_cloud_tasks_queue.factory_stages", `projects/${p}/locations/${region}/queues/ge-agent-factory-stages`],
    ["google_artifact_registry_repository.containers", `projects/${p}/locations/${region}/repositories/ge-agent-factory`],
  ];
  const body = "# GENERATED by `ge cutover` — adopts pre-existing demo resources into Terraform\n" +
    "# state. import {} blocks are one-shot (no-ops once in state); safe to delete\n" +
    "# after the first successful apply. Add lines for anything `terraform plan` flags.\n\n" +
    imports.map(([to, id]) => `import {\n  to = ${to}\n  id = ${JSON.stringify(id)}\n}\n`).join("\n");
  writeFileSync(join(TF_DIR, "imports.generated.tf"), body, "utf8");
  log(`wrote installer/terraform/imports.generated.tf (${imports.length} import blocks)`);

  if (!apply) {
    infra(cfg, { sub: "plan", log });
    return {
      mode: "plan", project: p, imports: imports.map(([to, id]) => ({ to, id })),
      note: "Reviewed the plan above. It should ADOPT the imported resources and CREATE/UPDATE the rest (IAM is additive google_project_iam_member). If plan errors with 'already exists' for another resource, add its import to installer/terraform/imports.generated.tf and re-plan. Then re-run with --apply.",
    };
  }
  const res = await up(cfg, { log }); // terraform apply (adopts via imports) → build → apply(images) → init → doctor
  return { mode: "apply", project: p, ...res };
}

// Full platform stand-up. `planes` selects which to bring up; default = all.
// The data plane + MCP IAM live in the same terraform root as the factory, so the
// infra apply already provisions the stores/IAM; the `data` step just merges their
// coordinates into .ge.json, and `mcp` deploys the per-department Cloud Run services.
export async function up(cfg, { planes = ["infra", "data", "mcp"], log = noop } = {}) {
  ensureGcloud();
  if (!cfg.project) throw new Error("No project. Run `ge init`.");
  if (!cfg.projectNumber) { const r = gcloud(["projects", "describe", cfg.project, "--format=value(projectNumber)"], { allowFail: true }); if (r.ok) cfg.projectNumber = r.out; }
  const did = [];

  if (planes.includes("infra")) {
    ensureTerraform();
    if (!cfg.geAppId) throw new Error("geAppId required (set GEMINI_ENTERPRISE_APP_ID or run `ge init`).");
    log("infra: terraform apply (factory + data stores + MCP/agent-identity IAM)"); infra(cfg, { sub: "apply", log });
    log("infra: build + push gateway/worker images"); const { gatewayImage, workerImage } = build(cfg, { log });
    log("infra: terraform apply (bind real images)"); infra(cfg, { sub: "apply", gatewayImage, workerImage, log });
    log("infra: write .ge.json"); await init(cfg, { log });
    did.push("infra");
  }

  if (planes.includes("data")) {
    log("data: merge store coordinates → .ge.json");
    dataPlane.mergeDataPlaneOutputs(cfg);
    Object.assign(cfg, loadConfig({ project: cfg.project }));
    did.push("data");
  }

  if (planes.includes("mcp")) {
    log("mcp: deploy per-department MCP services"); mcpDeploy(cfg, { log });
    Object.assign(cfg, loadConfig({ project: cfg.project }));
    did.push("mcp");
  }

  log("doctor: unified health report");
  const health = doctorPlane.doctorAll(cfg);
  return { planes: did, config: readJson(CONFIG_PATH, {}), health };
}

// ── data plane ──────────────────────────────────────────────────────────────
// `ge data up`: terraform apply (the data_plane.tf stores live in the same root
// as the factory infra), then merge the store coordinates into .ge.json so the
// load_data stage and the runtime backend can find them.
export async function dataUp(cfg, { log = noop } = {}) {
  return dataPlane.dataUp(cfg, { log });
}

// `ge data doctor`: confirm the shared stores exist and are reachable.
export function dataDoctor(cfg) {
  return dataPlane.dataDoctor(cfg);
}

// ── MCP tool plane ──────────────────────────────────────────────────────────
// `ge mcp deploy`: deploy the generic FastMCP server once per department (fleet
// level — like the shared builder image), recording URLs in .ge.json.
export function mcpDeploy(cfg, { depts = DEPARTMENTS, memory = "1Gi", cpu = "1", log = noop } = {}) {
  return mcpPlane.mcpDeploy(cfg, { depts, memory, cpu, log });
}

// `ge mcp doctor`: department services Ready + APIs/IAM present.
export function mcpDoctor(cfg) {
  return mcpPlane.mcpDoctor(cfg);
}

// `ge` (bare): where am I, what's stood up, and the next command to run.
export function statusBoard(cfg) {
  const haveConfig = existsSync(CONFIG_PATH) && !!cfg.project;
  const mode = cfg.mode || "local";
  const clientDoes = mode === "local"
    ? "this machine runs generate → validate (to the build boundary); deploy/register/publish need the cloud"
    : "this machine submits + observes; the cloud factory builds, deploys, and publishes";
  const planes = [];

  let factoryUp = false;
  if (cfg.project) {
    try { factoryUp = !!(factoryPlane.describeRun(cfg, cfg.gatewayService) && factoryPlane.describeRun(cfg, cfg.workerService)); } catch (error) {
      // describeRun returns null on a clean "service absent" (allowFail), so a throw
      // here means the check itself broke (e.g. gcloud missing / auth error) — i.e.
      // "deployed but unreachable", not "not deployed". Surface it so the board's
      // "not deployed" detail isn't mistaken for a confirmed absence. factoryUp stays false.
      console.warn(`[factory-core] statusBoard: factory-plane probe failed; reporting "not deployed" but the check itself errored — ${error?.message || String(error)}`);
    }
  }
  planes.push({ name: "factory", up: factoryUp, detail: factoryUp ? `${cfg.gatewayService} + ${cfg.workerService}` : "gateway/worker not deployed" });

  let dataUpd = false;
  const bucket = cfg.dataBucket || (cfg.project ? `${cfg.project}-ge-agent-data` : "");
  if (bucket && cfg.project) {
    const b = gcloud(["storage", "buckets", "describe", `gs://${bucket}`, "--project", cfg.project, "--format=value(name)"], { allowFail: true });
    dataUpd = b.ok;
  }
  planes.push({ name: "data plane", up: dataUpd, detail: dataUpd ? bucket : "stores not provisioned" });

  const svcCount = cfg.mcpServices ? Object.keys(cfg.mcpServices).length : 0;
  planes.push({ name: "tool plane", up: svcCount > 0, detail: svcCount > 0 ? `${svcCount} dept MCP service(s)` : "MCP services not deployed" });

  let next;
  if (!haveConfig) next = "ge init";
  else if (mode === "local") next = "ge agents build --canary"; // local doesn't need cloud planes stood up
  else if (!factoryUp) next = "ge up";
  else if (!dataUpd) next = "ge up --data";
  else if (svcCount === 0) next = "ge up --mcp";
  else next = "ge agents build --canary";

  return { mode, clientDoes, project: cfg.project || null, app: cfg.geAppId || null, region: cfg.region, planes, next };
}
