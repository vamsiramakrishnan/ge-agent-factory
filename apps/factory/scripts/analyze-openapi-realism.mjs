#!/usr/bin/env node
/**
 * Analyze cached upstream API specs/docs for simulator-emulation signals.
 *
 * This does not generate simulator contracts directly. It inventories what the
 * scraped OpenAPI/Swagger/Discovery assets can teach us about realistic upstream
 * behavior: auth, pagination, filters, error/status codes, async/job operations,
 * webhook/event surfaces, response-envelope conventions, and gaps in the current
 * simulator packs.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { parseList } from "@ge/std/list";
import { parseFlagArgs } from "@ge/std/cli-args";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readJson, writeJson } from "@ge/std/json-io";
import { detectFormatAndParse, loadSpec } from "./generate-tools-from-openapi.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = resolve(SCRIPT_DIR, "..");
const SYSTEMS_DIR = join(APP_DIR, "simulator-systems");
const OPENAPI_DIR = join(SYSTEMS_DIR, "_openapi");
const ARTIFACTS_DIR = join(APP_DIR, "artifacts");

const PAGINATION_PARAM_RE = /^(limit|page|per_?page|page_?size|offset|cursor|after|before|max_?results|page_?token|next_?page_?token|start_?at)$/i;
const FILTER_PARAM_RE = /^(q|query|search|filter|filters|sort|sort_?by|order|order_?by|fields|field_?mask|expand|include|exclude|status|state|type|from|to|since|until|updated_?after|created_?after|ids?)$/i;
const ASYNC_RE = /\b(async|job|jobs|task|tasks|operation|operations|run|runs|workflow|import|export|bulk|batch|poll|status)\b/i;
const WEBHOOK_RE = /\b(webhook|webhooks|event|events|subscription|subscriptions|callback|callbacks|watch|hook)\b/i;
const WRITE_METHODS = new Set(["post", "put", "patch", "delete"]);
const SPEC_CANDIDATES = ["openapi.json", "swagger.json", "discovery.json", "openapi.yaml", "swagger.yaml"];

const parseArgs = (argv) => parseFlagArgs(argv, { bareValue: true }).flags;

function firstExisting(dir, names) {
  return names.map((name) => join(dir, name)).find((path) => existsSync(path)) || null;
}

function listSystemDirs(root) {
  return readdirSync(root)
    .filter((name) => {
      const full = join(root, name);
      return statSync(full).isDirectory();
    })
    .sort();
}

function unique(values) {
  return [...new Set(values.filter((value) => value !== undefined && value !== null && String(value) !== ""))];
}

function histogram(values) {
  return values.reduce((acc, value) => {
    const key = String(value || "unknown");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function topEntries(counts, limit = 12) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function operationText(op) {
  return [
    op.operationId,
    op.path,
    op.summary,
    ...(op.tags || []),
    ...(op.params || []).map((param) => `${param.name} ${param.description || ""}`),
  ].join(" ");
}

function commonPathSegments(path) {
  return String(path || "")
    .split("/")
    .filter(Boolean)
    .filter((segment) => !segment.startsWith("{") && !segment.startsWith(":"))
    .filter((segment) => !/^(api|v\d+|rest|services|latest)$/i.test(segment));
}

function clusterKey(op) {
  if (op.tags && op.tags.length) return String(op.tags[0]);
  const parts = commonPathSegments(op.path);
  return parts[0] || "default";
}

function responseStatusCodes(spec) {
  const codes = [];
  if (!spec?.paths) return codes;
  for (const pathItem of Object.values(spec.paths)) {
    if (!pathItem || typeof pathItem !== "object") continue;
    for (const method of ["get", "post", "put", "patch", "delete"]) {
      const op = pathItem[method];
      if (!op || typeof op !== "object") continue;
      for (const code of Object.keys(op.responses || {})) codes.push(code);
    }
  }
  return codes;
}

function responseHeaders(spec) {
  const headers = [];
  if (!spec?.paths) return headers;
  for (const pathItem of Object.values(spec.paths)) {
    if (!pathItem || typeof pathItem !== "object") continue;
    for (const method of ["get", "post", "put", "patch", "delete"]) {
      const op = pathItem[method];
      if (!op || typeof op !== "object") continue;
      for (const response of Object.values(op.responses || {})) {
        for (const header of Object.keys(response?.headers || {})) headers.push(header);
      }
    }
  }
  return headers;
}

function securitySummary(spec) {
  if (!spec || typeof spec !== "object") return { schemes: [], required: false, oauthScopes: [] };
  const schemes = [];
  const scopes = [];
  const swaggerDefs = spec.securityDefinitions || {};
  for (const [name, def] of Object.entries(swaggerDefs)) {
    schemes.push({ name, type: def.type || "unknown", in: def.in, header: def.name });
    if (def.scopes) scopes.push(...Object.keys(def.scopes));
  }
  const openApiDefs = spec.components?.securitySchemes || {};
  for (const [name, def] of Object.entries(openApiDefs)) {
    schemes.push({ name, type: def.type || "unknown", scheme: def.scheme, bearerFormat: def.bearerFormat });
    if (def.flows) {
      for (const flow of Object.values(def.flows)) {
        if (flow?.scopes) scopes.push(...Object.keys(flow.scopes));
      }
    }
  }
  const discoveryScopes = spec.auth?.oauth2?.scopes || {};
  for (const scope of Object.keys(discoveryScopes)) {
    scopes.push(scope);
  }
  if (Object.keys(discoveryScopes).length) {
    schemes.push({ name: "oauth2", type: "oauth2" });
  }
  return {
    schemes,
    required: Array.isArray(spec.security) && spec.security.length > 0,
    oauthScopes: unique(scopes).slice(0, 30),
  };
}

function schemaSummary(spec, format) {
  let schemas = {};
  if (format === "openapi3") schemas = spec.components?.schemas || {};
  else if (format === "swagger2") schemas = spec.definitions || {};
  else if (format === "discovery") schemas = spec.schemas || {};
  const names = Object.keys(schemas);
  const fieldCounts = names.map((name) => Object.keys(schemas[name]?.properties || {}).length);
  const enumFields = [];
  for (const [schemaName, schema] of Object.entries(schemas)) {
    for (const [field, prop] of Object.entries(schema?.properties || {})) {
      if (Array.isArray(prop?.enum) && prop.enum.length) enumFields.push(`${schemaName}.${field}`);
    }
  }
  return {
    count: names.length,
    sample: names.slice(0, 20),
    avgFields: fieldCounts.length ? Number((fieldCounts.reduce((sum, n) => sum + n, 0) / fieldCounts.length).toFixed(1)) : 0,
    enumFieldSample: enumFields.slice(0, 20),
  };
}

function operationSignals(ops, spec) {
  const methods = histogram(ops.map((op) => op.httpMethod));
  const params = ops.flatMap((op) => op.params || []);
  const paramNames = params.map((param) => param.name).filter(Boolean);
  const paginationParams = unique(paramNames.filter((name) => PAGINATION_PARAM_RE.test(name)));
  const filterParams = unique(paramNames.filter((name) => FILTER_PARAM_RE.test(name)));
  const asyncOps = ops.filter((op) => ASYNC_RE.test(operationText(op))).slice(0, 20);
  const webhookOps = ops.filter((op) => WEBHOOK_RE.test(operationText(op))).slice(0, 20);
  const writes = ops.filter((op) => WRITE_METHODS.has(String(op.httpMethod).toLowerCase()));
  const statusCodes = responseStatusCodes(spec);
  const headers = responseHeaders(spec);
  const errorCodes = unique(statusCodes.filter((code) => code === "default" || Number(code) >= 400));
  const responseSignals = {
    statusCodes: topEntries(histogram(statusCodes), 16),
    errorCodes,
    headers: unique(headers).slice(0, 24),
    has429: errorCodes.includes("429"),
    has409: errorCodes.includes("409"),
    has202: statusCodes.includes("202"),
    hasLinkHeader: headers.some((header) => /^link$/i.test(header)),
    hasRateLimitHeaders: headers.some((header) => /rate.*limit|retry.*after/i.test(header)),
  };
  return {
    operationCount: ops.length,
    methodCounts: methods,
    writeOperationCount: writes.length,
    topClusters: topEntries(histogram(ops.map(clusterKey)), 18),
    pagination: {
      params: paginationParams,
      styles: inferPaginationStyles(paginationParams, responseSignals),
      operationCount: ops.filter((op) => (op.params || []).some((param) => PAGINATION_PARAM_RE.test(param.name))).length,
    },
    filtering: {
      params: filterParams,
      operationCount: ops.filter((op) => (op.params || []).some((param) => FILTER_PARAM_RE.test(param.name))).length,
    },
    async: {
      operationCount: asyncOps.length,
      sample: asyncOps.map(publicOperation),
      suggested: asyncOps.length > 0 || responseSignals.has202,
    },
    webhooks: {
      operationCount: webhookOps.length,
      sample: webhookOps.map(publicOperation),
      suggested: webhookOps.length > 0,
    },
    responses: responseSignals,
  };
}

function inferPaginationStyles(params, responses) {
  const styles = [];
  const lower = params.map((param) => param.toLowerCase());
  if (lower.some((param) => /cursor|after|before/.test(param))) styles.push("cursor");
  if (lower.some((param) => /page_?token|next_?page_?token/.test(param))) styles.push("page-token");
  if (lower.some((param) => /offset|start_?at/.test(param))) styles.push("offset");
  if (lower.some((param) => /^page$|per_?page|page_?size/.test(param))) styles.push("page-number");
  if (responses.hasLinkHeader) styles.push("link-header");
  return unique(styles);
}

function publicOperation(op) {
  return {
    id: op.operationId,
    method: String(op.httpMethod || "").toUpperCase(),
    path: op.path,
    summary: op.summary,
  };
}

function isEnumFieldSpec(fieldSpec) {
  if (typeof fieldSpec === "string") return fieldSpec.startsWith("enum:");
  return Boolean(fieldSpec && typeof fieldSpec === "object" && Array.isArray(fieldSpec.enum) && fieldSpec.enum.length);
}

function currentPackSummary(systemId) {
  const dir = join(SYSTEMS_DIR, systemId);
  const schema = readJson(join(dir, "schema.json"), {});
  const tools = readJson(join(dir, "tools.json"), {});
  const workflows = readJson(join(dir, "workflows.json"), {});
  const seed = readJson(join(dir, "seed.json"), {});
  const registry = readJson(join(SYSTEMS_DIR, "registry.json"), { simulators: [] });
  const entry = (registry.simulators || []).find((sim) => sim.id === systemId) || {};
  const toolList = tools.tools || [];
  const handlerList = Object.values(workflows.toolHandlers || {});
  const collectionEntries = Object.entries(schema.collections || {});
  const apiProfile = schema.apiProfile || {};
  const seedRows = Object.entries(seed || {}).reduce((sum, [name, rows]) => (
    name === "audit_events" ? sum : sum + (Array.isArray(rows) ? rows.length : 0)
  ), 0);
  return {
    maturity: entry.maturity || null,
    collections: collectionEntries.length,
    fields: collectionEntries.reduce((sum, [, spec]) => sum + Object.keys(spec.fields || {}).length, 0),
    enumFields: collectionEntries.reduce(
      (sum, [, spec]) => sum + Object.values(spec.fields || {}).filter(isEnumFieldSpec).length,
      0,
    ),
    tools: toolList.length,
    toolNames: toolList.map((tool) => tool.name).filter(Boolean),
    handlers: handlerList.length,
    handlersWithFailures: handlerList.filter((handler) => handler.failureModes && Object.keys(handler.failureModes).length).length,
    handlersWithApprovals: handlerList.filter((handler) => Array.isArray(handler.approvalBlockers) && handler.approvalBlockers.length).length,
    handlersWithRateLimit: handlerList.filter((handler) => handler.rateLimit && Object.keys(handler.rateLimit).length).length,
    seedRows,
    hasAsyncTool: toolList.some((tool) => tool.name === "poll_async_job"),
    hasApiProfilePagination: Boolean(apiProfile.pagination && Object.keys(apiProfile.pagination).length),
    hasApiProfileSecurity: Array.isArray(apiProfile.security)
      ? apiProfile.security.length > 0
      : Boolean(apiProfile.security && Object.keys(apiProfile.security).length),
    hasCommonErrors: Array.isArray(apiProfile.commonErrors)
      ? apiProfile.commonErrors.length > 0
      : Boolean(apiProfile.errors && Object.keys(apiProfile.errors).length),
    hasWebhookEmit: handlerList.some((handler) => Array.isArray(handler.emit) && handler.emit.length),
    hasEventCollections: collectionEntries.some(([name]) => /^(alerts?|events?|audit_events?|incidents?|webhooks?|subscriptions?)$/i.test(name)),
    queryAwareSearchTools: toolList.filter((tool) => tool.binding?.op === "search" && tool.binding?.query).length,
  };
}

function realismRecommendations(systemId, metadata, specSummary, pack) {
  const recs = [];
  if (!specSummary.hasMachineSpec) {
    recs.push("No machine-readable OpenAPI/Swagger/Discovery file is cached; use cached docs/source metadata only until an official spec is added.");
    if (metadata?.reason) recs.push(metadata.reason);
    return recs;
  }
  const signals = specSummary.signals;
  if (signals.pagination.params.length && !pack.hasApiProfilePagination) {
    recs.push(`Add apiProfile.pagination with ${signals.pagination.styles.join("/") || "explicit"} style and params ${signals.pagination.params.join(", ")}.`);
  }
  if (signals.filtering.params.length && pack.queryAwareSearchTools === 0) {
    recs.push(`Preserve upstream query/filter/sort params in tools.json: ${signals.filtering.params.slice(0, 10).join(", ")}.`);
  }
  if (specSummary.security.schemes.length && !pack.hasApiProfileSecurity) {
    recs.push(`Add apiProfile.security from upstream schemes: ${specSummary.security.schemes.map((s) => `${s.name}:${s.type}`).join(", ")}.`);
  }
  if (signals.responses.errorCodes.length && !pack.hasCommonErrors) {
    recs.push(`Map upstream error/status envelope, especially ${signals.responses.errorCodes.slice(0, 10).join(", ")}.`);
  }
  if ((signals.responses.has429 || signals.responses.hasRateLimitHeaders) && pack.handlersWithRateLimit === 0) {
    recs.push("Configure workflow rateLimit and retry-after behavior for write tools.");
  }
  if ((signals.async.suggested || signals.responses.has202) && !pack.hasAsyncTool) {
    recs.push("Add async operation support: poll_async_job tool plus async workflows for job/run/import/export operations.");
  }
  if (signals.webhooks.suggested && !pack.hasWebhookEmit && !pack.hasEventCollections) {
    recs.push("Model webhook/event subscriptions and emit transition events from workflows.");
  }
  if (specSummary.schemas.enumFieldSample.length && pack.enumFields === 0) {
    recs.push(`Promote schema enums from upstream models, e.g. ${specSummary.schemas.enumFieldSample.slice(0, 6).join(", ")}.`);
  }
  if (pack.seedRows < 25) {
    recs.push(`Current pack has only ${pack.seedRows} non-audit seed rows; regenerate scenario-grade seeds after schema/workflow enrichment.`);
  }
  if (pack.handlersWithFailures === 0 && signals.responses.errorCodes.length) {
    recs.push("Current workflows do not declare weighted failure modes; derive validation/conflict/rate-limit/timeout modes from upstream responses.");
  }
  return recs;
}

function analyzeSystem(systemId) {
  const dir = join(OPENAPI_DIR, systemId);
  const metadata = readJson(join(dir, "source.json"), {});
  const specPath = firstExisting(dir, SPEC_CANDIDATES);
  const pack = currentPackSummary(systemId);
  if (!specPath) {
    return {
      systemId,
      displayName: metadata.displayName || systemId,
      scrapedStatus: metadata.status || "unknown",
      docsCached: Boolean(metadata.docsCache?.ok),
      hasMachineSpec: false,
      specFile: null,
      pack,
      recommendations: realismRecommendations(systemId, metadata, { hasMachineSpec: false }, pack),
    };
  }
  let spec;
  try {
    spec = loadSpec(specPath);
  } catch (error) {
    return {
      systemId,
      displayName: metadata.displayName || systemId,
      scrapedStatus: metadata.status || "unknown",
      docsCached: Boolean(metadata.docsCache?.ok),
      hasMachineSpec: true,
      specFile: relative(APP_DIR, specPath),
      parseError: error.message,
      pack,
      recommendations: [`Machine-readable spec exists but could not be loaded: ${error.message}`],
    };
  }
  let parsed;
  try {
    parsed = detectFormatAndParse(spec);
  } catch (error) {
    return {
      systemId,
      displayName: metadata.displayName || systemId,
      scrapedStatus: metadata.status || "unknown",
      docsCached: Boolean(metadata.docsCache?.ok),
      hasMachineSpec: true,
      specFile: relative(APP_DIR, specPath),
      parseError: error.message,
      pack,
      recommendations: [`Machine-readable spec exists but could not be parsed: ${error.message}`],
    };
  }

  const signals = operationSignals(parsed.ops, spec);
  const summary = {
    systemId,
    displayName: metadata.displayName || spec.info?.title || systemId,
    scrapedStatus: metadata.status || "unknown",
    docsCached: Boolean(metadata.docsCache?.ok),
    hasMachineSpec: true,
    specFile: relative(APP_DIR, specPath),
    format: parsed.format,
    title: spec.info?.title || spec.name || metadata.displayName || systemId,
    version: spec.info?.version || spec.version || null,
    security: securitySummary(spec),
    schemas: schemaSummary(spec, parsed.format),
    signals,
    pack,
  };
  summary.recommendations = realismRecommendations(systemId, metadata, summary, pack);
  return summary;
}

function aggregate(systems) {
  const withSpec = systems.filter((system) => system.hasMachineSpec);
  const parsedSpecs = withSpec.filter((system) => system.signals);
  const parseErrorSpecs = withSpec.filter((system) => system.parseError);
  const withoutSpec = systems.filter((system) => !system.hasMachineSpec);
  return {
    generatedAt: new Date().toISOString(),
    systems: systems.length,
    machineReadableSpecs: withSpec.length,
    specsNeedingParserSupport: parseErrorSpecs.map((system) => system.systemId),
    docsOnly: withoutSpec.length,
    totalOperations: parsedSpecs.reduce((sum, system) => sum + (system.signals.operationCount || 0), 0),
    systemsWithPaginationSignals: parsedSpecs.filter((system) => system.signals.pagination.params.length).map((system) => system.systemId),
    systemsWithAsyncSignals: parsedSpecs.filter((system) => system.signals.async.suggested).map((system) => system.systemId),
    systemsWithWebhookSignals: parsedSpecs.filter((system) => system.signals.webhooks.suggested).map((system) => system.systemId),
    systemsWithRateLimitSignals: parsedSpecs.filter((system) => system.signals.responses.has429 || system.signals.responses.hasRateLimitHeaders).map((system) => system.systemId),
    starterPacksWithMachineSpecs: parsedSpecs.filter((system) => system.pack?.maturity === "starter").map((system) => system.systemId),
    docsOnlySystems: withoutSpec.map((system) => system.systemId),
  };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# OpenAPI Realism Analysis");
  lines.push("");
  lines.push(`Generated: ${report.summary.generatedAt}`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Systems scanned: ${report.summary.systems}`);
  lines.push(`- Machine-readable specs: ${report.summary.machineReadableSpecs}`);
  lines.push(`- Specs needing parser support: ${report.summary.specsNeedingParserSupport.join(", ") || "none"}`);
  lines.push(`- Docs/source-metadata only: ${report.summary.docsOnly}`);
  lines.push(`- Parsed operations: ${report.summary.totalOperations}`);
  lines.push(`- Pagination signals: ${report.summary.systemsWithPaginationSignals.join(", ") || "none"}`);
  lines.push(`- Async/job signals: ${report.summary.systemsWithAsyncSignals.join(", ") || "none"}`);
  lines.push(`- Webhook/event signals: ${report.summary.systemsWithWebhookSignals.join(", ") || "none"}`);
  lines.push(`- Rate-limit signals: ${report.summary.systemsWithRateLimitSignals.join(", ") || "none"}`);
  lines.push("");
  lines.push("## High-Value Spec Signals");
  lines.push("");
  for (const system of report.systems.filter((item) => item.hasMachineSpec && item.signals)) {
    lines.push(`### ${system.displayName} (${system.systemId})`);
    lines.push("");
    lines.push(`- Spec: \`${system.specFile}\` (${system.format}, ${system.signals.operationCount} operations)`);
    lines.push(`- Current pack: ${system.pack.maturity || "unknown"}, ${system.pack.tools} tools, ${system.pack.handlers} handlers, ${system.pack.seedRows} non-audit seed rows`);
    lines.push(`- Security: ${system.security.schemes.map((scheme) => `${scheme.name}:${scheme.type}`).join(", ") || "none detected"}`);
    lines.push(`- Pagination params: ${system.signals.pagination.params.join(", ") || "none detected"}`);
    lines.push(`- Filter/query params: ${system.signals.filtering.params.slice(0, 16).join(", ") || "none detected"}`);
    lines.push(`- Error codes: ${system.signals.responses.errorCodes.slice(0, 16).join(", ") || "none detected"}`);
    if (system.signals.async.sample.length) {
      lines.push(`- Async/job sample: ${system.signals.async.sample.slice(0, 4).map((op) => `${op.method} ${op.path}`).join("; ")}`);
    }
    if (system.signals.webhooks.sample.length) {
      lines.push(`- Webhook/event sample: ${system.signals.webhooks.sample.slice(0, 4).map((op) => `${op.method} ${op.path}`).join("; ")}`);
    }
    lines.push("- Recommendations:");
    for (const rec of system.recommendations.slice(0, 8)) lines.push(`  - ${rec}`);
    lines.push("");
  }
  const parseErrors = report.systems.filter((item) => item.hasMachineSpec && item.parseError);
  if (parseErrors.length) {
    lines.push("## Machine Specs Requiring Parser Support");
    lines.push("");
    for (const system of parseErrors) {
      lines.push(`- \`${system.systemId}\`: \`${system.specFile}\` exists, but the analyzer cannot parse it yet (${system.parseError}).`);
    }
    lines.push("");
  }
  lines.push("## Docs-Only Systems");
  lines.push("");
  lines.push("These systems have cached docs/source metadata but no machine-readable spec. They need either a public spec, an internal captured spec, or a manually curated API profile before automated OpenAPI learning can help.");
  lines.push("");
  lines.push(report.summary.docsOnlySystems.map((systemId) => `\`${systemId}\``).join(", "));
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const requested = flags.system
    ? new Set(parseList(String(flags.system)))
    : null;
  const systems = listSystemDirs(OPENAPI_DIR)
    .filter((systemId) => !requested || requested.has(systemId))
    .map(analyzeSystem);
  const report = { summary: aggregate(systems), systems };
  const out = resolve(flags.out || join(ARTIFACTS_DIR, "openapi-realism-analysis.json"));
  const markdown = resolve(flags.markdown || join(ARTIFACTS_DIR, "openapi-realism-analysis.md"));
  writeJson(out, report);
  writeFileSync(markdown, renderMarkdown(report), "utf8");
  console.log(JSON.stringify({
    ok: true,
    systems: report.summary.systems,
    machineReadableSpecs: report.summary.machineReadableSpecs,
    totalOperations: report.summary.totalOperations,
    out,
    markdown,
  }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
