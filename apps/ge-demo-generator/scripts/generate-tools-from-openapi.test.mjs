// generate-tools-from-openapi.test.mjs
//
// Unit tests for the OpenAPI/Discovery -> endpoint-shaped tools generator.
// One small inline fixture per supported format (OpenAPI 3.x / Swagger 2.0 /
// Google Discovery) plus end-to-end contract generation. Run with: bun test.

import { test, expect } from "bun:test";
import {
  parseOpenApi3,
  parseSwagger2,
  parseDiscovery,
  detectFormatAndParse,
  generateContract,
  singularize,
} from "./generate-tools-from-openapi.mjs";

// --- fixtures ---------------------------------------------------------------

const openapi3Fixture = {
  openapi: "3.0.3",
  components: {
    parameters: {
      Page: { name: "page", in: "query", schema: { type: "integer" } },
    },
  },
  paths: {
    "/widgets": {
      get: {
        operationId: "widgets/list",
        tags: ["Widgets"],
        summary: "List widgets",
        parameters: [{ $ref: "#/components/parameters/Page" }, { name: "state", in: "query", schema: { type: "string" } }],
      },
    },
    "/widgets/{id}": {
      get: { operationId: "widgets/get", parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }] },
      patch: {
        operationId: "widgets/update",
        requestBody: { content: { "application/json": {} } },
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      },
    },
  },
};

const swagger2Fixture = {
  swagger: "2.0",
  paths: {
    "/users": {
      get: {
        operationId: "listUsers",
        tags: ["User"],
        parameters: [
          { name: "q", in: "query", type: "string" },
          { name: "limit", in: "query", type: "integer" },
        ],
      },
    },
    "/users/{userId}": {
      get: { operationId: "getUser", parameters: [{ name: "userId", in: "path", required: true, type: "string" }] },
      put: {
        operationId: "updateUser",
        parameters: [
          { name: "userId", in: "path", required: true, type: "string" },
          { name: "body", in: "body", schema: {} },
        ],
      },
    },
  },
};

const discoveryFixture = {
  discoveryVersion: "v1",
  resources: {
    datasets: {
      methods: {
        list: { id: "svc.datasets.list", httpMethod: "GET", parameters: { projectId: { location: "query", type: "string", required: true } } },
        get: { id: "svc.datasets.get", httpMethod: "GET", parameters: { datasetId: { location: "path", type: "string", required: true } } },
      },
      resources: {
        tables: {
          methods: {
            cancel: { id: "svc.datasets.tables.cancel", httpMethod: "POST", request: { $ref: "Table" }, parameters: { tableId: { location: "path" } } },
          },
        },
      },
    },
  },
};

// --- format parsing ---------------------------------------------------------

test("parseOpenApi3 resolves $ref params and flattens operations", () => {
  const ops = parseOpenApi3(openapi3Fixture);
  expect(ops.length).toBe(3);
  const list = ops.find((o) => o.operationId === "widgets/list");
  expect(list.httpMethod).toBe("get");
  // $ref param `page` resolved + inline `state` param present.
  expect(list.params.map((p) => p.name).sort()).toEqual(["page", "state"]);
  const update = ops.find((o) => o.operationId === "widgets/update");
  expect(update.hasBody).toBe(true);
  expect(detectFormatAndParse(openapi3Fixture).format).toBe("openapi3");
});

test("parseSwagger2 extracts params and flags in:body", () => {
  const ops = parseSwagger2(swagger2Fixture);
  expect(ops.length).toBe(3);
  const list = ops.find((o) => o.operationId === "listUsers");
  expect(list.params.find((p) => p.name === "limit").type).toBe("integer");
  const update = ops.find((o) => o.operationId === "updateUser");
  expect(update.hasBody).toBe(true);
  // body param is consumed, not surfaced as a normal param.
  expect(update.params.map((p) => p.name)).toEqual(["userId"]);
  expect(detectFormatAndParse(swagger2Fixture).format).toBe("swagger2");
});

