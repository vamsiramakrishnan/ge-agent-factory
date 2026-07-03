#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { parseFlagArgs } from "@ge/std/cli-args";
import { dirname, join, resolve } from "node:path";
import { readJson, writeJson } from "@ge/std/json-io";
import { buildScenarioGraph } from "./factory/scenario-graph.mjs";
import { buildSimulatorProjections } from "./factory/projections/simulator-projections.mjs";
import { snakeCase } from "@ge/std/naming";
import { planRecipeYaml, renderYaml } from "@ge/synthkit/snowfakery";
import { columnSet, entitiesFor, lakehouseClass, referenceTargetFor, targetFor } from "./factory/data/lakehouse-targets.mjs";
import { resolveUseCase, useCaseFromSpec, useCaseNotFoundMessage } from "./factory/data/use-case-resolve.mjs";
import { attachPackBridgesToUseCase, packBridgesForUseCase } from "./factory/data/pack-bridges.mjs";
import { sourceTimestamp } from "../src/source-clock.js";

const parseArgs = (argv) => parseFlagArgs(argv).flags;

async function writeText(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value, "utf8");
}

function graphConceptIdsForSource(graph, sourceSystem) {
  const sourceKey = snakeCase(sourceSystem);
  return (graph.nodes || [])
    .filter((node) => snakeCase(node.props?.sourceSystem || "") === sourceKey)
    .map((node) => node.id);
}

function buildSnowfakeryRealizationPlan(plan, graph, packBridges = []) {
  const objectsByName = new Map();
  const upsertObject = ({ object, count = 20, fields = columnSet(object), sourceSystems = [], graphNodeIds = [], packBridgeIds = [], simulatorCollections = [] }) => {
    const existing = objectsByName.get(object) || {
      object,
      count,
      fields,
      sourceSystems: [],
      graphNodeIds: [],
      packBridgeIds: [],
      simulatorCollections: [],
    };
    existing.count = Math.max(existing.count || 0, count || 0);
    existing.fields = Array.from(new Set([...(existing.fields || []), ...(fields || [])]));
    existing.sourceSystems = Array.from(new Set([...(existing.sourceSystems || []), ...sourceSystems]));
    existing.graphNodeIds = Array.from(new Set([...(existing.graphNodeIds || []), ...graphNodeIds]));
    existing.packBridgeIds = Array.from(new Set([...(existing.packBridgeIds || []), ...packBridgeIds]));
    existing.simulatorCollections = Array.from(new Set([...(existing.simulatorCollections || []), ...simulatorCollections]));
    objectsByName.set(object, existing);
  };
  for (const source of plan.sources.filter((item) => ["OLTP", "OLTP_NOSQL", "OLAP"].includes(item.target.class))) {
    const graphNodeIds = graphConceptIdsForSource(graph, source.system);
    for (const entity of source.entities) {
      upsertObject({
        object: entity,
        count: 20,
        fields: columnSet(entity),
        sourceSystems: [source.system],
        graphNodeIds,
      });
    }
  }
  for (const bridge of packBridges || []) {
    for (const collection of bridge.simulatorCollections || []) {
      upsertObject({
        object: collection,
        count: 25,
        fields: columnSet(collection),
        packBridgeIds: [bridge.packId],
        simulatorCollections: [collection],
      });
    }
  }
  return {
    id: `${plan.id}_snowfakery_realization`,
    generatedAt: plan.generatedAt,
    scenarioGraph: "mock_data/scenario/scenario-graph.json",
    purpose: "Graph-controlled Snowfakery configuration for large sample-set generation.",
    objects: [...objectsByName.values()],
  };
}

function graphDatastoreSummary(graph) {
  const summary = {};
  for (const node of graph.nodes || []) {
    const datastore = node.props?.datastore;
    if (!datastore) continue;
    if (!summary[datastore]) summary[datastore] = { datastore, class: node.props?.datastoreClass || null, nodes: 0, systems: [] };
    summary[datastore].nodes += 1;
    if (node.kind === "source_system") summary[datastore].systems.push(node.label);
    summary[datastore].systems = Array.from(new Set(summary[datastore].systems));
  }
  return Object.values(summary);
}

