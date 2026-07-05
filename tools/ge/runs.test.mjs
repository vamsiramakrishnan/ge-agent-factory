import { describe, expect, test } from "bun:test";
import {
  replayDelays, runsEventsCmd,
  connectRemoteLedgerReader, fetchRemoteRunEvents, followRemoteRunEvents,
} from "./runs.mjs";

const at = (iso) => ({ event: { ts: iso } });

describe("replayDelays", () => {
  test("first event plays immediately; gaps compress by the speed factor", () => {
    const events = [at("2026-01-01T00:00:00Z"), at("2026-01-01T00:00:01Z")]; // 1s gap
    expect(replayDelays(events, 10)).toEqual([0, 100]);
  });

  test("long gaps cap at 2s so overnight pauses don't stall the replay", () => {
    const events = [at("2026-01-01T00:00:00Z"), at("2026-01-01T08:00:00Z")];
    expect(replayDelays(events, 10)[1]).toBe(2000);
  });

  test("bursts floor at 15ms so output stays readable", () => {
    const events = [at("2026-01-01T00:00:00.000Z"), at("2026-01-01T00:00:00.001Z")];
    expect(replayDelays(events, 10)[1]).toBe(15);
  });

  test("missing timestamps and bad speeds degrade to the floor, not NaN", () => {
    const events = [{ event: {} }, { event: {} }];
    const delays = replayDelays(events, Number.NaN);
    expect(delays).toEqual([0, 15]);
  });
});

// ── `ge runs events --remote` (durable Firestore run ledger) ─────────────────
// Offline-only per the task: no real Firestore/gcloud is reachable here, so
// (1) the command's shape is parse-verified, (2) the creds/project-absent
// error path is exercised for real, and (3) the read path is driven through an
// injected fake transport (not a real network call) — the SAME kind of fake
// used by packages/run-ledger/src/adapter-parity.test.mjs, but only the
// {events, getRun} surface these helpers actually call.
const GCP_ENV_VARS = ["GOOGLE_CLOUD_PROJECT", "GCLOUD_PROJECT", "GE_PROJECT"];
function withoutGcpEnv(fn) {
  const saved = Object.fromEntries(GCP_ENV_VARS.map((k) => [k, process.env[k]]));
  for (const k of GCP_ENV_VARS) delete process.env[k];
  return Promise.resolve().then(fn).finally(() => {
    for (const k of GCP_ENV_VARS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });
}

describe("ge runs events --remote", () => {
  test("command is parse-verified: --remote/--after-seq/--project sit alongside the local daemon-task args", () => {
    expect(runsEventsCmd.args.remote.type).toBe("boolean");
    expect(runsEventsCmd.args.afterSeq).toBeDefined();
    expect(runsEventsCmd.args.project).toBeDefined();
    // still exposes the pre-existing local-daemon args (id/json/port/follow) —
    // this is a wrapper, not a replacement.
    expect(runsEventsCmd.args.id.required).toBe(true);
    expect(runsEventsCmd.args.follow.type).toBe("boolean");
  });

  test("creds/project absent: throws a DxError naming the fix, never a raw stack trace", async () => {
    await withoutGcpEnv(async () => {
      let threw = null;
      try {
        await connectRemoteLedgerReader({}, { createReader: async () => { throw new Error("should never be called"); } });
      } catch (error) {
        threw = error;
      }
      expect(threw).not.toBeNull();
      expect(threw.name).toBe("DxError");
      expect(threw.fix).toMatch(/ge (mode remote|init)/);
      expect(threw.why).toBeTruthy();
    });
  });

  test("reader connection failure (e.g. missing ADC) is wrapped as a DxError, not surfaced raw", async () => {
    const cfg = { project: "demo-project" };
    let threw = null;
    try {
      await connectRemoteLedgerReader(cfg, {
        createReader: async () => { throw new Error("Could not load the default credentials"); },
      });
    } catch (error) {
      threw = error;
    }
    expect(threw.name).toBe("DxError");
    expect(threw.why).toMatch(/default credentials/);
    expect(threw.fix).toMatch(/gcloud auth/);
  });

  test("fetchRemoteRunEvents reads through an injected fake transport (offline)", async () => {
    const cfg = { project: "demo-project" };
    const fakeEvents = [
      { seq: 1, ts: "2026-07-05T00:00:01.000Z", type: "stage_started", stage: "created", status: "started", workItemId: "uc1", error: null, data: null },
      { seq: 2, ts: "2026-07-05T00:00:02.000Z", type: "stage_done", stage: "created", status: "done", workItemId: "uc1", error: null, data: null },
    ];
    const createReader = async ({ projectId }) => {
      expect(projectId).toBe("demo-project");
      return {
        events: async (runId, { afterSeq = 0 } = {}) => {
          expect(runId).toBe("remote-build-x");
          return fakeEvents.filter((e) => e.seq > afterSeq);
        },
        getRun: async () => ({ status: "running", ok: null }),
      };
    };
    const events = await fetchRemoteRunEvents(cfg, { runId: "remote-build-x", afterSeq: 0, createReader });
    expect(events).toEqual(fakeEvents);
    const tail = await fetchRemoteRunEvents(cfg, { runId: "remote-build-x", afterSeq: 1, createReader });
    expect(tail).toEqual([fakeEvents[1]]);
  });

  test("fetchRemoteRunEvents wraps a read failure after a successful connect as a DxError too", async () => {
    const cfg = { project: "demo-project" };
    const createReader = async () => ({
      events: async () => { throw new Error("permission-denied"); },
      getRun: async () => null,
    });
    let threw = null;
    try {
      await fetchRemoteRunEvents(cfg, { runId: "remote-build-x", createReader });
    } catch (error) {
      threw = error;
    }
    expect(threw.name).toBe("DxError");
    expect(threw.why).toMatch(/permission-denied/);
  });

  test("followRemoteRunEvents polls until the run is terminal, advancing the seq cursor, bounded by maxTicks", async () => {
    const cfg = { project: "demo-project" };
    let tick = 0;
    const seen = [];
    const createReader = async () => ({
      events: async (runId, { afterSeq = 0 } = {}) => {
        tick += 1;
        if (tick === 1) return [{ seq: 1, ts: "t1", type: "stage_started", stage: "created", status: "started", workItemId: "uc1", error: null, data: null }];
        return [{ seq: 2, ts: "t2", type: "run_complete", stage: null, status: "done", workItemId: null, error: null, data: null }];
      },
      getRun: async () => (tick >= 2 ? { status: "done", ok: true } : { status: "running", ok: null }),
    });
    const result = await followRemoteRunEvents(cfg, {
      runId: "remote-build-x", createReader, sleepMs: 0, maxTicks: 5,
      onEvent: (ev) => seen.push(ev.seq),
    });
    expect(result.terminal).toBe(true);
    expect(result.run.status).toBe("done");
    expect(result.cursor).toBe(2);
    expect(seen).toEqual([1, 2]);
    expect(tick).toBeLessThanOrEqual(2); // stopped as soon as it went terminal, not all 5 ticks
  });

  test("followRemoteRunEvents gives up (non-terminal) once maxTicks is exhausted, rather than looping forever", async () => {
    const cfg = { project: "demo-project" };
    const createReader = async () => ({
      events: async () => [],
      getRun: async () => ({ status: "running", ok: null }),
    });
    const result = await followRemoteRunEvents(cfg, { runId: "remote-build-x", createReader, sleepMs: 0, maxTicks: 3 });
    expect(result.terminal).toBe(false);
    expect(result.run).toBeNull();
  });
});
