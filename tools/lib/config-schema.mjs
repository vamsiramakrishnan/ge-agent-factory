// Single source of truth for `ge` scalar config + precedence.
//
// Precedence (highest first): CLI flag → environment → .ge.json → default.
// factory-core.loadConfig() consumes resolveScalars() for these fields and then
// layers on computed/derived fields (project-based bucket/SA/dataBucket fallbacks,
// principalSet, mcpServices). `ge config explain` uses explainConfig() to show
// where each final value came from. Keeping this in one place stops drift between
// the CLI, MCP, console, and docs.

import { DxError } from "./errors/dx-error.mjs";

export const CONFIG_FIELDS = {
  project: {
    flag: "project",
    // GCP_PROJECT_ID stays first — it's ge's own explicit config var (documented
    // + tested precedence). GCLOUD_PROJECT added last so environments that set
    // only the alternate canonical GCP var still resolve (gcp-config.mjs parity).
    env: ["GCP_PROJECT_ID", "GOOGLE_CLOUD_PROJECT", "GCLOUD_PROJECT"],
    file: "project",
    requiredFor: ["infra", "build", "agents", "data", "mcp"],
  },
  projectNumber: {
    flag: "projectNumber",
    env: ["GOOGLE_CLOUD_PROJECT_NUMBER"],
    file: "projectNumber",
  },
  agentIdentityOrgId: {
    flag: "agentIdentityOrgId",
    env: ["GE_AGENT_IDENTITY_ORG_ID"],
    file: "agentIdentityOrgId",
  },
  region: {
    flag: "region",
    env: ["GCP_REGION"],
    file: "region",
    default: "us-central1",
  },
  gatewayUrl: {
    flag: "gatewayUrl",
    env: ["API_GATEWAY_URL"],
    file: "gatewayUrl",
  },
  bucket: {
    flag: "bucket",
    env: ["GE_AGENT_FACTORY_BUCKET"],
    file: "bucket",
    // project-derived fallback applied in loadConfig (depends on another field)
  },
  geAppId: {
    flag: "geApp",
    env: ["GEMINI_ENTERPRISE_APP_ID"],
    file: "geAppId",
    requiredFor: ["agents"],
  },
  geLocation: {
    flag: "geLocation",
    env: ["GEMINI_ENTERPRISE_LOCATION"],
    file: "geLocation",
    default: "global",
  },
  mode: {
    flag: "mode",
    env: ["GE_MODE"],
    file: "mode",
    // Fail-safe default: a fresh checkout with no .ge.json must NOT touch GCP.
    // Remote (billable) work is opt-in via --mode remote / GE_MODE=remote and is
    // gated by assertRemoteAuthorized() before any mutation.
    default: "local",
  },
  // How the toolchain reaches the cloud gateway: "proxy" tunnels via
  // `gcloud run services proxy` (default; legacy); "direct" calls cfg.gatewayUrl
  // over HTTPS with a minted ID token — no tunnel/child process (ADR 0001 phase 3).
  gatewayTransport: {
    flag: "gatewayTransport",
    env: ["GE_GATEWAY_TRANSPORT"],
    file: "gatewayTransport",
    default: "proxy",
  },
  agentsRepo: {
    flag: "agentsRepo",
    env: ["GE_AGENTS_REPO"],
    file: "agentsRepo",
    default: "",
  },
};

const has = (obj, key) => obj != null && obj[key] !== undefined && obj[key] !== null && obj[key] !== "";

// Project-bound values cached in .ge.json that must be ignored when the active
// project is overridden by flag/env. Otherwise cached resource coordinates from
// project A can bleed into commands against project B.
export const PROJECT_SCOPED_FILE_KEYS = [
  "projectNumber",
  "bucket",
  "geAppId",
  "agentsRepo",
  "gatewayUrl",
  "workerUrl",
  "serviceAccount",
  "dataBucket",
  "mcpServices",
  "agentIdentityPrincipalSet",
  "agentIdentityOrgId",
];

// Resolve one field, returning { value, source } where source is one of
// "flag" | "env:<NAME>" | "file" | "default" | "unset".
export function resolveConfigField(name, { flags = {}, env = {}, file = {} } = {}) {
  const def = CONFIG_FIELDS[name];
  if (!def) throw new Error(`unknown config field: ${name}`);
  if (has(flags, def.flag)) return { value: flags[def.flag], source: "flag" };
  for (const e of def.env || []) if (has(env, e)) return { value: env[e], source: `env:${e}` };
  if (has(file, def.file)) return { value: file[def.file], source: "file" };
  if (def.default !== undefined) return { value: def.default, source: "default" };
  return { value: undefined, source: "unset" };
}

// Resolve all scalar fields to plain values (for loadConfig).
export function resolveScalars(inputs = {}) {
  const out = {};
  for (const name of Object.keys(CONFIG_FIELDS)) out[name] = resolveConfigField(name, inputs).value;
  return out;
}

// Per-field { value, source } map (for `ge config explain`).
export function explainConfig(inputs = {}) {
  const out = {};
  for (const name of Object.keys(CONFIG_FIELDS)) out[name] = resolveConfigField(name, inputs);
  return out;
}

