#!/usr/bin/env node
// generate-tools-from-openapi.mjs
//
// Parse OpenAPI 3.x, Swagger 2.0, and Google Discovery specs and emit
// endpoint-shaped simulator contract files (schema/tools/workflows/seed/
// projection/materialization) that the GENERIC engine (simulator_runtime/generic.py)
// can serve directly.
//
// "Endpoint-shaped" means: tool names and inputSchema fields are derived from the
// real API operations (operationId / HTTP method / parameters / requestBody), then
// mapped onto the small set of generic-engine conventions:
//   reads   -> search_<collection>(query + domain filters + limit)
//              get_<singular>(<pk> + endpoint params)
//   writes  -> submit_<singular>_update(<pk>, <stateField>, note, role, idempotency_key + endpoint params)
//   always  -> list_audit_events  (and list_pending_approvals when an `approvals` collection exists)
//
// Deterministic + idempotent: same spec + same config => byte-identical output.
// Importable (export functions) + CLI-runnable (node generate-tools-from-openapi.mjs [systemId...]).
//
// Usage:
//   node scripts/generate-tools-from-openapi.mjs            # all configured systems
//   node scripts/generate-tools-from-openapi.mjs okta github
//
// No external deps (uses only node:fs / node:path).

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEMS_DIR = resolve(__dirname, "..", "simulator-systems");
const OPENAPI_DIR = join(SYSTEMS_DIR, "_openapi");

// ---------------------------------------------------------------------------
// Spec format parsers — normalise each format into a flat list of operations:
//   { httpMethod, path, operationId, tags, summary, params:[{name,in,required,type,description}], hasBody }
// ---------------------------------------------------------------------------

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];

function jsonSchemaType(schema) {
  if (!schema || typeof schema !== "object") return "string";
  if (schema.type === "integer" || schema.type === "number") return "integer";
  if (schema.type === "boolean") return "boolean";
  return "string";
}

// OpenAPI 3.x: paths{} -> operations; parameters may be $ref into components.parameters.
function parseOpenApi3(spec) {
  const compParams = (spec.components && spec.components.parameters) || {};
  const resolveParam = (p) => {
    if (p && p.$ref) {
      const key = p.$ref.split("/").pop();
      p = compParams[key] || {};
    }
    return {
      name: p.name,
      in: p.in,
      required: Boolean(p.required),
      type: jsonSchemaType(p.schema),
      description: p.description,
    };
  };
  const ops = [];
  for (const [path, item] of Object.entries(spec.paths || {})) {
    const pathParams = (item.parameters || []).map(resolveParam);
    for (const method of HTTP_METHODS) {
      const op = item[method];
      if (!op || typeof op !== "object") continue;
      const params = pathParams.concat((op.parameters || []).map(resolveParam)).filter((p) => p.name);
      ops.push({
        httpMethod: method,
        path,
        operationId: op.operationId || `${method}${path}`,
        tags: op.tags || [],
        summary: op.summary || op.description || "",
        params,
        hasBody: Boolean(op.requestBody),
      });
    }
  }
  return ops;
}

// Swagger 2.0: paths{} -> operations; parameters inline; body params signalled via in:body.
function parseSwagger2(spec) {
  const ops = [];
  for (const [path, item] of Object.entries(spec.paths || {})) {
    const pathLevel = item.parameters || [];
    for (const method of HTTP_METHODS) {
      const op = item[method];
      if (!op || typeof op !== "object") continue;
      const raw = pathLevel.concat(op.parameters || []);
      const params = [];
      let hasBody = false;
      for (const p of raw) {
        if (!p || !p.name) continue;
        if (p.in === "body") {
          hasBody = true;
          continue;
        }
        params.push({
          name: p.name,
          in: p.in,
          required: Boolean(p.required),
          type: p.type === "integer" || p.type === "number" ? "integer" : p.type === "boolean" ? "boolean" : "string",
          description: p.description,
        });
      }
      ops.push({
        httpMethod: method,
        path,
        operationId: op.operationId || `${method}${path}`,
        tags: op.tags || [],
        summary: op.summary || op.description || "",
        params,
        hasBody,
      });
    }
  }
  return ops;
}

