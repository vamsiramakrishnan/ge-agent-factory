import { singularOf } from "./naming.mjs";
import { fieldSchema, lifecycleDefaults, lifecycleField, sampleValueFor } from "./fields.mjs";

export function schemaFor(id, archetype) {
  return {
    id: `${id}_schema`,
    version: 1,
    collections: Object.fromEntries(Object.entries(archetype.collections).map(([collection, fields]) => [
      collection,
      {
        primaryKey: fields[0],
        fields: Object.fromEntries(fields.map((field) => [field, fieldSchema(field)])),
      },
    ])),
  };
}

export function toolsFor(id, archetype) {
  const collections = Object.keys(archetype.collections);
  const primary = collections[0];
  const primaryKey = archetype.collections[primary][0];
  const singular = singularOf(primary);
  const stateField = lifecycleField(archetype.collections[primary]);
  const tools = [
    {
      name: `search_${primary}`,
      description: `Search ${primary} in ${id}.`,
      inputSchema: { type: "object", properties: { query: { type: "string" }, status: { type: "string" }, limit: { type: "integer" } } },
    },
    {
      name: `get_${singular}`,
      description: `Get one ${singular} in ${id}.`,
      inputSchema: { type: "object", properties: { [primaryKey]: { type: "string" } }, required: [primaryKey] },
    },
    {
      name: `submit_${singular}_update`,
      description: `Submit an update to one ${singular} in ${id}.`,
      inputSchema: {
        type: "object",
        properties: {
          [primaryKey]: { type: "string" },
          [stateField]: { type: "string" },
          note: { type: "string" },
          role: { type: "string" },
        },
        required: [primaryKey],
      },
    },
    {
      name: "list_audit_events",
      description: `List ${id} simulator audit events.`,
      inputSchema: { type: "object", properties: { limit: { type: "integer" } } },
    },
  ];
  if (collections.includes("approvals")) {
    tools.splice(2, 0, {
      name: "list_pending_approvals",
      description: `List pending ${id} approvals.`,
      inputSchema: { type: "object", properties: { source_record_id: { type: "string" } } },
    });
  }
  return { id: `${id}_tools`, version: 1, tools };
}

export function workflowsFor(id, archetype) {
  const collections = Object.keys(archetype.collections);
  const primary = collections[0];
  const primaryFields = archetype.collections[primary];
  const primaryKey = primaryFields[0];
  const singular = singularOf(primary);
  const stateField = lifecycleField(primaryFields);
  const handler = {
    primitive: "state_machine_update",
    collection: primary,
    primaryKey,
    roleArg: "role",
    allowedRoles: archetype.roles,
    stateField,
    targetStateArg: stateField,
    noteArg: "note",
    transitions: {
      "*": ["active", "pending_approval", "inactive", "cancelled", "closed", "approved", "rejected"],
      active: ["pending_approval", "inactive", "cancelled", "closed"],
      pending_approval: ["active", "approved", "rejected", "cancelled"],
      approved: ["closed", "inactive"],
    },
  };
  if (collections.includes("approvals")) {
    handler.approvalBlockers = [
      {
        collection: "approvals",
        sourceRecordField: "source_record_id",
        states: ["requested", "pending", "pending_approval"],
        blockedTargetStates: ["closed", "inactive", "cancelled"],
      },
    ];
  }
  return {
    id: `${id}_workflows`,
    version: 1,
    primitives: [
      "role_permission_gate",
      "state_machine",
      "approval_blocker",
      "audit_trail",
    ],
    toolHandlers: {
      [`submit_${singular}_update`]: handler,
    },
  };
}

export function projectionFor(id, archetype) {
  return {
    id: `${id}_projection`,
    version: 1,
    materialization: `Project scenario graph concepts into ${id} collections; Snowfakery realizes large row sets from the same graph.`,
    collectionMappings: archetype.projection.map(([graphKind, realizedObjects, collection]) => ({
      graphKinds: [graphKind],
      realizedObjects,
      simulatorCollection: collection,
      mergeMode: "merge-records-by-primary-key",
    })),
  };
}

export function materializationFor(id, archetype) {
  return {
    id: `${id}_materialization`,
    version: 1,
    collections: Object.fromEntries(Object.entries(archetype.collections).map(([collection, fields]) => [
      collection,
      {
        primaryKey: fields[0],
        fieldAliases: Object.fromEntries(fields.map((field) => [field, [field, "id", "source_record_id"].filter((item, idx, arr) => arr.indexOf(item) === idx)])),
        defaults: lifecycleDefaults(fields),
      },
    ])),
  };
}

export function seedFor(archetype) {
  return Object.fromEntries(Object.entries(archetype.collections).map(([collection, fields]) => [
    collection,
    collection === "audit_events" ? [] : [
      Object.fromEntries(fields.map((field) => [field, sampleValueFor(field, collection)])),
    ],
  ]));
}
