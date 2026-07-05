import { describe, expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  BYO_SCHEMA_VERSION,
  loadByoManifest,
  validateByoManifest,
  planByoApply,
  applyByoManifest,
} from "./byo-manifest.mjs";

const EXAMPLE_PATH = join(import.meta.dir, "..", "..", "ge.byo.example.yaml");

function tmpDir(prefix) {
  return mkdtempSync(join(tmpdir(), prefix));
}

describe("loadByoManifest", () => {
  test("the checked-in example manifest loads clean", () => {
    const { ok, problems, manifest, schemaVersion } = loadByoManifest(EXAMPLE_PATH);
    expect(problems).toEqual([]);
    expect(ok).toBe(true);
    expect(schemaVersion).toBe(BYO_SCHEMA_VERSION);
    expect(manifest.cloud.project).toBe("example-enterprise-prod");
  });

  test("throws (DxError) on a missing file, not a bad-manifest problem", () => {
    expect(() => loadByoManifest(join(tmpDir("ge-byo-missing-"), "nope.yaml"))).toThrow();
  });
});

describe("validateByoManifest", () => {
  test("rejects a missing schemaVersion with a path-precise problem", () => {
    const { ok, problems } = validateByoManifest({ cloud: { project: "x", region: "us-central1" } });
    expect(ok).toBe(false);
    expect(problems).toContainEqual({ path: "/schemaVersion", message: expect.stringContaining("missing") });
  });

  test("rejects a wrong schemaVersion", () => {
    const { ok, problems } = validateByoManifest({ schemaVersion: "ge.byo.v2" });
    expect(ok).toBe(false);
    expect(problems.some((p) => p.path === "/schemaVersion" && /unsupported/.test(p.message))).toBe(true);
  });

  test("rejects an unknown top-level key", () => {
    const { ok, problems } = validateByoManifest({ schemaVersion: BYO_SCHEMA_VERSION, bogus: true });
    expect(ok).toBe(false);
    expect(problems).toContainEqual({ path: "/bogus", message: "unknown top-level key" });
  });

  test("rejects an unknown key inside a known section, with a precise path", () => {
    const { ok, problems } = validateByoManifest({
      schemaVersion: BYO_SCHEMA_VERSION,
      cloud: { project: "x", region: "us-central1", zone: "us-central1-a" },
    });
    expect(ok).toBe(false);
    expect(problems).toContainEqual({ path: "/cloud/zone", message: "unknown key" });
  });

  test("rejects wrong-typed fields", () => {
    const { ok, problems } = validateByoManifest({
      schemaVersion: BYO_SCHEMA_VERSION,
      blueprints: { libraries: "not-an-array" },
      cloud: { project: 42 },
    });
    expect(ok).toBe(false);
    expect(problems).toContainEqual({ path: "/blueprints/libraries", message: "must be an array of strings" });
    expect(problems).toContainEqual({ path: "/cloud/project", message: "must be a string" });
  });

  test("rejects an unrecognized overlay backend", () => {
    const { ok, problems } = validateByoManifest({
      schemaVersion: BYO_SCHEMA_VERSION,
      systems: { overlays: { backend: "s3" } },
    });
    expect(ok).toBe(false);
    expect(problems.some((p) => p.path === "/systems/overlays/backend")).toBe(true);
  });

  test("a minimal valid manifest (schemaVersion only) has no problems", () => {
    const { ok, problems } = validateByoManifest({ schemaVersion: BYO_SCHEMA_VERSION });
    expect(ok).toBe(true);
    expect(problems).toEqual([]);
  });
});