// Google Discovery: resources{} (possibly nested) -> methods{}; methods have id/httpMethod/
// parameters{} (a map) and optional `request` (body). Operations are addressed by their
// dotted method id (e.g. bigquery.datasets.list, apigee.organizations.apis.list).
function parseDiscovery(spec) {
  const ops = [];
  const walk = (resources) => {
    for (const res of Object.values(resources || {})) {
      for (const method of Object.values(res.methods || {})) {
        const params = Object.entries(method.parameters || {}).map(([name, p]) => ({
          name,
          in: p.location || "query",
          required: Boolean(p.required),
          type: p.type === "integer" || p.type === "number" ? "integer" : p.type === "boolean" ? "boolean" : "string",
          description: p.description,
        }));
        ops.push({
          httpMethod: (method.httpMethod || "GET").toLowerCase(),
          path: method.flatPath || method.path || "",
          operationId: method.id || "",
          tags: [],
          summary: method.description || "",
          params,
          hasBody: Boolean(method.request),
        });
      }
      if (res.resources) walk(res.resources);
    }
  };
  walk(spec.resources);
  return ops;
}

function detectFormatAndParse(spec, formatHint) {
  if (formatHint === "discovery" || spec.discoveryVersion || spec.resources) {
    return { format: "discovery", ops: parseDiscovery(spec) };
  }
  if (spec.swagger === "2.0" || (formatHint === "swagger2")) {
    return { format: "swagger2", ops: parseSwagger2(spec) };
  }
  if ((spec.openapi || "").startsWith("3") || formatHint === "openapi3") {
    return { format: "openapi3", ops: parseOpenApi3(spec) };
  }
  // Last-ditch heuristics.
  if (spec.paths) {
    return spec.swagger ? { format: "swagger2", ops: parseSwagger2(spec) } : { format: "openapi3", ops: parseOpenApi3(spec) };
  }
  throw new Error("unrecognised spec format");
}

// ---------------------------------------------------------------------------
// Endpoint helpers
// ---------------------------------------------------------------------------

// Control args the search handler treats as pagination/sort and ignores for filtering.
const SEARCH_CONTROL_ARGS = new Set(["query", "limit", "offset", "page", "page_size", "sort", "sort_by", "order", "cursor"]);

function singularize(plural) {
  if (plural.endsWith("ies")) return plural.slice(0, -3) + "y";
  if (plural.endsWith("sses")) return plural.slice(0, -2);
  if (plural.endsWith("ses") || plural.endsWith("xes") || plural.endsWith("zes") || plural.endsWith("ches") || plural.endsWith("shes"))
    return plural.slice(0, -2);
  if (plural.endsWith("s") && !plural.endsWith("ss")) return plural.slice(0, -1);
  return plural;
}

// Find an operation in the parsed list by operationId (exact), tolerant of case.
function findOp(ops, operationId) {
  return ops.find((o) => o.operationId === operationId) || ops.find((o) => (o.operationId || "").toLowerCase() === operationId.toLowerCase());
}

function buildInputSchema({ kind, collection, primaryKey, op, stateField }) {
  const properties = {};
  const required = [];

  if (kind === "search") {
    properties.query = { type: "string", description: "Free-text query across record fields." };
    // Endpoint-shaped domain filters: surface the operation's non-path query params.
    for (const p of op.params) {
      if (p.in === "path") continue;
      if (p.name === "limit" || p.name === "query") continue;
      properties[p.name] = { type: p.type, ...(p.description ? { description: p.description } : {}) };
    }
    properties.limit = { type: "integer", description: "Max rows to return." };
  } else if (kind === "get") {
    properties[primaryKey] = { type: "string", description: `${singularize(collection)} primary key` };
    required.push(primaryKey);
    for (const p of op.params) {
      if (p.name === primaryKey) continue;
      if (SEARCH_CONTROL_ARGS.has(p.name)) continue;
      properties[p.name] = { type: p.type, ...(p.description ? { description: p.description } : {}) };
    }
  } else if (kind === "submit") {
    properties[primaryKey] = { type: "string", description: `${singularize(collection)} primary key` };
    required.push(primaryKey);
    properties[stateField] = { type: "string", description: `Target ${stateField}.` };
    properties.note = { type: "string", description: "Reviewer note recorded on the change." };
    properties.role = { type: "string", description: "Acting role; gated by allowedRoles." };
    properties.idempotency_key = { type: "string", description: "Replays return the original result." };
    for (const p of op.params) {
      if (p.name === primaryKey) continue;
      if (SEARCH_CONTROL_ARGS.has(p.name)) continue;
      if (["note", "role", "idempotency_key"].includes(p.name)) continue;
      properties[p.name] = { type: p.type, ...(p.description ? { description: p.description } : {}) };
    }
  }

  const schema = { type: "object", properties };
  if (required.length) schema.required = required;
  return schema;
}

