import { describe, expect, test } from "bun:test";
import { buildSimulatorProjections } from "./simulator-projections.mjs";

function simulator(id, family, collection = "records") {
  return {
    id,
    displayName: id,
    aliases: [id],
    family,
    schema: { collections: { [collection]: {} } },
    schemaExtension: { mode: "merge-records-by-primary-key" },
    projection: {
      collectionMappings: [
        {
          graphKinds: ["entity"],
          realizedObjects: [collection],
          simulatorCollection: collection,
        },
      ],
    },
  };
}

describe("buildSimulatorProjections", () => {
  test("pack bridges enrich selected source simulators without expanding unrelated systems", () => {
    const registry = {
      simulators: [
        simulator("sap_s4hana_fi", "finance-erp", "journal_entries"),
        simulator("workday", "hr-talent", "workers"),
      ],
    };
    const graph = {
      nodes: [
        { id: "sap-entity-1", kind: "entity", props: { sourceSystem: "SAP S/4HANA FI" } },
      ],
    };
    const projections = buildSimulatorProjections({
      graph,
      registry,
      sources: [{ system: "SAP S/4HANA FI" }],
      packBridges: [
        {
          packId: "benefits-pack",
          simulatorArchetypes: ["hr_talent"],
          simulatorCollections: ["workers"],
        },
      ],
    });

    expect(projections.map((projection) => projection.simulatorId)).toEqual(["sap_s4hana_fi"]);
    expect(projections[0].sourceSystems).toEqual(["SAP S/4HANA FI"]);
  });
});
