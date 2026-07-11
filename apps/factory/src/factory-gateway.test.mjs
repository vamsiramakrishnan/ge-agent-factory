import { describe, expect, it, mock, spyOn } from "bun:test";
import { buildStatelessScaffoldArgs, buildWorkspaceCacheKey, defaultFactoryStartStage, FACTORY_GATEWAY_STAGES, firestoreValue, parseGsUri, humanize, deriveToolDescription, summarizeFactoryRunSnapshot } from "./factory-gateway.js";
import { FACTORY_STAGE_IDS } from "./factory-orchestration.js";

describe("Factory API Bridge Core Helpers", () => {
  it("parses GCS URIs correctly", () => {
    const parsed = parseGsUri("gs://my-bucket/path/to/some/object.tar.gz");
    expect(parsed.bucket).toBe("my-bucket");
    expect(parsed.object).toBe("path/to/some/object.tar.gz");
  });

  it("throws exception on invalid GCS URI", () => {
    expect(() => parseGsUri("https://storage.googleapis.com/object")).toThrow();
  });

  it("serializes Firestore REST API fields accurately", () => {
    expect(firestoreValue(null)).toEqual({ nullValue: null });
    expect(firestoreValue(true)).toEqual({ booleanValue: true });
    expect(firestoreValue(123)).toEqual({ integerValue: "123" });
    expect(firestoreValue(12.34)).toEqual({ doubleValue: 12.34 });
    expect(firestoreValue("hello")).toEqual({ stringValue: "hello" });
    expect(firestoreValue(["a", "b"])).toEqual({
      arrayValue: { values: [{ stringValue: "a" }, { stringValue: "b" }] }
    });
    expect(firestoreValue({ name: "john" })).toEqual({
      mapValue: { fields: { name: { stringValue: "john" } } }
    });
  });

  it("starts generated remote factory runs at package_data", () => {
    expect(defaultFactoryStartStage({ refine: true })).toBe("package_data");
    expect(defaultFactoryStartStage({ refine: false })).toBe("package_data");
    expect(defaultFactoryStartStage({ prebuiltArchive: "gs://bucket/workspace.tar.gz", refine: true })).toBe("load_data");
  });

  it("uses the worker's canonical stage registry for gateway status", () => {
    expect(FACTORY_GATEWAY_STAGES).toBe(FACTORY_STAGE_IDS);
    expect(FACTORY_GATEWAY_STAGES).toContain("package_data");
  });

  it("scaffolds deterministically in the gateway and leaves harness refine to workers", () => {
    const args = buildStatelessScaffoldArgs({
      generatorScript: "/app/apps/factory/scripts/factory.mjs",
      tempDir: "/tmp/run-1",
      request: { useCaseId: "account-opening-doc-followup-agent" },
      title: "Account Opening Document Follow-Up Agent",
      systems: "Temenos Transact,BigQuery",
      rows: 30,
      domain: "banking",
    });
    expect(args).toContain("--harness-review");
    expect(args).toContain("--harness-refine");
    expect(args.slice(args.indexOf("--harness-review"), args.indexOf("--harness-review") + 2)).toEqual(["--harness-review", "false"]);
    expect(args.slice(args.indexOf("--harness-refine"), args.indexOf("--harness-refine") + 2)).toEqual(["--harness-refine", "false"]);
  });

  it("summarizes durable stage artifacts at the gateway status boundary", () => {
    expect(summarizeFactoryRunSnapshot(
      { status: "submitted", targetStage: "publish_enterprise", startStage: "harness_refine" },
      { harness_refine: { status: "done", nextStage: "validate" } },
    )).toMatchObject({ status: "running", currentStage: "validate", terminal: false });

    expect(summarizeFactoryRunSnapshot(
      { status: "submitted", targetStage: "publish_enterprise" },
      {
        validate: {
          status: "failed",
          error: "bad substitution",
          classification: "cloud_build_config",
          firstError: "substitution too large",
          fixHint: "shorten substitutions",
          logUrl: "https://logs.example",
          stageResultUri: "gs://bucket/runs/run-1/items/ws/factory-validate-result.json",
        },
      },
    )).toMatchObject({
      status: "failed",
      currentStage: "validate",
      terminal: true,
      error: "bad substitution",
      classification: "cloud_build_config",
      firstError: "substitution too large",
      fixHint: "shorten substitutions",
      logUrl: "https://logs.example",
      stageResultUri: "gs://bucket/runs/run-1/items/ws/factory-validate-result.json",
    });
  });

  it("builds deterministic revision-scoped workspace cache keys", () => {
    const input = {
      title: "Agent",
      useCaseId: "agent",
      rows: "48",
      systems: ["A", "B"],
      domain: "finance",
      generationSpec: { b: 2, a: 1 },
      model: "gemini-3.5-flash",
      judgeModel: "gemini-3.5-flash",
      evalJudgeSamples: "5",
    };
    const env = { K_REVISION: "rev-1" };
    expect(buildWorkspaceCacheKey(input, env)).toBe(buildWorkspaceCacheKey({ ...input, generationSpec: { a: 1, b: 2 } }, env));
    expect(buildWorkspaceCacheKey(input, env)).not.toBe(buildWorkspaceCacheKey(input, { K_REVISION: "rev-2" }));
    expect(buildWorkspaceCacheKey(input, env)).not.toBe(buildWorkspaceCacheKey({ ...input, evalJudgeSamples: "1" }, env));
  });
});