// ---------------------------------------------------------------------------
// Contract generation for one system from its config.
//
// config = {
//   systemId, displayName, specFile, formatHint?,
//   stateField (default "status"),
//   collections: [{
//     name (plural collection), primaryKey, stateEnum[], description?,
//     fields: { <field>: <typeDecl> },     // generic-engine schema field decls
//     reads: { search?: operationId, get?: operationId },
//     write?: { operationId, allowedRoles[], transitions{}, ... },
//     seed: [ ...rows ]                     // referentially consistent rows
//   }],
//   approvals?: { seed:[...] }              // optional approvals collection
// }
// ---------------------------------------------------------------------------

function generateContract(config, ops) {
  const stateField = config.stateField || "status";

  // ---- schema.json (collections is a dict, mirroring workday gold standard) ----
  const schemaCollections = {};
  for (const c of config.collections) {
    schemaCollections[c.name] = {
      primaryKey: c.primaryKey,
      ...(c.description ? { description: c.description } : {}),
      fields: c.fields,
    };
  }
  if (config.approvals) {
    schemaCollections.approvals = {
      primaryKey: "approval_id",
      description: "Pending approval records that block sensitive state transitions.",
      fields: {
        approval_id: "string",
        source_record_id: "string",
        approver: "string",
        state: "enum:requested|pending|approved|rejected",
        reason: "string",
      },
    };
  }
  schemaCollections.audit_events = {
    primaryKey: "event_id",
    description: "Simulator audit log.",
    fields: {
      event_id: "string",
      actor: "string",
      role: "string",
      action: "string",
      entity: "string",
      entity_id: "string",
      outcome: "string",
      timestamp: "string",
    },
  };
  const schema = { id: `${config.systemId}_schema`, version: 2, collections: schemaCollections };

  // ---- tools.json (endpoint-shaped) ----
  const tools = [];
  const toolHandlers = {};
  for (const c of config.collections) {
    const singular = singularize(c.name);
    if (c.reads && c.reads.search) {
      const op = findOp(ops, c.reads.search);
      if (!op) throw new Error(`${config.systemId}: search op ${c.reads.search} not found in spec`);
      tools.push({
        name: `search_${c.name}`,
        description: `[${op.httpMethod.toUpperCase()} ${op.path}] ${op.summary || `Search ${c.name}.`}`.trim(),
        inputSchema: buildInputSchema({ kind: "search", collection: c.name, primaryKey: c.primaryKey, op, stateField }),
      });
    }
    if (c.reads && c.reads.get) {
      const op = findOp(ops, c.reads.get);
      if (!op) throw new Error(`${config.systemId}: get op ${c.reads.get} not found in spec`);
      tools.push({
        name: `get_${singular}`,
        description: `[${op.httpMethod.toUpperCase()} ${op.path}] ${op.summary || `Get one ${singular}.`}`.trim(),
        inputSchema: buildInputSchema({ kind: "get", collection: c.name, primaryKey: c.primaryKey, op, stateField }),
      });
    }
    if (c.write) {
      const op = findOp(ops, c.write.operationId);
      if (!op) throw new Error(`${config.systemId}: write op ${c.write.operationId} not found in spec`);
      const toolName = `submit_${singular}_update`;
      tools.push({
        name: toolName,
        description: `[${op.httpMethod.toUpperCase()} ${op.path}] ${op.summary || `Submit a controlled ${singular} update.`}`.trim(),
        inputSchema: buildInputSchema({ kind: "submit", collection: c.name, primaryKey: c.primaryKey, op, stateField }),
      });
      toolHandlers[toolName] = {
        primitive: "state_machine_update",
        collection: c.name,
        primaryKey: c.primaryKey,
        roleArg: "role",
        allowedRoles: c.write.allowedRoles || [],
        stateField,
        targetStateArg: stateField,
        noteArg: "note",
        transitions: c.write.transitions || { "*": c.stateEnum || [] },
        ...(c.write.approvalBlockers ? { approvalBlockers: c.write.approvalBlockers } : {}),
        ...(c.write.failureModes ? { failureModes: c.write.failureModes } : {}),
      };
    }
  }
  if (config.approvals) {
    tools.push({
      name: "list_pending_approvals",
      description: "List pending approval records.",
      inputSchema: { type: "object", properties: { source_record_id: { type: "string" }, limit: { type: "integer" } } },
    });
  }
  tools.push({
    name: "list_audit_events",
    description: `List ${config.displayName} simulator audit events.`,
    inputSchema: { type: "object", properties: { limit: { type: "integer" } } },
  });
  const toolsDoc = { id: `${config.systemId}_tools`, version: 2, tools };

  // ---- workflows.json ----
  const workflows = {
    id: `${config.systemId}_workflows`,
    version: 1,
    primitives: ["role_permission_gate", "state_machine_update", "approval_blocker", "audit_trail"],
    toolHandlers,
  };

  // ---- seed.json (referentially consistent rows from config) ----
  const seed = {};
  for (const c of config.collections) seed[c.name] = c.seed || [];
  if (config.approvals) seed.approvals = config.approvals.seed || [];
  seed.audit_events = [];

  // ---- projection.json (one mapping per non-audit collection) ----
  const collectionMappings = config.collections.map((c) => ({
    graphKinds: [config.systemId],
    realizedObjects: [c.name],
    simulatorCollection: c.name,
    mergeMode: "merge-records-by-primary-key",
  }));
  if (config.approvals) {
    collectionMappings.push({
      graphKinds: ["approval"],
      realizedObjects: ["approvals"],
      simulatorCollection: "approvals",
      mergeMode: "merge-records-by-primary-key",
    });
  }
  const projection = {
    id: `${config.systemId}_projection`,
    version: 1,
    materialization: `Project scenario graph concepts into ${config.systemId} collections.`,
    collectionMappings,
  };

  // ---- materialization.json (field aliases per collection) ----
  const matCollections = {};
  const aliasesFor = (fields, pk) => {
    const out = {};
    for (const field of Object.keys(fields)) {
      out[field] = field === pk ? [field, "id", "source_record_id"] : [field, "id", "source_record_id"];
    }
    return out;
  };
  for (const c of config.collections) {
    matCollections[c.name] = {
      primaryKey: c.primaryKey,
      fieldAliases: aliasesFor(c.fields, c.primaryKey),
      defaults: c.stateEnum && c.stateEnum.length ? { [stateField]: c.stateEnum[0] } : {},
    };
  }
  if (config.approvals) {
    matCollections.approvals = {
      primaryKey: "approval_id",
      fieldAliases: aliasesFor(
        { approval_id: 1, source_record_id: 1, approver: 1, state: 1, reason: 1 },
        "approval_id"
      ),
      defaults: { state: "requested" },
    };
  }
  matCollections.audit_events = {
    primaryKey: "event_id",
    fieldAliases: aliasesFor(
      { event_id: 1, actor: 1, role: 1, action: 1, entity: 1, entity_id: 1, outcome: 1, timestamp: 1 },
      "event_id"
    ),
    defaults: {},
  };
  const materialization = { id: `${config.systemId}_materialization`, version: 1, collections: matCollections };

  return { schema, tools: toolsDoc, workflows, seed, projection, materialization };
}