// Fake deps for plan/apply tests — nothing here touches the real filesystem,
// the real .ge.json, or a real @ge/byo-systems import.
function fakeDeps(overrides = {}) {
  let config = { ...(overrides.initialConfig || {}) };
  const existing = new Set(overrides.existingPaths || []);
  return {
    exists: (p) => existing.has(p),
    readConfig: () => ({ ...config }),
    writeConfig: (next) => { config = { ...next }; },
    importEvalset: overrides.importEvalset || (async ({ evalset }) => ({ id: "imported", out: `.ge/behavioral/${evalset}`, cases: 1, turns: 1, source: evalset })),
    loadByoSystems: overrides.loadByoSystems || (async () => null),
    configFields: overrides.configFields || {},
    domainPacksRoot: "domain-packs",
    repoRoot: "/repo",
    // test-only escape hatch to read back what apply wrote
    _getConfig: () => config,
  };
}

describe("planByoApply", () => {
  test("classifies every section: appliable vs planned-only vs invalid", async () => {
    const manifest = {
      schemaVersion: BYO_SCHEMA_VERSION,
      blueprints: { libraries: ["okf/exists-with-index", "okf/missing"] },
      systems: {
        overlays: { backend: "firestore" },
        bindings: { crm: { kind: "rest" } },
      },
      fixtures: { packs: ["fixtures/present", "fixtures/missing"] },
      evals: { packs: ["evals/real.evalset.json", "evals/missing.evalset.json"], domainPacks: ["aml", "unknown-domain"] },
      models: { refinement: "model-a", judge: "model-b" },
      policies: { admission: { required: true }, promotion: { requireLiveProof: true } },
      code: { generatedAgentsRepo: "git@example.com:x/y.git" },
      cloud: { project: "acme", region: "us-central1" },
    };
    const deps = fakeDeps({
      existingPaths: [
        "okf/exists-with-index",
        join("okf/exists-with-index", "index.md"),
        "fixtures/present",
        "evals/real.evalset.json",
        join("domain-packs", "aml", "pack.json"),
      ],
      configFields: {}, // no refinementModel/judgeModel yet -> planned-only
      loadByoSystems: async () => null, // no bindings support yet -> planned-only
    });

    const actions = await planByoApply({ manifest, cfg: {}, deps });
    const byKindTarget = Object.fromEntries(actions.map((a) => [`${a.kind}:${a.target}`, a]));

    expect(byKindTarget["blueprints.libraries:okf/exists-with-index"].status).toBe("planned-only");
    expect(byKindTarget["blueprints.libraries:okf/missing"].status).toBe("planned-only");
    expect(byKindTarget["blueprints.libraries:okf/missing"].detail).toMatch(/does not exist/);

    expect(byKindTarget["systems.overlays.backend:simulatorOverlayBackend"].status).toBe("appliable");
    expect(byKindTarget["systems.bindings:crm"].status).toBe("planned-only");

    expect(byKindTarget["fixtures.packs:fixtures/present"].status).toBe("planned-only");
    expect(byKindTarget["fixtures.packs:fixtures/missing"].status).toBe("planned-only");

    expect(byKindTarget["evals.packs:evals/real.evalset.json"].status).toBe("appliable");
    expect(byKindTarget["evals.packs:evals/missing.evalset.json"].status).toBe("invalid");

    expect(byKindTarget["evals.domainPacks:aml"].status).toBe("planned-only");
    expect(byKindTarget["evals.domainPacks:aml"].detail).toMatch(/readable/);
    expect(byKindTarget["evals.domainPacks:unknown-domain"].detail).toMatch(/no pack.json/);

    expect(byKindTarget["models.refinement:refinementModel"].status).toBe("planned-only");
    expect(byKindTarget["models.judge:judgeModel"].status).toBe("planned-only");

    expect(byKindTarget["policies.admission:promotion.gates.admission"].status).toBe("appliable");
    expect(byKindTarget["policies.promotion:promotion.gates.promotion"].status).toBe("appliable");

    expect(byKindTarget["code.generatedAgentsRepo:agentsRepo"].status).toBe("appliable");
    expect(byKindTarget["cloud.project:project"].status).toBe("appliable");
    expect(byKindTarget["cloud.region:region"].status).toBe("appliable");
  });

  test("models.refinement/judge and systems.bindings become appliable once the deps support them", async () => {
    const manifest = {
      schemaVersion: BYO_SCHEMA_VERSION,
      systems: { bindings: { crm: { kind: "rest" } } },
      models: { refinement: "model-a" },
    };
    const deps = fakeDeps({
      configFields: { refinementModel: { flag: "refinementModel" } },
      loadByoSystems: async () => ({ writeBinding: () => {}, validateBinding: () => {} }),
    });
    const actions = await planByoApply({ manifest, cfg: {}, deps });
    expect(actions.find((a) => a.kind === "models.refinement").status).toBe("appliable");
    expect(actions.find((a) => a.kind === "systems.bindings").status).toBe("appliable");
  });

  test("an unrecognized overlay backend plans as invalid", async () => {
    const manifest = { schemaVersion: BYO_SCHEMA_VERSION, systems: { overlays: { backend: "s3" } } };
    const actions = await planByoApply({ manifest, cfg: {}, deps: fakeDeps() });
    expect(actions.find((a) => a.kind === "systems.overlays.backend").status).toBe("invalid");
  });
});

