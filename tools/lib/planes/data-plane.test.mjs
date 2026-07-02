import { expect, test } from "bun:test";
import { createDataPlane, dataCoordinatesFromOutputs, mergeDataPlaneConfig } from "./data-plane.mjs";

test("dataCoordinatesFromOutputs maps terraform outputs with config fallbacks", () => {
  expect(dataCoordinatesFromOutputs({
    data_bucket: "bucket-from-tf",
    alloydb_dsn_secret: "dsn-from-tf",
    bigtable_instance: "bt-from-tf",
    bq_location: "EU",
    alloydb_instance: "alloydb-primary",
    firestore_location: "nam5",
  }, { geLocation: "global" }, { includeRuntimeDetails: true })).toEqual({
    dataBucket: "bucket-from-tf",
    alloydbDsnSecret: "dsn-from-tf",
    bigtableInstance: "bt-from-tf",
    bqLocation: "EU",
    alloydbInstance: "alloydb-primary",
    firestoreLocation: "nam5",
  });
});

test("mergeDataPlaneConfig preserves unrelated config and applies fallbacks", () => {
  expect(mergeDataPlaneConfig(
    { project: "p", dataBucket: "old-data", gatewayUrl: "https://gateway" },
    { bigtable_instance: "bt-new" },
    { alloydbDsnSecret: "dsn-current", bqLocation: "US" },
  )).toEqual({
    project: "p",
    dataBucket: "old-data",
    gatewayUrl: "https://gateway",
    alloydbDsnSecret: "dsn-current",
    bigtableInstance: "bt-new",
    bqLocation: "US",
  });
});

test("dataUp applies infra and persists runtime coordinates", async () => {
  const calls = [];
  let stored = { project: "demo", gatewayUrl: "https://gateway" };
  const plane = createDataPlane({
    ensureTerraform: () => calls.push(["ensureTerraform"]),
    ensureGcloud: () => calls.push(["ensureGcloud"]),
    describeProjectNumber: () => "123",
    infra: (cfg, opts) => calls.push(["infra", cfg.projectNumber, opts.sub]),
    tfOutputs: () => ({
      data_bucket: "demo-data",
      alloydb_dsn_secret: "demo-dsn",
      alloydb_instance: "demo-alloydb",
      bigtable_instance: "demo-bt",
      bq_location: "US",
      firestore_location: "nam5",
    }),
    readConfig: () => stored,
    writeConfig: (next) => { stored = next; },
    gcloud: () => ({ ok: true, out: "ok" }),
    authorize: () => ({ authorized: true, dryRun: false }),
  });

  const result = await plane.dataUp({ project: "demo", geAppId: "app", region: "us-central1", geLocation: "global", mode: "remote" });

  expect(calls).toEqual([
    ["ensureTerraform"],
    ["ensureGcloud"],
    ["infra", "123", "apply"],
  ]);
  expect(result.data).toMatchObject({ dataBucket: "demo-data", alloydbInstance: "demo-alloydb" });
  expect(stored).toMatchObject({
    project: "demo",
    gatewayUrl: "https://gateway",
    dataBucket: "demo-data",
    alloydbDsnSecret: "demo-dsn",
    alloydbInstance: "demo-alloydb",
    bigtableInstance: "demo-bt",
    firestoreLocation: "nam5",
  });
});

test("dataUp refuses to provision in local mode (fail-safe gate)", async () => {
  let infraCalled = false;
  const plane = createDataPlane({
    ensureTerraform: () => {},
    ensureGcloud: () => {},
    describeProjectNumber: () => "123",
    infra: () => { infraCalled = true; },
    tfOutputs: () => ({}),
    readConfig: () => ({}),
    writeConfig: () => {},
    gcloud: () => ({ ok: true, out: "ok" }),
    // real assertRemoteAuthorized (default) — no authorize override
  });

  await expect(plane.dataUp({ project: "demo", geAppId: "app", mode: "local" })).rejects.toThrow(/remote mode/i);
  expect(infraCalled).toBe(false);
});

test("dataDoctor probes expected data services", () => {
  const commands = [];
  const plane = createDataPlane({
    ensureTerraform: () => {},
    ensureGcloud: () => {},
    describeProjectNumber: () => "123",
    infra: () => {},
    tfOutputs: () => ({}),
    readConfig: () => ({}),
    writeConfig: () => {},
    localCommand: (args) => ({ ok: true, out: args.includes("python") ? "snowfakery ok" : "uv 0.9.0" }),
    gcloud: (args) => {
      commands.push(args.slice(0, 3).join(" "));
      return { ok: args[0] !== "secrets", out: "ok" };
    },
  });

  const report = plane.dataDoctor({ project: "demo", region: "us-central1" });

  expect(commands).toEqual([
    "storage buckets describe",
    "secrets describe ge-agent-alloydb-dsn",
    "bigtable instances describe",
    "bq --project_id demo",
  ]);
  expect(report.fails).toBe(0);
  expect(report.checks.map((check) => check.status)).toEqual(["pass", "warn", "pass", "pass", "pass", "pass"]);
  expect(report.checks.map((check) => check.name)).toContain("snowfakery runtime");
});

test("dataRuntimeDoctor warns when Snowfakery is not cached", () => {
  const plane = createDataPlane({
    ensureTerraform: () => {},
    ensureGcloud: () => {},
    describeProjectNumber: () => "123",
    infra: () => {},
    tfOutputs: () => ({}),
    readConfig: () => ({}),
    writeConfig: () => {},
    gcloud: () => ({ ok: true, out: "ok" }),
    localCommand: (args) => args.includes("python")
      ? { ok: false, err: "No package metadata was found for snowfakery" }
      : { ok: true, out: "uv 0.9.0" },
  });

  const report = plane.dataRuntimeDoctor();

  expect(report.fails).toBe(0);
  expect(report.checks.find((check) => check.name === "uv toolchain")).toMatchObject({ status: "pass" });
  expect(report.checks.find((check) => check.name === "snowfakery runtime")).toMatchObject({
    status: "warn",
    detail: "No package metadata was found for snowfakery",
  });
});