test("parseDiscovery walks nested resources and reads parameter map", () => {
  const ops = parseDiscovery(discoveryFixture);
  expect(ops.map((o) => o.operationId).sort()).toEqual(["svc.datasets.get", "svc.datasets.list", "svc.datasets.tables.cancel"]);
  const cancel = ops.find((o) => o.operationId === "svc.datasets.tables.cancel");
  expect(cancel.httpMethod).toBe("post");
  expect(cancel.hasBody).toBe(true);
  expect(detectFormatAndParse(discoveryFixture).format).toBe("discovery");
});

// --- end-to-end contract generation -----------------------------------------

test("generateContract emits endpoint-shaped, generic-engine-servable contracts", () => {
  const ops = parseOpenApi3(openapi3Fixture);
  const config = {
    systemId: "demo",
    displayName: "Demo",
    stateField: "state",
    collections: [
      {
        name: "widgets",
        primaryKey: "widget_id",
        stateEnum: ["open", "closed"],
        fields: { widget_id: "string", state: "enum:open|closed", page: "integer" },
        reads: { search: "widgets/list", get: "widgets/get" },
        write: {
          operationId: "widgets/update",
          allowedRoles: ["operator"],
          transitions: { "*": ["open", "closed"], open: ["closed"] },
        },
        seed: [{ widget_id: "W-1", state: "open", page: 1 }],
      },
    ],
  };
  const c = generateContract(config, ops);

  // Tool names follow generic-engine conventions.
  const toolNames = c.tools.tools.map((t) => t.name);
  expect(toolNames).toContain("search_widgets");
  expect(toolNames).toContain("get_widget");
  expect(toolNames).toContain("submit_widget_update");
  expect(toolNames).toContain("list_audit_events");

  // Endpoint params surface on the search tool (the spec's `state` filter).
  const search = c.tools.tools.find((t) => t.name === "search_widgets");
  expect(search.inputSchema.properties).toHaveProperty("state");
  expect(search.inputSchema.properties).toHaveProperty("query");
  expect(search.inputSchema.properties).toHaveProperty("limit");

  // submit tool carries the generic-engine control args + state field.
  const submit = c.tools.tools.find((t) => t.name === "submit_widget_update");
  for (const key of ["widget_id", "state", "note", "role", "idempotency_key"]) {
    expect(submit.inputSchema.properties).toHaveProperty(key);
  }
  expect(submit.inputSchema.required).toEqual(["widget_id"]);

  // Workflow handler wired with role gate + transitions.
  const wf = c.workflows.toolHandlers.submit_widget_update;
  expect(wf.collection).toBe("widgets");
  expect(wf.allowedRoles).toEqual(["operator"]);
  expect(wf.transitions.open).toEqual(["closed"]);

  // Schema/seed/projection/materialization all present + collection-consistent.
  expect(Object.keys(c.schema.collections)).toContain("widgets");
  expect(Object.keys(c.schema.collections)).toContain("audit_events");
  expect(c.seed.widgets[0].widget_id).toBe("W-1");
  expect(c.seed.audit_events).toEqual([]);
  expect(c.projection.collectionMappings.some((m) => m.simulatorCollection === "widgets")).toBe(true);
  expect(c.materialization.collections.widgets.primaryKey).toBe("widget_id");
});

test("singularize handles the engine's pluralization cases", () => {
  expect(singularize("widgets")).toBe("widget");
  expect(singularize("repositories")).toBe("repository");
  expect(singularize("services")).toBe("service");
  expect(singularize("policies")).toBe("policy");
});

// Determinism: generating twice yields byte-identical JSON.
test("generation is deterministic", () => {
  const ops = parseSwagger2(swagger2Fixture);
  const config = {
    systemId: "demo2",
    displayName: "Demo2",
    collections: [
      { name: "users", primaryKey: "user_id", fields: { user_id: "string", status: "string" }, reads: { search: "listUsers", get: "getUser" }, seed: [{ user_id: "U-1", status: "ACTIVE" }] },
    ],
  };
  const a = JSON.stringify(generateContract(config, ops));
  const b = JSON.stringify(generateContract(config, ops));
  expect(a).toBe(b);
});
