import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test, expect } from "bun:test";

const storeDir = join("/tmp", `ge-console-job-store-${process.pid}`);
rmSync(storeDir, { recursive: true, force: true });
mkdirSync(storeDir, { recursive: true });
process.env.GE_CONSOLE_JOB_STORE = storeDir;

const { getJob, startGeJob, streamJob, streamLedger, __setFirestoreLedgerReaderForTest } = await import("./transport.mjs");

test("startGeJob blocks before spawn when command preflight fails", async () => {
  const checks = [{ name: "gcloud auth", status: "fail", detail: "no active account", fix: "gcloud auth login" }];
  const jobId = await startGeJob(["data", "up"], { id: "data.up", label: "Provision data plane" }, {
    preflight: () => ({ ok: false, fails: 1, checks }),
  });

  const job = await getJob(jobId);
  expect(job.status).toBe("blocked");
  expect(job.checks).toEqual(checks);

  const events = [];
  await streamJob(jobId, (line) => events.push(JSON.parse(line)), () => false);
  expect(events.some((ev) => ev.type === "stage_blocked" && ev.data?.checks?.[0]?.name === "gcloud auth")).toBe(true);
});

test("streamLedger routes Firestore source through the Firestore reader", async () => {
  const calls = [];
  __setFirestoreLedgerReaderForTest({
    events: async (runId, opts) => {
      calls.push({ runId, opts });
      return [{ seq: 2, ts: "2026-06-15T10:00:02.000Z", type: "stage_done", stage: "created", status: "done", workItemId: "uc-a", error: null, data: null }];
    },
    getRun: async () => ({ id: "remote-1", status: "done", ok: true }),
  });
  const lines = [];
  let ended = false;
  try {
    await streamLedger(
      { runId: "remote-1", source: "firestore", afterSeq: 1 },
      (line) => lines.push(JSON.parse(line)),
      () => false,
      () => { ended = true; },
    );
  } finally {
    __setFirestoreLedgerReaderForTest(null);
  }

  expect(calls).toEqual([{ runId: "remote-1", opts: { afterSeq: 1 } }]);
  expect(lines.map((line) => line.type)).toEqual(["ledger_source", "stage_done", "run_complete"]);
  expect(lines[0].status).toBe("firestore");
  expect(lines[1]).toMatchObject({ seq: 2, stage: "created", status: "done" });
  expect(lines[2]).toMatchObject({ status: "done", ok: true });
  expect(ended).toBe(true);
});

test("streamLedger local source reports unavailable when local ledger is disabled", async () => {
  const previous = process.env.GE_LEDGER;
  process.env.GE_LEDGER = "0";
  const lines = [];
  let ended = false;
  try {
    await streamLedger(
      { runId: "local-1", source: "local" },
      (line) => lines.push(JSON.parse(line)),
      () => false,
      () => { ended = true; },
    );
  } finally {
    if (previous === undefined) delete process.env.GE_LEDGER;
    else process.env.GE_LEDGER = previous;
  }

  expect(lines.map((line) => line.type)).toEqual(["ledger_source", "ledger_unavailable"]);
  expect(lines[0].status).toBe("local");
  expect(ended).toBe(true);
});
