// Tool-plane / gateway readiness — pure checks (given a probe/describe callback,
// return a pass/fail/detail/fix row) that gate remote build/ship before any cloud
// work starts. Split out of factory-core.mjs because these have no dependency on
// gcloud/terraform execution or local-workspace state — they're pure functions
// over injected probes, exercised directly by factory-regenerate-toolplane.test.mjs
// and ship-readiness.test.mjs, and wired into doctor.mjs's commandDoctor.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseList } from "@ge/std/list";
import { mcpServiceName } from "./mcp-plane.mjs";
import { serviceEnv } from "./factory-plane.mjs";
import { REPO_ROOT, DEPARTMENTS } from "../state-paths.mjs";

const CATALOG_PATH = join(REPO_ROOT, "apps/factory/generated/use-cases.generated.json");

// Sync catalog id→department lookup. Uses only the generated artifact (enough to
// map a build/ship selection to the departments it touches); returns an empty map
// if the catalog hasn't been synced yet.
function catalogDeptById() {
  try {
    if (!existsSync(CATALOG_PATH)) return new Map();
    return new Map(JSON.parse(readFileSync(CATALOG_PATH, "utf8")).map((e) => [e.id, e.department]));
  } catch {
    return new Map();
  }
}

// Which departments a build/ship selection touches. Returns null when the selection
// spans every department (all/canary, or ids we can't map) so callers gate the whole
// tool plane rather than silently skipping the check. Pure given `deptById`.
export function selectionDepartments({ ids, dept, scope } = {}, deptById = null) {
  if (dept) {
    const set = parseList(String(dept));
    return set.length ? [...new Set(set)] : null;
  }
  if (ids) {
    const map = deptById || catalogDeptById();
    const requested = parseList(String(ids));
    const depts = requested.map((id) => map.get(id));
    // If any requested id can't be mapped to a department, gate the whole tool
    // plane rather than silently under-gating the unmapped agents.
    if (depts.some((d) => !d)) return null;
    return depts.length ? [...new Set(depts)] : null;
  }
  if (scope === "canary" || scope === "all") return null;
  return null;
}

// Tool-plane readiness for a set of departments: a remote build/ship can only
// register an agent's tools if its department's MCP service is deployed
// (cfg.mcpServices[dept]). Pure; departments=null/empty gates every department.
export function toolPlaneChecks(cfg, departments) {
  const depts = (departments && departments.length) ? departments : DEPARTMENTS;
  const services = cfg.mcpServices || {};
  return depts.map((dept) => {
    const url = services[dept];
    return {
      name: `tool plane ${dept}`,
      status: url ? "pass" : "fail",
      detail: url ? `${mcpServiceName(dept)} deployed` : `${mcpServiceName(dept)} not deployed`,
      fix: url ? null : "ge mcp deploy  (run from local)",
    };
  });
}

// `ge handoff agents-cli` hands the locally-built workspace to the cloud factory by
// opening an authenticated proxy to the gateway (gcloud run services proxy),
// which needs the `cloud-run-proxy` gcloud component. On this install the gcloud
// component manager is disabled, so the component ships as an apt package — a
// missing proxy is a HARD blocker (ship cannot hand off; it fails mid-run with
// "proxy did not start in time"). Pure: pass in a probe for the proxy command.
//   probe() → { ok: boolean }   (e.g. `gcloud run services proxy --help` exit 0)
export function shipProxyCheck(probe) {
  const ok = !!probe()?.ok;
  return {
    name: "cloud-run-proxy component",
    status: ok ? "pass" : "fail",
    detail: ok ? "gcloud run services proxy available" : "cloud-run-proxy gcloud component missing (ship cannot open the gateway proxy)",
    // The gcloud component manager is disabled on this install, so
    // `gcloud components install cloud-run-proxy` is NOT valid here — use apt.
    fix: ok ? null : "sudo apt-get install google-cloud-cli-cloud-run-proxy",
  };
}

// `ge handoff agents-cli` deploy_runtime POSTs to the gateway, which 403s with "Agent
// provisioning is disabled" unless GE_ENABLE_AGENT_PROVISION=true is set on the
// gateway service (see apps/presentation/server.js). That 403 fired AFTER
// load_data already ran, so it must be a HARD pre-flight blocker. Pure: pass the
// described gateway Cloud Run service (or null) + the env reader.
//   describeGateway() → service|null ;  readEnv(service, key) → value|undefined
export function gatewayProvisionCheck(cfg, describeGateway, readEnv = serviceEnv) {
  const svc = cfg.gatewayService || "ge-agent-factory-gateway";
  const service = describeGateway();
  if (!service) {
    return {
      name: "gateway provisioning",
      status: "fail",
      detail: `${svc} not deployed (cannot confirm GE_ENABLE_AGENT_PROVISION)`,
      fix: "ge up",
    };
  }
  const enabled = readEnv(service, "GE_ENABLE_AGENT_PROVISION") === "true";
  return {
    name: "gateway provisioning",
    status: enabled ? "pass" : "fail",
    detail: enabled
      ? `${svc}: GE_ENABLE_AGENT_PROVISION=true`
      : `${svc}: GE_ENABLE_AGENT_PROVISION not true (gateway 403s "Agent provisioning is disabled" after load_data)`,
    fix: enabled ? null : `gcloud run services update ${svc} --region ${cfg.region} --update-env-vars GE_ENABLE_AGENT_PROVISION=true`,
  };
}

// `ge handoff agents-cli`/`ge data up` run load_data, which needs the BigQuery API. The
// other doctors surface a disabled BQ API only as a soft ▲, but for ship/data
// it's a HARD ✗ (load_data fails mid-run otherwise). Pure: pass a probe that
// returns whether bigquery.googleapis.com is enabled.
//   probe() → { ok: boolean, out: string }  (gcloud services list --enabled …)
export function bigQueryApiCheck(probe) {
  const result = probe() || {};
  const enabled = !!result.ok && !!result.out;
  return {
    name: "bigquery API",
    status: enabled ? "pass" : "fail",
    detail: enabled ? result.out : "bigquery.googleapis.com not enabled (load_data needs it)",
    fix: enabled ? null : "ge data up  (or gcloud services enable bigquery.googleapis.com)",
  };
}

// Local workspaces a `--force` (regenerate) selection should wipe before rebuilding.
// Pure given the store `items` and an optional catalog dept lookup.
export function selectWorkspacesForRegen(items, { ids, dept, scope } = {}, deptById = null) {
  if (ids) {
    const set = new Set(parseList(String(ids)));
    return items.filter((w) => set.has(w.id) || set.has(w.useCaseId));
  }
  if (dept) {
    const set = new Set(parseList(String(dept)));
    const map = deptById || catalogDeptById();
    return items.filter((w) => set.has(w.departmentId) || set.has(map.get(w.useCaseId)));
  }
  if (scope === "canary") return items.slice(0, 1);
  // No explicit selection (bare `ge agents build --force`) mirrors build's
  // default-to-all so the wipe set equals the rebuild set (no duplicate workspaces).
  if (!ids && !dept && (scope == null || scope === "all")) return [...items];
  return [];
}
