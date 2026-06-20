import { describe, expect, it, mock, spyOn } from "bun:test";
import { defaultFactoryStartStage, firestoreValue, parseGsUri } from "./factory-bridge.js";

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

  it("starts generated remote factory runs at harness_refine when refine is enabled", () => {
    expect(defaultFactoryStartStage({ refine: true })).toBe("harness_refine");
    expect(defaultFactoryStartStage({ refine: false })).toBe("validate");
    expect(defaultFactoryStartStage({ prebuiltArchive: "gs://bucket/workspace.tar.gz", refine: true })).toBe("load_data");
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

  it("falls back to a generated build (no archive) at harness_refine / validate", () => {
    // Without an archive we generate the workspace: refine→harness_refine, no-refine→validate.
    expect(defaultFactoryStartStage({ prebuiltArchive: null, refine: true })).toBe("harness_refine");
    expect(defaultFactoryStartStage({ prebuiltArchive: null, refine: false })).toBe("validate");
  });

  it("parses the prebuilt archive GCS URI into bucket + object for consumption", () => {
    // submitFactoryRun consumes `prebuiltArchive` as the workspaceArchive verbatim;
    // downstream stages parse it with parseGsUri. Verify a realistic console URI parses.
    const archive = "gs://acme-ge-agent-factory/runs/run-abc123-0042/items/gl-anomaly-detector/workspace.tar.gz";
    const parsed = parseGsUri(archive);
    expect(parsed.bucket).toBe("acme-ge-agent-factory");
    expect(parsed.object).toBe("runs/run-abc123-0042/items/gl-anomaly-detector/workspace.tar.gz");
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