function packageManifestFor(datastore) {
  if (datastore.id === "alloydb") {
    return {
      id: "alloydb-operational-package",
      datastore: datastore.id,
      class: datastore.class,
      sourceRecipe: "mock_data/snowfakery/structured.recipe.yml",
      systems: datastore.systems,
      entities: datastore.entities,
      outputs: {
        ddl: "mock_data/oltp/alloydb/schema.sql",
        loadData: "mock_data/oltp/alloydb/seed.ndjson",
        loadScript: "mock_data/oltp/alloydb/load-alloydb.sh",
      },
      packageNotes: "AlloyDB packager owns SQL constraints, transactional source records, foreign keys, and audit tables.",
    };
  }
  if (datastore.id === "firestore") {
    return {
      id: "firestore-operational-package",
      datastore: datastore.id,
      class: datastore.class,
      sourceRecipe: "mock_data/snowfakery/structured.recipe.yml",
      systems: datastore.systems,
      entities: datastore.entities,
      outputs: {
        collections: "mock_data/oltp/firestore/collections.json",
        documents: "mock_data/oltp/firestore/documents.ndjson",
        loadScript: "mock_data/oltp/firestore/load-firestore.sh",
      },
      packageNotes: "Firestore packager owns document IDs, collection paths, denormalized event records, and batch import scripts.",
    };
  }
  if (datastore.id === "bigtable") {
    return {
      id: "bigtable-event-package",
      datastore: datastore.id,
      class: datastore.class,
      sourceRecipe: "mock_data/snowfakery/structured.recipe.yml",
      systems: datastore.systems,
      entities: datastore.entities,
      outputs: {
        tableConfig: "mock_data/oltp/bigtable/table.yaml",
        mutations: "mock_data/oltp/bigtable/mutations.ndjson",
        loadScript: "mock_data/oltp/bigtable/load-bigtable.sh",
      },
      packageNotes: "Bigtable packager owns row-key strategy, column families, high-volume event/time-series records, and mutation batches.",
    };
  }
  if (datastore.id === "bigquery") {
    return {
      id: "bigquery-analytics-package",
      datastore: datastore.id,
      class: datastore.class,
      sourceRecipe: "mock_data/snowfakery/structured.recipe.yml",
      systems: datastore.systems,
      entities: datastore.entities,
      outputs: {
        schemas: "mock_data/olap/bigquery/schemas/",
        ndjson: "mock_data/olap/bigquery/ndjson/",
        loadScript: "mock_data/olap/bigquery/load-bigquery.sh",
      },
      packageNotes: "BigQuery packager owns OLAP schemas, partitioning/clustering choices, facts, snapshots, and warehouse load files.",
    };
  }
  if (datastore.id === "gcs") {
    return {
      id: "gcs-blob-package",
      datastore: datastore.id,
      class: datastore.class,
      sourceRecipe: "mock_data/blobs/manifest.yaml",
      systems: datastore.systems,
      entities: datastore.entities,
      outputs: {
        objects: "mock_data/blobs/gcs/objects/",
        manifest: "mock_data/blobs/manifest.yaml",
        documentsManifest: "mock_data/blobs/documents_manifest.ndjson",
        loadScript: "mock_data/blobs/load-gcs.sh",
      },
      packageNotes: "Blob packager owns PDF/DOCX/Markdown evidence, checksums, object paths, and document citation metadata.",
    };
  }
  return {
    id: `${datastore.id}-package`,
    datastore: datastore.id,
    class: datastore.class,
    systems: datastore.systems,
    entities: datastore.entities,
    packageNotes: "Runtime dependencies are recorded in the plan but are not source-data packages.",
  };
}

function packagePathFor(datastore) {
  if (datastore.id === "alloydb") return ["mock_data", "oltp", "alloydb", "package.yaml"];
  if (datastore.id === "firestore") return ["mock_data", "oltp", "firestore", "package.yaml"];
  if (datastore.id === "bigtable") return ["mock_data", "oltp", "bigtable", "package.yaml"];
  if (datastore.id === "bigquery") return ["mock_data", "olap", "bigquery", "package.yaml"];
  if (datastore.id === "gcs") return ["mock_data", "blobs", "manifest.yaml"];
  return ["mock_data", "plan", `${datastore.id}.package.yaml`];
}

function isApiProtocol(protocol = "") {
  return /api|rest|graphql|grpc|bapi|rfc|soap|sftp/i.test(String(protocol));
}

function isSourceAdapterCandidate(source) {
  return isApiProtocol(source.protocol) && source.sourceKind !== "ai_or_model" && source.target?.class !== "RUNTIME";
}

function apiMethodFor(source) {
  const direction = String(source.direction || "read").toLowerCase();
  if (direction.includes("write") || direction.includes("update") || direction.includes("sync")) return "post";
  return "get";
}

function apiPathFor(source) {
  return `/systems/${snakeCase(source.system)}/${snakeCase(source.direction || "records")}`;
}

