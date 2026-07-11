// Regression net for submitFactoryRun's IS_PROD branch (WS4 Step 1).
//
// Locks the OBSERVABLE behavior of the production submit path — the ordered
// GCS/Firestore/Cloud-Tasks REST calls and the returned runRecord shape — so
// that the sync→async conversion of the scaffold/tar/read fs+exec calls (WS4
// Step 2, BEHAVIOR-CHANGE) can be proven behavior-preserving. Assertions are
// on the network boundary (mocked global.fetch) and the return value, never on
// which fs/child_process API variant is used, so the SAME test passes both
// before and after the conversion.
//
// IS_PROD is captured at module load, so env is set before the dynamic import
// and fs/child_process are module-mocked (scoped to this file's run) so the
// generator never actually executes and no temp dirs are created.
import { describe, expect, it, mock, beforeAll, afterEach } from "bun:test";
import * as realFs from "node:fs";
import * as realFsPromises from "node:fs/promises";
import * as realCp from "node:child_process";

process.env.NODE_ENV = "production";
process.env.GOOGLE_CLOUD_PROJECT = "test-proj";
process.env.GOOGLE_CLOUD_PROJECT_NUMBER = "123456789";
process.env.GE_AGENT_FACTORY_WORKER_URL = "https://worker.example.run.app";
delete process.env.K_SERVICE;

const FAKE_TAR = Buffer.from("FAKE_TAR_BYTES");
const realReadFileSync = realFs.readFileSync;
const realReadFile = realFsPromises.readFile;
const realSpawn = realCp.spawn;

// Smart read: only intercept the workspace tarball read; delegate everything
// else (dotenv, json-io, etc.) to the real fs so imports don't break.
const smartReadSync = (path, ...rest) =>
  String(path).endsWith(".tar.gz") ? FAKE_TAR : realReadFileSync(path, ...rest);
const smartReadAsync = async (path, ...rest) =>
  String(path).endsWith(".tar.gz") ? FAKE_TAR : realReadFile(path, ...rest);

let calls;
let submitFactoryRun;
const originalFetch = global.fetch;

beforeAll(async () => {
  mock.module("node:fs", () => ({
    ...realFs,
    readFileSync: smartReadSync,
  }));
  mock.module("node:fs/promises", () => ({
    ...realFsPromises,
    readFile: smartReadAsync,
  }));
  mock.module("node:child_process", () => ({
    ...realCp,
    spawn: (command, args, options) => {
      const isGenerator = command === "bun" && Array.isArray(args) && args.some((arg) => String(arg).endsWith("scripts/factory.mjs"));
      const isTar = command === "tar";
      if (!isGenerator && !isTar) return realSpawn(command, args, options);
      return { on: (event, cb) => { if (event === "close") cb(0); } };
    },
  }));

  // Cache-busting query forces a FRESH module instance so IS_PROD is captured
  // from THIS file's env (NODE_ENV=production), independent of whether another
  // test file already imported factory-gateway.js (with IS_PROD unset) into the
  // shared bun module registry earlier in the run.
  ({ submitFactoryRun } = await import(`./factory-gateway.js?prod=${Date.now()}`));
});

function installFetch() {
  calls = [];
  global.fetch = mock(async (url, init = {}) => {
    const u = String(url);
    calls.push({ url: u, method: init.method || "GET", body: init.body });
    if (u.includes("metadata.google.internal")) {
      return new Response(JSON.stringify({ access_token: "test-token" }), { status: 200 });
    }
    if (u.includes("/cache%2Fworkspaces%2F") && !u.includes("upload/storage/v1")) {
      return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
    }
    // GCS media upload, Firestore PATCH, Cloud Tasks create all return 200 OK JSON.
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  });
}

afterEach(() => {
  global.fetch = originalFetch;
  calls = [];
});

function urls(substr) {
  return calls.filter((c) => c.url.includes(substr));
}