// Stable JSON: sorted output is unnecessary because object key insertion order is
// deterministic above; we pretty-print with 2-space indent + trailing newline.
function stableStringify(obj) {
  return JSON.stringify(obj, null, 2) + "\n";
}

function loadSpec(specFile) {
  const text = readFileSync(specFile, "utf-8");
  return /\.(ya?ml)$/i.test(specFile) ? parseYaml(text) : JSON.parse(text);
}

// Generate + (optionally) write the six contract files for one configured system.
export function generateSystem(config, { write = false } = {}) {
  const specFile = join(OPENAPI_DIR, config.systemId, config.specFile);
  if (!existsSync(specFile)) throw new Error(`spec not found: ${specFile}`);
  const spec = loadSpec(specFile);
  const { format, ops } = detectFormatAndParse(spec, config.formatHint);
  const contract = generateContract(config, ops);
  const files = {
    "schema.json": contract.schema,
    "tools.json": contract.tools,
    "workflows.json": contract.workflows,
    "seed.json": contract.seed,
    "projection.json": contract.projection,
    "materialization.json": contract.materialization,
  };
  if (write) {
    const outDir = join(SYSTEMS_DIR, config.systemId);
    for (const [name, doc] of Object.entries(files)) {
      writeFileSync(join(outDir, name), stableStringify(doc), "utf-8");
    }
  }
  return { format, opCount: contract.tools.tools.length, files };
}

// Re-exported for the unit test (one fixture per format).
export { parseOpenApi3, parseSwagger2, parseDiscovery, detectFormatAndParse, generateContract, loadSpec, singularize };

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const { SYSTEM_CONFIGS } = await import("./openapi-system-configs.mjs");
  const requested = process.argv.slice(2);
  const configs = requested.length ? SYSTEM_CONFIGS.filter((c) => requested.includes(c.systemId)) : SYSTEM_CONFIGS;
  if (!configs.length) {
    console.error(`No matching systems. Available: ${SYSTEM_CONFIGS.map((c) => c.systemId).join(", ")}`);
    process.exit(1);
  }
  for (const config of configs) {
    const { format, opCount } = generateSystem(config, { write: true });
    console.log(`${config.systemId}: format=${format} tools=${opCount} -> wrote 6 contract files`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
