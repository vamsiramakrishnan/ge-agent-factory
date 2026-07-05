import { expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DxError } from "../errors/dx-error.mjs";
import { openRunLedger } from "../ledger/run-ledger.mjs";
import { resolveRunLedger } from "./run-plane.mjs";

// "local" source: reuses the SQLite adapter parity-tested in
// packages/run-ledger/src/adapter-parity.test.mjs. Injecting createLocal
// (rather than routing through the process-wide cached runLedger() singleton)
// keeps this test isolated and lets it drive a real tmp-file-backed ledger.
test("local source resolves a working SQLite-backed ledger against a tmp state root", async () => {
  const dir = mkdtempSync(join(tmpdir(), "ge-run-plane-local-"));
  const dbPath = join(dir, "ledger.sqlite");
  try {
    const ledger = await resolveRunLedger({ source: "local", createLocal: () => openRunLedger(dbPath) });
    expect(ledger).toBeTruthy();
    ledger.startRun({ id: "local-1", total: 1 });
    ledger.recordTransition({ runId: "local-1", workItemId: "uc1", stage: "created", status: "done" });
    ledger.completeRun({ runId: "local-1", ok: true });

    const run = ledger.getRun("local-1");
    expect(run.status).toBe("done");
    expect(run.ok).toBe(true);
    const events = ledger.events("local-1");
    expect(events.length).toBe(1);
    expect(ledger.listRuns({ limit: 5 }).map((r) => r.id)).toContain("local-1");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// "remote" source: an injected fake stands in for createFirestoreLedgerReader
// (the same shape adapter-parity.test.mjs's fake Firestore client backs) —
// proves resolveRunLedger forwards cfg.project as { projectId } and returns
// whatever the adapter produces, without ever touching real GCP.
test("remote source resolves through the injected createRemote, forwarding projectId from cfg", async () => {
  const calls = [];
  const fakeReader = { events: async () => [], getRun: async () => null, listRuns: async () => [] };
  const createRemote = async (opts) => {
    calls.push(opts);
    return fakeReader;
  };
  const reader = await resolveRunLedger({ source: "remote", cfg: { project: "demo-project" }, createRemote });
  expect(reader).toBe(fakeReader);
  expect(calls).toEqual([{ projectId: "demo-project" }]);
});

test("remote source with no cfg.project still calls createRemote (letting it fall back to its own defaults)", async () => {
  const calls = [];
  const createRemote = async (opts) => { calls.push(opts); return {}; };
  await resolveRunLedger({ source: "remote", createRemote });
  expect(calls).toEqual([{ projectId: undefined }]);
});

// Unknown source: a programming error, not a runtime condition — DxError with
// the four-field what/where/why/fix contract every other DxError in this repo
// carries, not a raw throw.
test("unknown source throws a DxError naming the fix", async () => {
  let threw = null;
  try {
    await resolveRunLedger({ source: "bogus" });
  } catch (error) {
    threw = error;
  }
  expect(threw).toBeInstanceOf(DxError);
  expect(threw.name).toBe("DxError");
  expect(threw.why).toBeTruthy();
  expect(threw.fix).toMatch(/local|remote/);
});

test("missing source also throws a DxError (not undefined-source silently defaulting anywhere)", async () => {
  let threw = null;
  try {
    await resolveRunLedger({});
  } catch (error) {
    threw = error;
  }
  expect(threw).toBeInstanceOf(DxError);
});

// Injection precedence: explicit createLocal/createRemote always win over the
// real defaults (runLedger / createFirestoreLedgerReader), even when the
// matching real dependency would also be reachable — this is what lets every
// consumer (console transport, `ge runs events --remote`, remoteLedgerCheck)
// keep its own test seam working through this one resolver.
test("injection precedence: createLocal/createRemote override the real defaults", async () => {
  let localCalled = false;
  let remoteCalled = false;
  await resolveRunLedger({ source: "local", createLocal: async () => { localCalled = true; return { fake: "local" }; } });
  await resolveRunLedger({ source: "remote", createRemote: async () => { remoteCalled = true; return { fake: "remote" }; } });
  expect(localCalled).toBe(true);
  expect(remoteCalled).toBe(true);
});