describe("submitFactoryRun — IS_PROD generate path (regression net)", () => {
  it("orchestrates GCS index → archive upload → firestore → cloud task → submitted, returns runRecord", async () => {
    installFetch();
    const record = await submitFactoryRun({
      title: "GL Anomaly Detector",
      useCaseId: "gl_anomaly_detector",
      workspace: "gl-anomaly-detector",
      targetStage: "preview", // not app-id-gated
      systems: ["SAP", "Oracle"],
      rows: "48",
      domain: "finance",
    });

    // Returned runRecord shape + terminal status.
    expect(record.ok).toBe(true);
    expect(record.status).toBe("submitted");
    expect(record.title).toBe("GL Anomaly Detector");
    expect(record.useCaseId).toBe("gl_anomaly_detector");
    expect(record.workspaceId).toBe("gl-anomaly-detector");
    expect(record.agentId).toBe("gl_anomaly_detector");
    expect(record.targetStage).toBe("preview");
    expect(record.project).toBe("test-proj");
    expect(record.bucket).toBe("test-proj-ge-agent-factory");
    expect(record.runId).toMatch(/^run-[0-9a-f]{8}-\d{4}$/);
    expect(record.artifactPrefix).toBe(
      `gs://test-proj-ge-agent-factory/runs/${record.runId}/items/gl-anomaly-detector`,
    );

    // Boundary calls: two GCS index writes (queued then submitted), one
    // canonical archive upload, one cache fill, three Firestore patches, and
    // one Cloud Task enqueue.
    const gcsUploads = urls("upload/storage/v1");
    // control-plane index object name = runs/<runId>.json ; archive object under items/
    const indexWrites = gcsUploads.filter((c) => c.url.includes(`runs%2F${record.runId}.json`));
    const archiveWrites = gcsUploads.filter((c) => c.url.includes("workspace.tar.gz") && c.url.includes(`runs%2F${record.runId}`));
    const cacheWrites = gcsUploads.filter((c) => c.url.includes("workspace.tar.gz") && c.url.includes("cache%2Fworkspaces%2F"));
    expect(indexWrites.length).toBe(2);
    expect(archiveWrites.length).toBe(1);
    expect(cacheWrites.length).toBe(1);
    // The archive upload carries the (mocked) tar bytes read from disk.
    expect(archiveWrites[0].body).toBeInstanceOf(Buffer);
    expect(archiveWrites[0].body.toString()).toBe("FAKE_TAR_BYTES");

    expect(urls("firestore.googleapis.com").length).toBe(3);
    expect(urls("cloudtasks.googleapis.com").length).toBe(1);

    // Ordering: first index write (queued) precedes archive upload precedes the
    // Cloud Task enqueue precedes the final index write (submitted).
    const idxFirst = calls.findIndex((c) => c.url.includes(`runs%2F${record.runId}.json`));
    const idxArchive = calls.findIndex((c) => c.url.includes("workspace.tar.gz") && c.url.includes(`runs%2F${record.runId}`));
    const idxTask = calls.findIndex((c) => c.url.includes("cloudtasks.googleapis.com"));
    const idxLast = calls.map((c) => c.url).lastIndexOf(
      calls.filter((c) => c.url.includes(`runs%2F${record.runId}.json`)).at(-1).url,
    );
    expect(idxFirst).toBeLessThan(idxArchive);
    expect(idxArchive).toBeLessThan(idxTask);
    expect(idxTask).toBeLessThan(idxLast);
  });

  it("prebuilt-archive path skips scaffold+upload, still records + enqueues", async () => {
    installFetch();
    const record = await submitFactoryRun({
      title: "Prebuilt Agent",
      useCaseId: "prebuilt_agent",
      workspace: "prebuilt-agent",
      targetStage: "load_data",
      prebuiltArchive: "gs://test-proj-ge-agent-factory/runs/r-ext/items/prebuilt-agent/workspace.tar.gz",
    });
    expect(record.status).toBe("submitted");
    // No archive upload happens on the prebuilt path (client already uploaded).
    const archiveWrites = urls("upload/storage/v1").filter((c) => c.url.includes("workspace.tar.gz"));
    expect(archiveWrites.length).toBe(0);
    // Still writes the control-plane index twice and enqueues one Cloud Task.
    expect(urls("cloudtasks.googleapis.com").length).toBe(1);
    expect(urls("firestore.googleapis.com").length).toBe(3);
  });
});
