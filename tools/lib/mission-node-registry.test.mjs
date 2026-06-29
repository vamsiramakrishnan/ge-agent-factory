import { describe, expect, test } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { snakeCase } from "@ge/std/naming";
import { verifyMissionArtifacts } from "./mission-artifacts.mjs";
import { dataMissionNodes } from "./mission-nodes.mjs";
import { buildMissionNode, isDataMissionNodeKind, listMissionNodeDefinitions, missionNodeCommand, missionNodeDefinition, registerMissionNodeDefinition, safeMissionNodeCommand, validateMissionNodeArtifacts } from "./mission-node-registry.mjs";

function tmpDir(name) {
  const dir = join("/tmp", `ge-mission-node-registry-${process.pid}-${name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}

describe("mission node registry", () => {
  test("recognizes typed data node kinds", () => {
    expect(isDataMissionNodeKind("mock.generate")).toBe(true);
    expect(isDataMissionNodeKind("simulator.validate")).toBe(true);
    expect(isDataMissionNodeKind("process.command")).toBe(false);
    expect(missionNodeDefinition("snowfakery.generate").runtimeKind).toBe("snowfakery.generate");
  });

  test("registered data node definitions expose complete registry contract", () => {
    const definitions = listMissionNodeDefinitions();
    expect(definitions.map((definition) => definition.kind)).toEqual([
      "mock.generate",
      "snowfakery.generate",
      "simulator.seed",
      "simulator.validate",
    ]);
    for (const definition of definitions) {
      expect(definition.kind).toBeTruthy();
      expect(definition.runtimeKind).toBeTruthy();
      expect(definition.label).toBeTruthy();
      expect(typeof definition.buildInput).toBe("function");
      expect(typeof definition.artifacts).toBe("function");
      expect(typeof definition.dependsOn).toBe("function");
      expect(typeof definition.safeToRun).toBe("function");
      expect(typeof definition.validateArtifacts).toBe("function");
      expect(typeof definition.presentation).toBe("function");
    }
  });

  test("registerMissionNodeDefinition rejects incomplete definitions", () => {
    expect(() => registerMissionNodeDefinition({ kind: "custom.node" })).toThrow(/missing runtimeKind/);
  });

  test("buildMissionNode preserves data node dependency order and output shape", () => {
    const context = { missionId: "mission-x", scenario: "benefits", workspace: ".ge/missions/benefits", systems: ["workday"] };
    const mock = buildMissionNode("mock.generate", context);
    const snowfakery = buildMissionNode("snowfakery.generate", context);
    const seed = buildMissionNode("simulator.seed", context);
    const validate = buildMissionNode("simulator.validate", context);

    expect([mock.id, snowfakery.id, seed.id, validate.id]).toEqual([
      "mock.generate",
      "snowfakery.generate",
      "simulator.seed",
      "simulator.validate",
    ]);
    expect(mock).toMatchObject({
      missionId: "mission-x",
      kind: "mock.generate",
      label: "Generate Scenario Data Plan",
      status: "pending",
      runtimeKind: "mock.generate",
      dependsOn: ["preflight.doctor"],
      blockers: [],
    });
    expect([
      mock.dependsOn,
      snowfakery.dependsOn,
      seed.dependsOn,
      validate.dependsOn,
    ]).toEqual([
      ["preflight.doctor"],
      ["mock.generate"],
      ["snowfakery.generate"],
      ["simulator.seed"],
    ]);
    expect(mock.input.argv).toEqual([
      "node",
      "apps/factory/scripts/plan-mock-data.mjs",
      "--dir",
      ".ge/missions/benefits",
      "--usecase",
      "benefits",
      "--sourceMap",
      "apps/factory/src/use-case-source-map.generated.json",
    ]);
    expect(snowfakery.input.argv).toEqual([
      "uv",
      "run",
      "--with",
      "snowfakery",
      "--with",
      "setuptools<81",
      "snowfakery",
      ".ge/missions/benefits/mock_data/snowfakery/structured.recipe.yml",
      "--output-format",
      "csv",
      "--output-folder",
      ".ge/missions/benefits/mock_data/snowfakery/output",
    ]);
    expect(seed.input.argv).toEqual([
      "node",
      "apps/factory/scripts/materialize-simulator-seeds.mjs",
      "--dir",
      ".ge/missions/benefits",
    ]);
    expect(validate.input.argv).toEqual([
      "node",
      "apps/factory/scripts/validate-simulator-pack.mjs",
      "--check",
      "true",
      "--system",
      "workday",
    ]);
    expect(mock.artifacts.map((artifact) => artifact.name)).toContain("data_plan");
    expect(snowfakery.artifacts.map((artifact) => artifact.name)).toContain("snowfakery_output");
    expect(seed.artifacts.map((artifact) => artifact.name)).toContain("simulator_seed_report");
    expect(validate.artifacts.map((artifact) => artifact.name)).toContain("simulator_conformance_report");
  });

  test("classifies safe node commands by kind contract", () => {
    expect(safeMissionNodeCommand("mock.generate", { workspace: "x", scenario: "benefits", argv: ["node", "apps/factory/scripts/plan-mock-data.mjs", "--dir", "x", "--usecase", "benefits"] })).toBe(true);
    expect(safeMissionNodeCommand("mock.generate", { workspace: "x", spec: ".ge/interviews/new/agent-spec.json", argv: ["node", "apps/factory/scripts/plan-mock-data.mjs", "--dir", "x", "--spec", ".ge/interviews/new/agent-spec.json"] })).toBe(true);
    expect(safeMissionNodeCommand("simulator.seed", { workspace: "x", argv: [process.execPath, "/repo/apps/factory/scripts/materialize-simulator-seeds.mjs", "--dir", "x"] })).toBe(true);
    expect(safeMissionNodeCommand("snowfakery.generate", { workspace: ".ge/missions/benefits", argv: ["uv", "run", "--with", "snowfakery", "--with", "setuptools<81", "snowfakery", ".ge/missions/benefits/mock_data/snowfakery/structured.recipe.yml", "--output-format", "csv", "--output-folder", ".ge/missions/benefits/mock_data/snowfakery/output"] })).toBe(true);
    expect(safeMissionNodeCommand("simulator.validate", { systems: ["workday"], argv: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--check", "true", "--system", "workday"] })).toBe(true);
    expect(safeMissionNodeCommand("mock.generate", { workspace: "x", argv: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--dir", "x"] })).toBe(false);
    expect(safeMissionNodeCommand("mock.generate", { workspace: "x", argv: ["node", "apps/factory/scripts/plan-mock-data.mjs", "--dir", "y"] })).toBe(false);
    expect(safeMissionNodeCommand("mock.generate", { workspace: "x", spec: ".ge/interviews/new/agent-spec.json", argv: ["node", "apps/factory/scripts/plan-mock-data.mjs", "--dir", "x", "--spec", ".ge/interviews/other/agent-spec.json"] })).toBe(false);
    expect(safeMissionNodeCommand("snowfakery.generate", { workspace: ".ge/missions/benefits", argv: ["uv", "run", "--with", "snowfakery", "--with", "setuptools<81", "snowfakery", ".ge/missions/benefits/mock_data/snowfakery/structured.recipe.yml", "--output-folder", ".ge/missions/benefits/mock_data/snowfakery/output"] })).toBe(false);
    expect(safeMissionNodeCommand("snowfakery.generate", { workspace: ".ge/missions/benefits", argv: ["uv", "run", "--with", "snowfakery", "--with", "setuptools<81", "snowfakery", ".ge/missions/benefits/mock_data/snowfakery/structured.recipe.yml", "--output-format", "json", "--output-folder", ".ge/missions/benefits/mock_data/snowfakery/output"] })).toBe(false);
    expect(safeMissionNodeCommand("simulator.validate", { systems: ["workday"], argv: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--system", "workday"] })).toBe(false);
    expect(safeMissionNodeCommand("simulator.validate", { systems: ["workday"], argv: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--check", "false", "--system", "workday"] })).toBe(false);
    expect(safeMissionNodeCommand("simulator.validate", { systems: ["workday"], argv: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--check", "true", "--system", "sap_successfactors"] })).toBe(false);
  });

  test("registry-built data nodes match existing dataMissionNodes output", () => {
    const context = { missionId: "mission-x", scenario: "benefits", workspace: ".ge/missions/benefits", systems: ["workday"] };
    const existing = dataMissionNodes(context);
    const fromRegistry = [
      buildMissionNode("mock.generate", context),
      buildMissionNode("snowfakery.generate", context),
      buildMissionNode("simulator.seed", context),
      buildMissionNode("simulator.validate", context),
    ];

    expect(fromRegistry.map((node) => node.id)).toEqual(existing.map((node) => node.id));
    expect(fromRegistry.map((node) => node.dependsOn)).toEqual(existing.map((node) => node.dependsOn));
    expect(fromRegistry.map((node) => node.input.argv)).toEqual(existing.map((node) => node.input.argv));
    expect(fromRegistry.map((node) => node.artifacts)).toEqual(existing.map((node) => node.artifacts));
  });

  test("builds executable command details", () => {
    const command = missionNodeCommand("simulator.validate", { argv: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--check", "true"] });

    expect(command.kind).toBe("simulator.validate");
    expect(command.stage).toBe("simulator.validate");
    expect(command.prefix).toBe("simval");
    expect(command.cmd).toBe(process.execPath);
    expect(command.args[0]).toBe("apps/factory/scripts/validate-simulator-pack.mjs");
  });

  test("mock.generate semantic validation catches empty plans and missing requested simulator", () => {
    const root = tmpDir("mock-semantic");
    writeFileSync(join(root, "data-plan.json"), JSON.stringify({ sources: [], datastores: [] }), "utf8");
    writeFileSync(join(root, "scenario-graph.json"), JSON.stringify({ nodes: [], edges: [] }), "utf8");
    writeFileSync(join(root, "realization-plan.json"), JSON.stringify({ objects: [] }), "utf8");
    writeFileSync(join(root, "index.json"), JSON.stringify({ simulators: [{ simulatorId: "servicenow" }] }), "utf8");
    const artifactCheck = verifyMissionArtifacts([
      { name: "data_plan", type: "json", path: "data-plan.json" },
      { name: "scenario_graph", type: "json", path: "scenario-graph.json" },
      { name: "snowfakery_realization_plan", type: "json", path: "realization-plan.json" },
      { name: "simulator_index", type: "json", path: "index.json" },
    ], { repoRoot: root });

    const result = validateMissionNodeArtifacts("mock.generate", { input: { systems: ["workday"] }, artifactCheck });

    expect(result.ok).toBe(false);
    expect(result.blockers.map((blocker) => blocker.id)).toContain("mock-data-plan-empty-sources");
    expect(result.blockers.map((blocker) => blocker.id)).toContain("scenario-graph-empty");
    expect(result.blockers.map((blocker) => blocker.id)).toContain("snowfakery-realization-empty");
    expect(result.blockers.map((blocker) => blocker.id)).toContain("simulator-index-missing-system");
  });

  test("snowfakery.generate semantic validation checks row and object coverage", () => {
    const root = tmpDir("snow-semantic");
    mkdirSync(join(root, "output"));
    writeFileSync(join(root, "output", "Employee.csv"), "id,name\n1,Ada\n", "utf8");
    writeFileSync(join(root, "realization-plan.json"), JSON.stringify({ objects: [{ object: "Employee" }, { object: "LifeEvent" }] }), "utf8");
    const artifactCheck = verifyMissionArtifacts([
      { name: "snowfakery_output", type: "dir", path: "output" },
      { name: "snowfakery_realization_plan", type: "json", path: "realization-plan.json" },
    ], { repoRoot: root });

    const result = validateMissionNodeArtifacts("snowfakery.generate", { artifactCheck });

    expect(result.ok).toBe(false);
    expect(result.blockers.map((blocker) => blocker.id)).toContain("snowfakery-output-missing-object");
    expect(result.warnings.map((warning) => warning.id)).toContain("snowfakery-output-fewer-files-than-objects");
  });

  test("simulator.seed semantic validation checks requested systems and collections", () => {
    const root = tmpDir("seed-semantic");
    writeFileSync(join(root, "report.json"), JSON.stringify({
      ok: true,
      simulators: [
        { simulatorId: "workday", collections: { workers: 0 }, inputs: [{ object: "Employee", rows: 0 }] },
      ],
    }), "utf8");
    const artifactCheck = verifyMissionArtifacts([
      { name: "simulator_seed_report", type: "json", path: "report.json" },
    ], { repoRoot: root });

    const result = validateMissionNodeArtifacts("simulator.seed", { input: { systems: ["workday", "sap_successfactors"] }, artifactCheck });

    expect(result.ok).toBe(false);
    expect(result.blockers.map((blocker) => blocker.id)).toContain("simulator-seed-zero-rows");
    expect(result.blockers.map((blocker) => blocker.id)).toContain("simulator-seed-missing-system");
    expect(result.warnings.map((warning) => warning.id)).toContain("simulator-seed-zero-input-rows");
  });

  test("simulator.validate semantic validation maps errors to blockers and warnings to warnings", () => {
    const result = validateMissionNodeArtifacts("simulator.validate", {
      input: { systems: ["workday", "sap_successfactors"] },
      summary: {
        ok: false,
        simulators: [
          { id: "workday", ok: false, errors: ["schema missing workers"], warnings: ["weak semantic field"] },
        ],
      },
    });

    expect(result.ok).toBe(false);
    expect(result.blockers.map((blocker) => blocker.id)).toContain("simulator-validation-error");
    expect(result.blockers.map((blocker) => blocker.id)).toContain("simulator-validation-missing-system");
    expect(result.blockers.map((blocker) => blocker.id)).toContain("simulator-validation-not-ok");
    expect(result.warnings.map((warning) => warning.id)).toContain("simulator-validation-warning");
  });

  test("simulator.validate semantic validation canonicalizes simulator ids and ignores model runtimes", () => {
    const result = validateMissionNodeArtifacts("simulator.validate", {
      input: { systems: ["sap_s_4hana_fi", "blackline", "bigquery", "vertex_ai"] },
      summary: {
        ok: true,
        simulators: [
          { id: "sap_s4hana_fi", ok: true, errors: [], warnings: [] },
          { id: "blackline", ok: true, errors: [], warnings: [] },
          { id: "bigquery", ok: true, errors: [], warnings: [] },
        ],
      },
    });

    expect(result.ok).toBe(true);
    expect(result.blockers).toEqual([]);
  });
});

// Divergence probe (Wave 1f): mission-node-registry's snakeCase moved from a local
// regex (_$1-per-capital) to @ge/std/naming's change-case canonical. The snowfakery
// validator matches CSV filenames against realization object names via
// snakeCase(name).replace(/s$/, ""). Both operands run through the same fn, but two
// raw names could in principle collapse to the same key under change-case yet stay
// distinct under the old regex — changing a match. This asserts the MATCH OUTCOMES
// are identical between the two implementations for representative + adversarial
// inputs, so the swap is behaviour-preserving for the matching this module performs.
describe("snakeCase swap (mission-node-registry 1f) preserves csv<->object matching", () => {
  const stdSnake = snakeCase; // @ge/std/naming change-case canonical (imported below)
  const localSnake = (value) =>
    String(value || "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_+|_+$/g, "")
      .replace(/_+/g, "_");

  // Mirror validateSnowfakeryGenerate's matching for a given snakeCase impl.
  const matchOutcomes = (snake, csvFileNames, objectNames) => {
    const csvObjects = new Set(
      csvFileNames.map((name) => snake(name.replace(/\.[^.]+$/, "")).replace(/s$/, "")),
    );
    return objectNames.map((object) => csvObjects.has(snake(object).replace(/s$/, "")));
  };

  test("identical match outcomes for realistic + adversarial object/file names", () => {
    const csvFileNames = [
      "workers.csv", "job_requisitions.csv", "worker_events.csv", "supervisory_orgs.csv",
      "approvals.csv", "HRData.csv", "Workday2.csv", "POBox.csv", "ServiceNowTickets.csv",
    ];
    const objectNames = [
      "worker", "job_requisition", "worker_event", "supervisory_org", "approval",
      "HRData", "Workday2", "POBox", "ServiceNowTicket", "missing_object",
    ];
    expect(matchOutcomes(stdSnake, csvFileNames, objectNames))
      .toEqual(matchOutcomes(localSnake, csvFileNames, objectNames));
  });
});
