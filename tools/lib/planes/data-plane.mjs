import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createCheckCollector } from "../doctor/report.mjs";
import { STATE_PATHS } from "../state-paths.mjs";
import { assertRemoteAuthorized } from "../remote-guard.mjs";

const noop = () => {};
const DEFAULT_UV_CACHE_DIR = STATE_PATHS.cache.uv;

function defaultLocalCommand(args = [], { timeout = 15000, env = {} } = {}) {
  const result = spawnSync(args[0], args.slice(1), {
    cwd: process.cwd(),
    env: { ...process.env, UV_CACHE_DIR: process.env.UV_CACHE_DIR || DEFAULT_UV_CACHE_DIR, ...env },
    encoding: "utf8",
    timeout,
  });
  return {
    ok: result.status === 0,
    status: result.status,
    out: String(result.stdout || "").trim(),
    err: String(result.stderr || result.error?.message || "").trim(),
  };
}

export function dataCoordinatesFromOutputs(outputs = {}, cfg = {}, { includeRuntimeDetails = false } = {}) {
  const data = {
    dataBucket: outputs.data_bucket || cfg.dataBucket,
    alloydbDsnSecret: outputs.alloydb_dsn_secret || cfg.alloydbDsnSecret,
    bigtableInstance: outputs.bigtable_instance || cfg.bigtableInstance,
    bqLocation: outputs.bq_location || cfg.bqLocation,
  };
  if (includeRuntimeDetails) {
    data.alloydbInstance = outputs.alloydb_instance || undefined;
    data.firestoreLocation = outputs.firestore_location || cfg.geLocation;
  }
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

export function mergeDataPlaneConfig(existing = {}, outputs = {}, cfg = {}, options = {}) {
  return {
    ...existing,
    ...dataCoordinatesFromOutputs(outputs, { ...existing, ...cfg }, options),
  };
}

export function createDataPlane({
  ensureTerraform,
  ensureGcloud,
  describeProjectNumber,
  infra,
  tfOutputs,
  readConfig,
  writeConfig,
  gcloud,
  localCommand = defaultLocalCommand,
  authorize = assertRemoteAuthorized,
} = {}) {
  if (!ensureTerraform || !ensureGcloud || !describeProjectNumber || !infra || !tfOutputs || !readConfig || !writeConfig || !gcloud) {
    throw new Error("createDataPlane requires terraform, gcloud, config, and infra dependencies");
  }

  async function dataUp(cfg, { log = noop } = {}) {
    // Gate: provisioning real data stores requires remote mode + confirmation.
    const { dryRun } = authorize("ge data up", { mode: cfg.mode });
    ensureTerraform();
    ensureGcloud();
    if (!cfg.project) throw new Error("No project. Run `ge init` first.");
    if (!cfg.projectNumber) cfg.projectNumber = describeProjectNumber(cfg) || cfg.projectNumber;
    if (!cfg.geAppId) throw new Error("geAppId required (run `ge init`).");
    log("terraform apply (data stores: GCS · BigQuery IAM · AlloyDB · Bigtable · Firestore IAM)");
    if (dryRun) {
      log("[dry-run] skipping terraform apply — set GE_CONFIRM=1 to provision");
      return { data: null, dryRun: true };
    }
    infra(cfg, { sub: "apply", log });
    const outputs = tfOutputs();
    const data = dataCoordinatesFromOutputs(outputs, cfg, { includeRuntimeDetails: true });
    writeConfig(mergeDataPlaneConfig(readConfig(), outputs, cfg, { includeRuntimeDetails: true }));
    log("merged data-plane coordinates into .ge.json");
    return { data };
  }

  function mergeDataPlaneOutputs(cfg) {
    const outputs = tfOutputs();
    writeConfig(mergeDataPlaneConfig(readConfig(), outputs, cfg));
    return outputs;
  }

  function dataDoctor(cfg) {
    ensureGcloud();
    if (!cfg.project) throw new Error("No project. Run `ge init` first.");
    const collector = createCheckCollector();
    const { add } = collector;

    const bucket = cfg.dataBucket || `${cfg.project}-ge-agent-data`;
    const bucketResult = gcloud(["storage", "buckets", "describe", `gs://${bucket}`, "--project", cfg.project, "--format=value(name)"], { allowFail: true });
    add("agent-data bucket", bucketResult.ok ? "pass" : "warn", bucketResult.ok ? bucket : `${bucket} not found`, "ge data up");

    const secret = cfg.alloydbDsnSecret || "ge-agent-alloydb-dsn";
    const secretResult = gcloud(["secrets", "describe", secret, "--project", cfg.project, "--format=value(name)"], { allowFail: true });
    add("alloydb DSN secret", secretResult.ok ? "pass" : "warn", secretResult.ok ? secret : `${secret} not found (AlloyDB disabled or not applied)`, "ge data up");

    const bigtable = cfg.bigtableInstance || "ge-agent-data";
    const bigtableResult = gcloud(["bigtable", "instances", "describe", bigtable, "--project", cfg.project, "--format=value(name)"], { allowFail: true });
    add("bigtable instance", bigtableResult.ok ? "pass" : "warn", bigtableResult.ok ? bigtable : `${bigtable} not found (Bigtable disabled or not applied)`, "ge data up");

    const bigqueryResult = gcloud(["bq", "--project_id", cfg.project, "ls", "--max_results", "1"], { allowFail: true });
    add("bigquery reachable", bigqueryResult.ok ? "pass" : "warn", bigqueryResult.ok ? "ok" : "bq ls failed (API disabled or no datasets yet)", "ge data up");

    for (const check of dataRuntimeDoctor().checks) add(check.name, check.status, check.detail, check.fix);

    return collector.report({ project: cfg.project, region: cfg.region });
  }

  function dataRuntimeDoctor() {
    const collector = createCheckCollector();
    const { add } = collector;
    mkdirSync(DEFAULT_UV_CACHE_DIR, { recursive: true });

    const uv = localCommand(["uv", "--version"], { timeout: 5000 });
    add("uv toolchain", uv.ok ? "pass" : "warn", uv.ok ? uv.out : uv.err || "uv not available", "curl -LsSf https://astral.sh/uv/install.sh | sh");

    const runtime = uv.ok
      ? localCommand([
        "uv",
        "run",
        "--offline",
        "--with",
        "snowfakery",
        "--with",
        "setuptools<81",
        "python",
        "-c",
        "import snowfakery, pkg_resources; print('snowfakery ok')",
      ], { timeout: 15000 })
      : { ok: false, err: "uv unavailable" };
    add(
      "snowfakery runtime",
      runtime.ok ? "pass" : "warn",
      runtime.ok ? runtime.out : runtime.err || "Snowfakery is not available in the local uv cache",
      "UV_CACHE_DIR=.ge/cache/uv uv run --refresh --with snowfakery --with 'setuptools<81' python -c \"import snowfakery, pkg_resources\"",
    );

    return collector.report({ project: null, region: null });
  }

  return { dataUp, dataDoctor, dataRuntimeDoctor, mergeDataPlaneOutputs };
}