function renderOpenApi(plan) {
  const paths = {};
  for (const source of plan.sources.filter(isSourceAdapterCandidate)) {
    const method = apiMethodFor(source);
    paths[apiPathFor(source)] = {
      [method]: {
        operationId: `${method}_${snakeCase(source.system)}_${snakeCase(source.direction || "records")}`,
        summary: `${source.direction || "Read"} ${source.system}`,
        description: source.description,
        responses: {
          200: {
            description: "Deterministic fixture-backed response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    source_system: { type: "string" },
                    source_record_id: { type: "string" },
                    evidence_type: { type: "string" },
                    audit_trail: { type: "string" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
    };
  }
  return {
    openapi: "3.1.0",
    info: {
      title: `${plan.title} Source Adapter API`,
      version: "0.1.0",
      description: "Generated API contract for fixture-backed source adapters. Deploy later behind Cloud Run/API Gateway if a live service simulation is required.",
    },
    servers: [
      { url: "http://localhost:8080", description: "Local fixture-backed adapter" },
      { url: "https://<service-url>", description: "Optional Cloud Run adapter" },
    ],
    paths,
  };
}

function renderMcpTools(plan) {
  return plan.sources.filter(isSourceAdapterCandidate).map((source) => ({
    name: `${apiMethodFor(source)}_${snakeCase(source.system)}_${snakeCase(source.direction || "records")}`,
    description: `${source.direction || "Read"} ${source.system}: ${source.description}`,
    path: apiPathFor(source),
    method: apiMethodFor(source).toUpperCase(),
    inputSchema: {
      type: "object",
      properties: {
        workspaceId: { type: "string", description: "Generated agent workspace namespace." },
        sourceRecordId: { type: "string", description: "Optional source record id for deterministic fixture lookup." },
        idempotencyKey: { type: "string", description: "Required for write/sync operations to make retries safe." },
      },
      required: apiMethodFor(source) === "post" ? ["workspaceId", "idempotencyKey"] : ["workspaceId"],
    },
    // Facade binding: how the per-department MCP server maps this tool to a per-agent
    // 1P store op (store_backend.plan_op). The source-system envelope on the result is
    // what creates the Workday/Ariba effect over the bound store.
    binding: {
      op: apiMethodFor(source) === "post" ? "action" : "read",
      store: source.target?.datastore || "bigquery",
      entity: snakeCase((source.entities && source.entities[0]) || source.system),
      key: "sourceRecordId",
      sourceSystem: source.system,
      shape: "source_system_record",
    },
  }));
}

function renderMcpAdapterSource(plan) {
  const tools = renderMcpTools(plan);
  return [
    "import express from 'express';",
    "import { Server } from '@modelcontextprotocol/sdk/server/index.js';",
    "import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';",
    "import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';",
    "",
    "const app = express();",
    "app.use(express.json());",
    "",
    `const tools = ${JSON.stringify(tools, null, 2)};`,
    "",
    "app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'ge-source-adapter-mcp' }));",
    "for (const tool of tools) {",
    "  const handler = (req, res) => {",
    "    const args = req.method === 'GET' ? req.query : req.body;",
    "    res.json({",
    "      source_system: tool.name,",
    "      source_record_id: args.sourceRecordId || `${tool.name}-fixture-001`,",
    "      evidence_type: 'source_system_record',",
    "      audit_trail: `${tool.name}:fixture_backed:${new Date(0).toISOString()}`,",
    "      data: { workspaceId: args.workspaceId || 'local', deterministic: true }",
    "    });",
    "  };",
    "  if (tool.method === 'POST') app.post(tool.path, handler);",
    "  else app.get(tool.path, handler);",
    "}",
    "",
    "const mcpServer = new Server({ name: 'ge-source-adapter-mcp', version: '0.1.0' }, { capabilities: { tools: {} } });",
    "mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));",
    "mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {",
    "  const tool = tools.find((item) => item.name === request.params.name);",
    "  if (!tool) return { content: [{ type: 'text', text: `Tool not found: ${request.params.name}` }], isError: true };",
    "  const args = request.params.arguments || {};",
    "  if (tool.method === 'POST' && !args.idempotencyKey) return { content: [{ type: 'text', text: 'idempotencyKey required for write operations' }], isError: true };",
    "  return { content: [{ type: 'text', text: JSON.stringify({",
    "    source_system: tool.name,",
    "    source_record_id: args.sourceRecordId || `${tool.name}-fixture-001`,",
    "    evidence_type: 'source_system_record',",
    "    audit_trail: `${tool.name}:mcp_fixture_backed:${new Date(0).toISOString()}`,",
    "    data: { workspaceId: args.workspaceId || 'local', deterministic: true }",
    "  }, null, 2) }] };",
    "});",
    "",
    "let transport;",
    "app.get('/sse', async (_req, res) => {",
    "  transport = new SSEServerTransport('/messages', res);",
    "  await mcpServer.connect(transport);",
    "});",
    "app.post('/messages', async (req, res) => {",
    "  if (!transport) return res.status(503).send('SSE transport not initialized. Connect to /sse first.');",
    "  return transport.handlePostMessage(req, res);",
    "});",
    "",
    "const PORT = process.env.PORT || 3001;",
    "app.listen(PORT, () => {",
    "  console.log(`GE source adapter MCP listening on ${PORT}`);",
    "  console.log(`SSE Endpoint: http://localhost:${PORT}/sse`);",
    "});",
    "",
  ].join("\n");
}

function fixtureForApiSource(source) {
  const method = apiMethodFor(source).toUpperCase();
  return {
    system: source.system,
    protocol: source.protocol,
    direction: source.direction,
    method,
    path: apiPathFor(source),
    request: method === "POST"
      ? {
          workspaceId: "local",
          sourceRecordId: `${snakeCase(source.system)}-fixture-001`,
          idempotencyKey: "00000000-0000-4000-8000-000000000001",
        }
      : {
          workspaceId: "local",
          sourceRecordId: `${snakeCase(source.system)}-fixture-001`,
        },
    response: {
      source_system: source.system,
      source_record_id: `${snakeCase(source.system)}-fixture-001`,
      evidence_type: "source_system_record",
      audit_trail: `${snakeCase(source.system)}:${snakeCase(source.direction || "read")}:fixture_backed:1970-01-01T00:00:00.000Z`,
      data: {
        deterministic: true,
        description: source.description,
        protocol: source.protocol,
      },
    },
  };
}

async function writeApiContracts(workspace, plan) {
  const apiSources = plan.sources.filter(isSourceAdapterCandidate);
  if (!apiSources.length) return null;
  const adapterRoot = join(workspace, "mock_data", "apis", "mcp-adapter");
  const mcpTools = renderMcpTools(plan);
  const apiFixtures = apiSources.map(fixtureForApiSource);
  const contract = {
    id: `${plan.id}_source_adapter_api`,
    generatedAt: plan.generatedAt,
    mode: "fixture_backed_service_adapter",
    pattern: "mc-systems-compatible",
    deploymentTargets: ["local Express API", "MCP SSE server", "Cloud Run", "API Gateway"],
    sources: apiSources.map((source) => ({
      system: source.system,
      protocol: source.protocol,
      direction: source.direction,
      path: apiPathFor(source),
      method: apiMethodFor(source).toUpperCase(),
      dataPackage: source.target?.datastore || "runtime",
      evidence: ["source_system_record", "generated_audit_trail"],
    })),
    artifacts: {
      openapi: "mock_data/apis/openapi.json",
      adapterManifest: "mock_data/apis/source-adapters.json",
      mcpManifest: "mock_data/apis/mcp-tools.json",
      jsonFixtures: "mock_data/apis/fixtures/",
      fixtureIndex: "mock_data/apis/fixtures/index.json",
      mcpAdapter: "mock_data/apis/mcp-adapter/",
      loadScript: "mock_data/apis/deploy-adapter.sh",
    },
  };
  await writeJson(join(workspace, "mock_data", "apis", "openapi.json"), renderOpenApi(plan));
  await writeJson(join(workspace, "mock_data", "apis", "source-adapters.json"), contract);
  await writeJson(join(workspace, "mock_data", "apis", "fixtures", "index.json"), {
    id: `${plan.id}_api_fixture_index`,
    generatedAt: plan.generatedAt,
    mode: "json_backed_api",
    fixtures: apiFixtures.map((fixture) => ({
      system: fixture.system,
      method: fixture.method,
      path: fixture.path,
      file: `mock_data/apis/fixtures/${snakeCase(fixture.system)}_${snakeCase(fixture.direction || "read")}.json`,
    })),
  });
  for (const fixture of apiFixtures) {
    await writeJson(join(workspace, "mock_data", "apis", "fixtures", `${snakeCase(fixture.system)}_${snakeCase(fixture.direction || "read")}.json`), fixture);
  }
  await writeJson(join(workspace, "mock_data", "apis", "mcp-tools.json"), {
    id: `${plan.id}_mcp_tools`,
    generatedAt: plan.generatedAt,
    transport: "sse",
    endpoints: { sse: "/sse", messages: "/messages", health: "/healthz" },
    tools: mcpTools,
  });
  await writeJson(join(adapterRoot, "package.json"), {
    name: `${plan.id}-mcp-adapter`,
    version: "0.1.0",
    type: "module",
    scripts: {
      start: "node src/mcp.js",
      build: "tsc",
    },
    dependencies: {
      "@modelcontextprotocol/sdk": "^1.29.0",
      express: "^5.2.1",
    },
    devDependencies: {
      "@types/express": "^5.0.6",
      "@types/node": "^25.7.0",
      typescript: "^6.0.3",
    },
  });
  await writeJson(join(adapterRoot, "tsconfig.json"), {
    compilerOptions: {
      target: "ES2022",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      outDir: "dist",
      rootDir: "src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
    },
    include: ["src/**/*.ts"],
  });
  await writeText(join(adapterRoot, "src", "mcp.ts"), renderMcpAdapterSource(plan));
  await writeText(join(adapterRoot, "README.md"), [
    "# Source Adapter MCP",
    "",
    "Generated from the GE use-case source map using the same shape as `mc-systems`: Express REST endpoints plus an MCP SSE server.",
    "",
    "```bash",
    "npm install",
    "npm run build",
    "npm start",
    "```",
    "",
    "The adapter is fixture-backed locally. Deploy it to Cloud Run only after validation and explicit approval.",
    "",
  ].join("\n"));
  await writeText(join(workspace, "mock_data", "apis", "deploy-adapter.sh"), [
    "#!/usr/bin/env bash",
    "set -euo pipefail",
    "# Optional: deploy fixture-backed source adapter APIs after local validation.",
    ": \"${GOOGLE_CLOUD_PROJECT:?set GOOGLE_CLOUD_PROJECT}\"",
    "SERVICE=\"${ADAPTER_SERVICE:-ge-source-adapters}\"",
    "REGION=\"${LOCATION:-us-central1}\"",
    "echo \"Deploy $SERVICE to Cloud Run with mock_data/apis/openapi.json as the contract. Keep per-workspace routing isolated by workspace id.\"",
    "",
  ].join("\n"));
  return contract;
}

function sqlTypeFor(column) {
  if (column.includes("date")) return "date";
  if (column.includes("premium") || column.includes("deductible") || column.includes("days") || column === "dependents") return "integer";
  return "text";
}

function renderAlloyDbSchema(datastore) {
  const lines = [
    "-- Generated GE mock data AlloyDB/PostgreSQL schema.",
    "-- Rows are generated from mock_data/snowfakery/structured.recipe.yml.",
    "create extension if not exists pgcrypto;",
    "",
  ];
  for (const entity of datastore.entities) {
    lines.push(`create table if not exists ${entity} (`);
    const columns = columnSet(entity);
    lines.push(...columns.map((column, index) => {
      const suffix = index === columns.length - 1 ? "" : ",";
      const constraints = column === "id" ? " primary key" : "";
      return `  ${column} ${sqlTypeFor(column)}${constraints}${suffix}`;
    }));
    lines.push(");", "");
  }
  return lines.join("\n");
}

function renderFirestoreCollections(datastore) {
  return {
    sourceRecipe: "mock_data/snowfakery/structured.recipe.yml",
    collections: datastore.entities.map((entity) => ({
      collection: entity,
      documentIdField: "id",
      sourceSystem: datastore.systems[0] || "unknown",
      fields: columnSet(entity),
    })),
  };
}

function renderBigQuerySchemas(datastore) {
  return {
    sourceRecipe: "mock_data/snowfakery/structured.recipe.yml",
    tables: datastore.entities.map((entity) => ({
      table: entity,
      schema: columnSet(entity).map((column) => ({
        name: column,
        type: sqlTypeFor(column) === "integer" ? "INT64" : sqlTypeFor(column) === "date" ? "DATE" : "STRING",
        mode: column === "id" ? "REQUIRED" : "NULLABLE",
      })),
    })),
  };
}

function renderBlobManifest(datastore) {
  return {
    sourceSystems: datastore.systems,
    objectRoot: "mock_data/blobs/gcs/objects/",
    documentsManifest: "mock_data/blobs/documents_manifest.ndjson",
    objects: datastore.entities.map((entity) => ({
      id: entity,
      title: entity.replace(/_/g, " "),
      formats: ["md", "pdf", "docx"],
      storagePrefix: `gs://<bucket>/<prefix>/documents/${entity}/`,
      citationFields: ["document_id", "section_id", "source_uri", "checksum"],
    })),
  };
}

async function writePackageManifests(workspace, plan) {
  const packages = [];
  for (const datastore of plan.datastores) {
    const manifest = packageManifestFor(datastore);
    const relativePath = packagePathFor(datastore).join("/");
    await writeText(join(workspace, ...packagePathFor(datastore)), renderYaml(manifest) + "\n");
    if (datastore.id === "alloydb") {
      await writeText(join(workspace, "mock_data", "oltp", "alloydb", "schema.sql"), renderAlloyDbSchema(datastore) + "\n");
      await writeText(join(workspace, "mock_data", "oltp", "alloydb", "load-alloydb.sh"), [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        "# Materialize Snowfakery output first, then load CSV/NDJSON into AlloyDB/PostgreSQL.",
        "psql \"$ALLOYDB_POSTGRES_DSN\" -f mock_data/oltp/alloydb/schema.sql",
        "",
      ].join("\n"));
    }
    if (datastore.id === "firestore") {
      await writeJson(join(workspace, "mock_data", "oltp", "firestore", "collections.json"), renderFirestoreCollections(datastore));
      await writeText(join(workspace, "mock_data", "oltp", "firestore", "load-firestore.sh"), [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        "# Materialize Snowfakery output first, then batch import JSON documents into Firestore.",
        "gcloud firestore import gs://<bucket>/<prefix>/firestore --project \"$GOOGLE_CLOUD_PROJECT\"",
        "",
      ].join("\n"));
    }
    if (datastore.id === "bigtable") {
      await writeText(join(workspace, "mock_data", "oltp", "bigtable", "table.yaml"), renderYaml({
        instance: "${BIGTABLE_INSTANCE}",
        table: "ge_mock_events",
        rowKeyPattern: "<source>#<entity>#<timestamp>#<id>",
        columnFamilies: {
          meta: "source system, entity, tenant, correlation ids",
          event: "event payload fields",
          audit: "ingest and replay metadata",
        },
        sources: datastore.systems,
        entities: datastore.entities,
      }) + "\n");
      await writeText(join(workspace, "mock_data", "oltp", "bigtable", "mutations.ndjson"), "");
      await writeText(join(workspace, "mock_data", "oltp", "bigtable", "load-bigtable.sh"), [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        "# Materialize Snowfakery output first, then convert high-volume event rows to Bigtable mutations.",
        ": \"${GOOGLE_CLOUD_PROJECT:?set GOOGLE_CLOUD_PROJECT}\"",
        ": \"${BIGTABLE_INSTANCE:?set BIGTABLE_INSTANCE}\"",
        "TABLE=\"${BIGTABLE_TABLE:-ge_mock_events}\"",
        "gcloud bigtable instances tables describe \"$TABLE\" --instance \"$BIGTABLE_INSTANCE\" --project \"$GOOGLE_CLOUD_PROJECT\" >/dev/null 2>&1 || gcloud bigtable instances tables create \"$TABLE\" --instance \"$BIGTABLE_INSTANCE\" --project \"$GOOGLE_CLOUD_PROJECT\" --column-families=meta,event,audit",
        "echo \"Prepared Bigtable table $BIGTABLE_INSTANCE/$TABLE. Populate mock_data/oltp/bigtable/mutations.ndjson from Snowfakery materialization before live import.\"",
        "",
      ].join("\n"));
    }
    if (datastore.id === "bigquery") {
      await writeJson(join(workspace, "mock_data", "olap", "bigquery", "schemas.json"), renderBigQuerySchemas(datastore));
      await writeText(join(workspace, "mock_data", "olap", "bigquery", "load-bigquery.sh"), [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        "# Materialize Snowfakery output first, then load NDJSON/CSV into BigQuery.",
        "bq --location \"${LOCATION:-US}\" mk --dataset \"${GOOGLE_CLOUD_PROJECT}:${BQ_DATASET}\" >/dev/null 2>&1 || true",
        "",
      ].join("\n"));
    }
    if (datastore.id === "gcs") {
      await writeText(join(workspace, "mock_data", "blobs", "object-plan.yaml"), renderYaml(renderBlobManifest(datastore)) + "\n");
      await writeText(join(workspace, "mock_data", "blobs", "documents_manifest.ndjson"), "");
      await writeText(join(workspace, "mock_data", "blobs", "load-gcs.sh"), [
        "#!/usr/bin/env bash",
        "set -euo pipefail",
        "# Generate PDF/DOCX/Markdown objects first, then upload to Cloud Storage.",
        "gcloud storage cp --recursive mock_data/blobs/gcs/objects \"gs://${GCS_BUCKET}/${GCS_PREFIX:-factory}/documents\"",
        "",
      ].join("\n"));
    }
    packages.push({ datastore: datastore.id, class: datastore.class, path: relativePath });
  }
  await writeText(join(workspace, "mock_data", "package-index.yaml"), renderYaml({
    id: `${plan.id}_package_index`,
    generatedAt: plan.generatedAt,
    plan: "mock_data/plan/data-plan.yaml",
    apis: plan.apiContracts?.length ? "mock_data/apis/source-adapters.json" : null,
    packages,
  }) + "\n");
}

function buildSimulatorSeedPlans(plan, scenarioGraph) {
  return buildSimulatorProjections({ graph: scenarioGraph, sources: plan.sources || [], packBridges: plan.packBridges || [] });
}

async function writeSimulatorSeedPlans(workspace, plan, scenarioGraph) {
  const seedPlans = buildSimulatorSeedPlans(plan, scenarioGraph);
  if (!seedPlans.length) return [];
  await writeJson(join(workspace, "mock_data", "simulators", "index.json"), {
    id: `${plan.id}_simulator_seed_index`,
    generatedAt: plan.generatedAt,
    seedRoot: "mock_data/simulators",
    runtimeEnv: "GE_SIMULATOR_SEED_ROOT=mock_data/simulators",
    scenarioGraph: "mock_data/scenario/scenario-graph.json",
    simulators: seedPlans,
  });
  for (const seedPlan of seedPlans) {
    const schemaByCollection = seedPlan.collectionMappings.reduce((map, mapping) => {
      if (!map[mapping.simulatorCollection]) {
        map[mapping.simulatorCollection] = { graphKinds: [], realizedObjects: [], mergeMode: mapping.mergeMode };
      }
      map[mapping.simulatorCollection].graphKinds.push(...(mapping.graphKinds || []));
      map[mapping.simulatorCollection].realizedObjects.push(...(mapping.realizedObjects || []));
      map[mapping.simulatorCollection].graphKinds = Array.from(new Set(map[mapping.simulatorCollection].graphKinds));
      map[mapping.simulatorCollection].realizedObjects = Array.from(new Set(map[mapping.simulatorCollection].realizedObjects));
      return map;
    }, {});
    await writeJson(join(workspace, "mock_data", "simulators", seedPlan.simulatorId, "seed-plan.json"), seedPlan);
    await writeJson(join(workspace, "mock_data", "simulators", seedPlan.simulatorId, "seed.json"), {
      _meta: {
        simulatorId: seedPlan.simulatorId,
        generatedAt: plan.generatedAt,
        sourceGraph: seedPlan.sourceGraph,
        sourceRecipe: seedPlan.sourceRecipe,
        materialization: seedPlan.materialization,
        packBridges: seedPlan.packBridges || [],
      },
      _schema: schemaByCollection,
    });
  }
  return seedPlans;
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const sourceMapPath = resolve(flags.sourceMap || "src/use-case-source-map.generated.json");
  const workspace = resolve(flags.dir || ".");
  const usecase = flags.usecase;
  const specPath = flags.spec ? resolve(flags.spec) : null;
  if (!usecase && !specPath) throw new Error("--usecase or --spec required, e.g. BenefitsAssistant or .ge/interviews/<id>/agent-spec.json");
  let match;
  if (specPath) {
    const spec = await readJson(specPath, null);
    if (!spec) throw new Error(`Spec not found or invalid JSON: ${specPath}`);
    match = useCaseFromSpec(spec, specPath);
  } else {
    const sourceMap = await readJson(sourceMapPath, null);
    if (!sourceMap) throw new Error(`Source map not found: ${sourceMapPath}. Run scripts/analyze-usecase-sources.mjs first.`);
    const resolved = resolveUseCase(sourceMap, usecase);
    if (!resolved.match) throw new Error(useCaseNotFoundMessage(usecase, resolved.suggestions, resolved.ambiguous));
    match = resolved.match;
  }
  const packBridges = packBridgesForUseCase(match);
  const enrichedMatch = attachPackBridgesToUseCase(match, packBridges);
  const sources = (match.sources || []).map((source) => ({
    system: source.system,
    description: source.description,
    direction: source.direction,
    protocol: source.protocol,
    sourceKind: source.dataKind,
    target: targetFor(source),
    entities: lakehouseClass(source) === "runtime" ? [] : entitiesFor(source),
  }));
  const scenarioGraph = buildScenarioGraph(enrichedMatch, sources);
  const datastores = Array.from(
    sources.reduce((map, source) => {
      const key = source.target.datastore;
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          class: source.target.class,
          primary: source.target.primary,
          systems: [],
          entities: [],
          packager: key,
        });
      }
      const item = map.get(key);
      item.systems.push(source.system);
      item.entities.push(...source.entities);
      item.systems = Array.from(new Set(item.systems));
      item.entities = Array.from(new Set(item.entities));
      return map;
    }, new Map()).values()
  );
  const plan = {
    id: snakeCase(match.id),
    title: match.title,
    department: match.department,
    // Injectable clock (GE_SOURCE_DATE) instead of wall time: every generatedAt
    // in the emitted mock_data/** artifacts derives from this one value (or the
    // scenario graph's, from the same clock), keeping regeneration byte-stable.
    generatedAt: sourceTimestamp(),
    sourceSlide: match.path,
    packBridges,
    taxonomy: ["OLTP", "OLTP_NOSQL", "OLAP", "UNSTRUCTURED_BLOB", "RUNTIME"],
    datastores,
    sources,
    apiContracts: sources
      .filter(isSourceAdapterCandidate)
      .map((source) => ({
        system: source.system,
        protocol: source.protocol,
        direction: source.direction,
        method: apiMethodFor(source).toUpperCase(),
        path: apiPathFor(source),
        targetRuntime: "Cloud Run/API Gateway optional; local ADK source adapter by default",
      })),
    packagers: {
      snowfakery: {
        input: "mock_data/scenario/scenario-graph.json",
        output: "mock_data/snowfakery/structured.recipe.yml",
        owns: "Large sample-set realization from the canonical scenario graph",
        requiredForScale: true,
      },
      alloydb: {
        input: "mock_data/snowfakery/structured.recipe.yml",
        output: "mock_data/oltp/alloydb/",
        owns: "OLTP SQL DDL, constraints, COPY/insert files, load script",
      },
      firestore: {
        input: "mock_data/snowfakery/structured.recipe.yml",
        output: "mock_data/oltp/firestore/",
        owns: "document JSON, collection mapping, batch write/import script",
      },
      bigtable: {
        input: "mock_data/snowfakery/structured.recipe.yml",
        output: "mock_data/oltp/bigtable/",
        owns: "row-key strategy, column-family mapping, mutation JSON, load script",
      },
      bigquery: {
        input: "mock_data/snowfakery/structured.recipe.yml",
        output: "mock_data/olap/bigquery/",
        owns: "schemas, NDJSON/CSV load files, dataset/table manifest",
      },
      gcs: {
        input: "mock_data/blobs/manifest.yaml",
        output: "mock_data/blobs/gcs/",
        owns: "PDF/DOCX/Markdown/blob objects, checksums, GCS URI manifest",
      },
      api: {
        input: "fixtures/manifest.json",
        output: "mock_data/apis/",
        owns: "OpenAPI contract, fixture-backed service adapter routing, optional Cloud Run/API Gateway deployment notes",
      },
      simulator: {
        input: "mock_data/scenario/scenario-graph.json + mock_data/snowfakery/structured.recipe.yml",
        output: "mock_data/simulators/",
        owns: "System projections and seed overlays for registry-backed stateful simulators; large collections are realized through Snowfakery",
      },
    },
    dataRealizers: [
      {
        id: "snowfakery",
        requiredForScale: true,
        input: "mock_data/scenario/scenario-graph.json",
        recipe: "mock_data/snowfakery/structured.recipe.yml",
        output: "mock_data/snowfakery/output/",
        runCommand: "uv run --with snowfakery --with 'setuptools<81' snowfakery mock_data/snowfakery/structured.recipe.yml --output-format csv --output-folder mock_data/snowfakery/output",
        purpose: "Generate large, relationally coherent sample datasets from the scenario graph.",
      },
      {
        id: "simulator-seed-materializer",
        requiredForSimulators: true,
        input: "mock_data/snowfakery/output/",
        output: "mock_data/simulators/",
        runCommand: "node apps/factory/scripts/materialize-simulator-seeds.mjs --dir <workspace>",
        purpose: "Map large Snowfakery row sets into simulator seed collections using graph-derived seed plans.",
      },
    ],
    package: {
      root: "mock_data",
      plan: "mock_data/plan/data-plan.yaml",
      scenarioGraph: "mock_data/scenario/scenario-graph.json",
      snowfakery: "mock_data/snowfakery/structured.recipe.yml",
      cloud: "mock_data/cloud/",
      blobs: "mock_data/blobs/",
      apis: "mock_data/apis/",
      simulators: "mock_data/simulators/",
    },
  };
  const simulatorSeedPlans = buildSimulatorSeedPlans(plan, scenarioGraph);
  const snowfakeryRealization = buildSnowfakeryRealizationPlan(plan, scenarioGraph, packBridges);
  plan.simulatorSeeds = simulatorSeedPlans.map((seedPlan) => ({
    simulatorId: seedPlan.simulatorId,
    sourceSystems: seedPlan.sourceSystems,
    seedOverlay: seedPlan.seedOverlay,
    sourceGraph: seedPlan.sourceGraph,
    sourceRecipe: seedPlan.sourceRecipe,
  }));
  plan.scenarioGraph = {
    path: "mock_data/scenario/scenario-graph.json",
    nodes: scenarioGraph.nodes.length,
    edges: scenarioGraph.edges.length,
    datastores: graphDatastoreSummary(scenarioGraph),
  };
  plan.snowfakeryRealization = {
    path: "mock_data/snowfakery/realization-plan.json",
    objects: snowfakeryRealization.objects.length,
    controlledBy: plan.scenarioGraph.path,
  };
  await writeJson(join(workspace, "mock_data", "scenario", "scenario-graph.json"), scenarioGraph);
  await writeJson(join(workspace, "mock_data", "snowfakery", "realization-plan.json"), snowfakeryRealization);
  await writeJson(join(workspace, "mock_data", "plan", "data-plan.json"), plan);
  await writeText(join(workspace, "mock_data", "plan", "data-plan.yaml"), renderYaml(plan) + "\n");
  // The plan-dialect renderer lives in @ge/synthkit/snowfakery; the FK-target
  // heuristics (lakehouse-targets) stay app-side and are injected.
  await writeText(join(workspace, "mock_data", "snowfakery", "structured.recipe.yml"), planRecipeYaml(snowfakeryRealization, { referenceTargetFor }));
  await writeSimulatorSeedPlans(workspace, plan, scenarioGraph);
  await writeApiContracts(workspace, plan);
  await writePackageManifests(workspace, plan);
  console.log(JSON.stringify({
    ok: true,
    usecase: match.id,
    sources: plan.sources.length,
    datastores: plan.datastores.map((item) => item.id),
    scenarioGraph: plan.scenarioGraph,
    snowfakeryRealization: plan.snowfakeryRealization,
    simulatorSeeds: plan.simulatorSeeds,
    plan: join(workspace, "mock_data", "plan", "data-plan.yaml"),
    packageIndex: join(workspace, "mock_data", "package-index.yaml"),
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