export function effectiveConfigFile(rawFile = {}, flags = {}, env = {}) {
  const project = resolveConfigField("project", { flags, env, file: rawFile });
  const projectOverridden = (project.source === "flag" || project.source.startsWith("env:"))
    && rawFile.project
    && rawFile.project !== project.value;
  if (!projectOverridden) return { file: rawFile, projectOverridden: false };
  const file = { ...rawFile };
  for (const key of PROJECT_SCOPED_FILE_KEYS) delete file[key];
  return { file, projectOverridden: true };
}

export function buildFactoryConfig({ flags = {}, env = {}, file: rawFile = {} } = {}) {
  const { file } = effectiveConfigFile(rawFile, flags, env);
  const scalars = resolveScalars({ flags, env, file });
  const project = scalars.project;
  const projectNumber = scalars.projectNumber;
  const trustDomain = scalars.agentIdentityOrgId ? `agents.global.org-${scalars.agentIdentityOrgId}.system.id.goog` : "";
  return {
    project,
    projectNumber,
    region: scalars.region,
    gatewayService: file.gatewayService || "ge-agent-factory-gateway",
    workerService: file.workerService || "ge-agent-factory-worker",
    gatewayUrl: scalars.gatewayUrl,
    gatewayTransport: scalars.gatewayTransport,
    workerUrl: file.workerUrl,
    bucket: scalars.bucket || (project ? `${project}-ge-agent-factory` : undefined),
    geAppId: scalars.geAppId,
    geLocation: scalars.geLocation,
    serviceAccount: env.GE_AGENT_FACTORY_SERVICE_ACCOUNT || file.serviceAccount || (project ? `ge-agent-factory-runner@${project}.iam.gserviceaccount.com` : undefined),
    tasksQueue: file.tasksQueue || "ge-agent-factory-stages",
    agentsRepo: scalars.agentsRepo,
    dataBucket: env.GE_AGENT_DATA_BUCKET || file.dataBucket || (project ? `${project}-ge-agent-data` : undefined),
    alloydbDsnSecret: env.GE_AGENT_ALLOYDB_DSN_SECRET || file.alloydbDsnSecret || "ge-agent-alloydb-dsn",
    bigtableInstance: env.GE_AGENT_BIGTABLE_INSTANCE || file.bigtableInstance || "ge-agent-data",
    bqLocation: env.GE_AGENT_BQ_LOCATION || file.bqLocation || "US",
    mode: scalars.mode,
    mcpServices: file.mcpServices || {},
    agentIdentityOrgId: scalars.agentIdentityOrgId,
    agentIdentityPrincipalSet: env.GE_AGENT_IDENTITY_PRINCIPALSET || file.agentIdentityPrincipalSet ||
      (trustDomain ? `principalSet://${trustDomain}/attribute.platformContainer/aiplatform/projects/${projectNumber}` : ""),
  };
}

export function explainFactoryConfig({ flags = {}, env = {}, file: rawFile = {} } = {}) {
  const { file, projectOverridden } = effectiveConfigFile(rawFile, flags, env);
  const report = explainConfig({ flags, env, file });
  if (projectOverridden) report._note = "project overridden — cached project-scoped values from .ge.json ignored";
  return report;
}

// Throw if a field required for `command` is unset after resolution.
export function validateConfigFor(command, inputs = {}) {
  const missing = [];
  for (const [name, def] of Object.entries(CONFIG_FIELDS)) {
    if (!(def.requiredFor || []).includes(command)) continue;
    if (!has({ [name]: resolveConfigField(name, inputs).value }, name)) missing.push(name);
  }
  if (missing.length) {
    throw new DxError(`missing required config for "${command}": ${missing.join(", ")} (set via flag, env, or .ge.json — see \`ge config explain\`)`, {
      where: `config: ${missing.join(", ")}`,
      why: `\`${command}\` cannot run until these values resolve from a flag, an env var, or .ge.json`,
      fix: "ge config explain",
    });
  }
  return true;
}

export function classifyReadinessCheck(section, check) {
  const text = `${section} ${check.name} ${check.detail || ""} ${check.fix || ""}`.toLowerCase();
  if (check.status === "pass") return { ...check, category: "ready", action: "none" };
  let category = "runtime";
  let action = check.fix || "inspect doctor output";
  if (/uv|python|agents-cli|antigravity|skill|workspace registry|projects\.json|openapi|local|harness/.test(text)) {
    category = "local-substrate";
    action = check.fix || "mise run setup";
  } else if (/config|unset|\.ge\.json|agentidentityorgid|project|geappid|gatewayurl/.test(text)) {
    category = "setup-config";
    action = check.fix || "ge init";
  } else if (/terraform|iam|role|invoker|principalset|not granted|agent identity/.test(text)) {
    category = "infra-iam";
    action = check.fix || "ge up --infra";
  } else if (/bucket|alloydb|bigtable|bigquery|data plane|secret/.test(text)) {
    category = "data-plane";
    action = check.fix || "ge data up";
  } else if (/mcp|agent registry|tool plane/.test(text)) {
    category = "tool-plane";
    action = check.fix || "ge mcp deploy";
  } else if (/gateway|worker|cloud run|service|memory|iap|tasks queue/.test(text)) {
    category = "factory-plane";
    action = check.fix || "ge up --infra";
  }
  return { ...check, category, action };
}

export function classifyReadinessSection(section) {
  const checks = (section.checks || []).map((check) => classifyReadinessCheck(section.name, check));
  const repairPlan = checks
    .filter((check) => check.status !== "pass")
    .map((check) => ({ check: check.name, category: check.category, command: check.action, status: check.status }));
  return { ...section, checks, repairPlan };
}