describe("applyByoManifest", () => {
  test("executes only appliable actions and reports all three buckets", async () => {
    const manifest = {
      schemaVersion: BYO_SCHEMA_VERSION,
      blueprints: { libraries: ["okf/missing"] },
      systems: { overlays: { backend: "firestore" }, bindings: { crm: { kind: "rest" } } },
      evals: { packs: ["evals/real.evalset.json", "evals/missing.evalset.json"] },
      cloud: { project: "acme" },
    };
    const deps = fakeDeps({
      existingPaths: ["evals/real.evalset.json"],
      loadByoSystems: async () => null, // still unsupported -> planned-only
    });

    const { applied, planned, invalid } = await applyByoManifest({ manifest, cfg: {}, deps });

    // appliable + executed: overlay backend, the real evalset import, cloud.project
    expect(applied.length).toBe(3);
    expect(applied.every((a) => a.ok === true)).toBe(true);
    expect(deps._getConfig().simulatorOverlayBackend).toBe("firestore");
    expect(deps._getConfig().project).toBe("acme");

    // planned-only: the blueprint library (informational) + the binding (unsupported)
    expect(planned.map((p) => p.kind).sort()).toEqual(["blueprints.libraries", "systems.bindings"]);

    // invalid: the missing evalset file
    expect(invalid.length).toBe(1);
    expect(invalid[0].kind).toBe("evals.packs");
  });

  test("a failing appliable action surfaces as ok:false, not a thrown error", async () => {
    const manifest = { schemaVersion: BYO_SCHEMA_VERSION, cloud: { project: "acme" } };
    const deps = fakeDeps({
      initialConfig: {},
    });
    deps.writeConfig = () => { throw new Error("disk full"); };
    const { applied } = await applyByoManifest({ manifest, cfg: {}, deps });
    expect(applied.length).toBe(1);
    expect(applied[0].ok).toBe(false);
    expect(applied[0].error).toMatch(/disk full/);
  });

  test("dry-run reports the plan but executes nothing", async () => {
    const manifest = {
      schemaVersion: BYO_SCHEMA_VERSION,
      systems: { overlays: { backend: "firestore" } },
      cloud: { project: "acme", region: "us-central1" },
    };
    const deps = fakeDeps();
    let writeCalled = false;
    const realWrite = deps.writeConfig;
    deps.writeConfig = (next) => { writeCalled = true; return realWrite(next); };

    const { applied, planned, invalid } = await applyByoManifest({ manifest, cfg: {}, deps, dryRun: true });

    expect(writeCalled).toBe(false);
    expect(invalid).toEqual([]);
    expect(planned).toEqual([]);
    expect(applied.length).toBe(3);
    for (const a of applied) {
      expect(a.dryRun).toBe(true);
      expect(a.ok).toBeNull();
    }
    expect(deps._getConfig().simulatorOverlayBackend).toBeUndefined();
  });
});