describe("Factory Bridge — consume prebuilt archive + console generationSpec", () => {
  // The console-authored consume path: when a client ships a prebuilt workspace
  // archive, the bridge must NOT rescaffold — it starts past the build boundary at
  // load_data and consumes the archive as-is, regardless of the refine flag.
  it("defaults a prebuilt-archive run to load_data even when refine is enabled", () => {
    expect(defaultFactoryStartStage({ prebuiltArchive: "gs://bucket/runs/r1/workspace.tar.gz", refine: true })).toBe("load_data");
  });

  it("defaults a prebuilt-archive run to load_data when refine is disabled", () => {
    expect(defaultFactoryStartStage({ prebuiltArchive: "gs://bucket/runs/r1/workspace.tar.gz", refine: false })).toBe("load_data");
  });

  it("packages generated builds before optional refine and validation", () => {
    // The worker's package_data stage advances through harness_refine; refine=false
    // makes that stage a no-op without skipping the data-package contract.
    expect(defaultFactoryStartStage({ prebuiltArchive: null, refine: true })).toBe("package_data");
    expect(defaultFactoryStartStage({ prebuiltArchive: null, refine: false })).toBe("package_data");
  });

  it("parses the prebuilt archive GCS URI into bucket + object for consumption", () => {
    // submitFactoryRun consumes `prebuiltArchive` as the workspaceArchive verbatim;
    // downstream stages parse it with parseGsUri. Verify a realistic console URI parses.
    const archive = "gs://acme-ge-agent-factory/runs/run-abc123-0042/items/gl-anomaly-detector/workspace.tar.gz";
    const parsed = parseGsUri(archive);
    expect(parsed.bucket).toBe("acme-ge-agent-factory");
    expect(parsed.object).toBe("runs/run-abc123-0042/items/gl-anomaly-detector/workspace.tar.gz");
  });

  it("humanizes a machine id fallback into a user-facing Title Case display name", () => {
    // Fix 2: when only a useCaseId is passed, the GE display name must read like a
    // label ("Account Reconciliation Agent"), not the raw machine id.
    expect(humanize("account_reconciliation_agent")).toBe("Account Reconciliation Agent");
    expect(humanize("gl-anomaly-detector")).toBe("Gl Anomaly Detector");
    expect(humanize("Already Nice")).toBe("Already Nice");
    expect(humanize("")).toBe("");
  });

  it("never describes a non-hr agent as 'hr' (no silent domain default)", () => {
    // Fix 1: a finance run with no spec.description and no explicit domain must NOT
    // fall back to an 'hr' description. With a finance domain it reads finance; with
    // no domain at all it stays domain-neutral (capability/title driven).
    const finance = deriveToolDescription({ domain: "finance", systems: "SAP,Oracle", useCaseId: "account_reconciliation_agent" });
    expect(finance).toBe("Use this agent for finance workflows across SAP,Oracle.");
    expect(finance).not.toContain("hr");

    const neutral = deriveToolDescription({ domain: "", useCaseId: "account_reconciliation_agent" });
    expect(neutral).toBe("Use this agent for Account Reconciliation Agent tasks.");
    expect(neutral).not.toMatch(/\bhr\b/);
  });

  it("prefers an explicit spec description, else derives domain from the spec", () => {
    expect(deriveToolDescription({ generationSpec: { description: "Reconciles GL accounts." } }))
      .toBe("Reconciles GL accounts.");
    expect(deriveToolDescription({ generationSpec: { domain: "finance", systems: [{ name: "SAP" }, { id: "oracle" }] } }))
      .toBe("Use this agent for finance workflows across SAP,oracle.");
  });

  it("serializes a console generationSpec map for the Firestore run record", () => {
    // The bridge persists the inbound console generationSpec on the run record; it
    // must round-trip through the Firestore REST value encoder without loss of shape.
    const generationSpec = {
      version: 1,
      entities: [{ name: "gl_entries", rowCount: 60 }],
      sourceSystems: [{ id: "sap", name: "SAP" }],
    };
    const encoded = firestoreValue(generationSpec);
    expect(encoded.mapValue.fields.version).toEqual({ integerValue: "1" });
    expect(encoded.mapValue.fields.entities.arrayValue.values[0].mapValue.fields.name).toEqual({ stringValue: "gl_entries" });
    expect(encoded.mapValue.fields.entities.arrayValue.values[0].mapValue.fields.rowCount).toEqual({ integerValue: "60" });
    expect(encoded.mapValue.fields.sourceSystems.arrayValue.values[0].mapValue.fields.id).toEqual({ stringValue: "sap" });
  });
});
