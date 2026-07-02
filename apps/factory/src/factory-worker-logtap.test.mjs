import { test, expect } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  logStage,
  makeLedgerLogTap,
  resolveBuilderServiceAccount,
  extractCommandError,
  isTransientFailure,
  runFactoryWorker,
  parseWorkerPayload,
} from "./factory-worker.js";
import { createFirestoreLedgerReader } from "../../../tools/lib/ledger/run-ledger-firestore.mjs";

// ── Security hardening Stage B: builds submit AS the builder SA + explicit logs ──
test("resolveBuilderServiceAccount: default reconstructs the conventional builder SA path", () => {
  expect(resolveBuilderServiceAccount("vital-octagon-19612", {})).toBe(
    "projects/vital-octagon-19612/serviceAccounts/ge-agent-factory-builder@vital-octagon-19612.iam.gserviceaccount.com",
  );
});

test("resolveBuilderServiceAccount: empty when no project (and no override)", () => {
  expect(resolveBuilderServiceAccount("", {})).toBe("");
});

test("resolveBuilderServiceAccount: bare-email override is wrapped into a full path", () => {
  expect(resolveBuilderServiceAccount("p1", { GE_AGENT_FACTORY_BUILDER_SA: "custom@p1.iam.gserviceaccount.com" })).toBe(
    "projects/p1/serviceAccounts/custom@p1.iam.gserviceaccount.com",
  );
});

test("resolveBuilderServiceAccount: full-path override is passed through verbatim", () => {
  const full = "projects/p2/serviceAccounts/custom@p2.iam.gserviceaccount.com";
  expect(resolveBuilderServiceAccount("p1", { GE_AGENT_FACTORY_BUILDER_SA: full })).toBe(full);
});


const payload = { runId: "r1", itemId: "i1", stage: "build", cloud: { projectId: "p1" } };

function tapWith() {
  const frames = [];
  const base = [];
  const tap = makeLedgerLogTap(payload, (e) => base.push(e), { write: async (lines) => { frames.push(lines); } });
  return { tap, frames, base };
}

test("batches lines into a frame at the batch threshold and forwards to base sink", async () => {
  const { tap, frames, base } = tapWith();
  for (let i = 0; i < 25; i++) tap.onEvent({ line: `line ${i}` });
  // 25 lines = one full batch → one frame; base sink saw all 25 events.
  await Promise.resolve();
  expect(frames.length).toBe(1);
  expect(frames[0].length).toBe(25);
  expect(base.length).toBe(25);
});

test("stop() flushes the remaining partial buffer", async () => {
  const { tap, frames } = tapWith();
  tap.onEvent({ line: "only one" });
  expect(frames.length).toBe(0); // under threshold, not yet flushed
  await tap.stop();
  expect(frames.length).toBe(1);
  expect(frames[0]).toEqual(["only one"]);
});

test("ignores empty/whitespace lines and non-string events", async () => {
  const { tap, frames } = tapWith();
  tap.onEvent({ line: "   " });
  tap.onEvent({ type: "status" });
  tap.onEvent({ line: "real" });
  await tap.stop();
  expect(frames).toEqual([["real"]]);
});

test("disabled without a cloud project (local runs) — no frames, base still forwarded", async () => {
  const frames = [];
  const base = [];
  const tap = makeLedgerLogTap({ runId: "r", itemId: "i", stage: "build", cloud: {} }, (e) => base.push(e), { write: async (l) => frames.push(l) });
  for (let i = 0; i < 50; i++) tap.onEvent({ line: `l${i}` });
  await tap.stop();
  expect(frames.length).toBe(0);
  expect(base.length).toBe(50);
  expect(tap.enabled).toBe(false);
});

test("caps frames and emits a single truncation marker", async () => {
  const { tap, frames } = tapWith();
  // 150 frames cap → push 151 full batches; the 151st flush emits the truncation marker.
  for (let f = 0; f < 152; f++) {
    for (let i = 0; i < 25; i++) tap.onEvent({ line: `f${f} l${i}` });
    // Drain the serialized flush chain so each batch becomes its own frame.
    await new Promise((r) => setTimeout(r, 0));
  }
  await tap.stop();
  expect(frames.length).toBeLessThanOrEqual(151); // 150 content frames + 1 truncation marker
  const marker = frames.find((lines) => lines.some((l) => /truncated at 150 frames/.test(l)));
  expect(marker).toBeDefined();
});

// ── BUG 1: stage_log frame-key collision under concurrent flush ───────────────
// A slow async write lets a batch-trigger flush (buf>=25) overlap a prior in-flight
// flush. With the frame index allocated only AFTER the await and no re-entrancy
// guard, both flushes read the same `frame` → both write the SAME doc key → the
// second silently overwrites the first → up to 25 lines lost.
test("BUG1: overlapping flushes get distinct frame keys and lose no lines", async () => {
  const writes = []; // { frame, lines }
  let resolveFirst;
  let firstStarted = false;
  const tap = makeLedgerLogTap(
    payload,
    () => {},
    {
      write: async (lines, frame) => {
        writes.push({ frame, lines });
        if (!firstStarted) {
          firstStarted = true;
          // Hold the FIRST write open so the second batch's flush overlaps it.
          await new Promise((r) => { resolveFirst = r; });
        }
      },
    },
  );

  // First full batch → triggers flush #1 (which blocks inside write).
  for (let i = 0; i < 25; i++) tap.onEvent({ line: `a${i}` });
  await Promise.resolve();
  // Second full batch → triggers flush #2 while flush #1 is still in flight.
  for (let i = 0; i < 25; i++) tap.onEvent({ line: `b${i}` });
  await Promise.resolve();
  await Promise.resolve();

  // Release the first write; let everything settle.
  resolveFirst();
  await tap.stop();
  await new Promise((r) => setTimeout(r, 0));

  // Both batches must have been written.
  expect(writes.length).toBeGreaterThanOrEqual(2);
  // Each write must carry a DISTINCT frame index (stable per call, allocated
  // before the await) so the Firestore doc keys never collide.
  const frameIdxs = writes.map((w) => w.frame);
  expect(new Set(frameIdxs).size).toBe(frameIdxs.length);
  // No lines lost: all 50 lines present across the writes.
  const allLines = writes.flatMap((w) => w.lines);
  for (let i = 0; i < 25; i++) {
    expect(allLines).toContain(`a${i}`);
    expect(allLines).toContain(`b${i}`);
  }
});

// Cap + truncation semantics must survive the re-entrancy guard.
test("BUG1: cap + single truncation marker still hold with overlap guard", async () => {
  const frames = [];
  const tap = makeLedgerLogTap(payload, () => {}, {
    write: async (lines) => { frames.push(lines); },
  });
  for (let f = 0; f < 160; f++) {
    for (let i = 0; i < 25; i++) tap.onEvent({ line: `f${f} l${i}` });
    // Drain the serialized flush chain so each batch becomes its own frame.
    await new Promise((r) => setTimeout(r, 0));
  }
  await tap.stop();
  await new Promise((r) => setTimeout(r, 0));
  const markers = frames.filter((lines) => lines.some((l) => /truncated at 150 frames/.test(l)));
  expect(markers.length).toBe(1);
  // 150 content frames + 1 truncation marker, never more.
  expect(frames.length).toBeLessThanOrEqual(151);
});

// ── BUG 2: monotonic seq so live frames aren't dropped/duplicated ─────────────
// The worker must assign a strictly-increasing `seq` to successive stage_log frames
// so the cloud normalizer (which prefers data.seq) orders by intent, not snapshot
// position.
test("BUG2: worker assigns strictly-increasing seq to successive frames", async () => {
  const seqs = [];
  const tap = makeLedgerLogTap(payload, () => {}, {
    write: async (_lines, _frame, doc) => { seqs.push(doc?.seq); },
  });
  for (let f = 0; f < 5; f++) {
    for (let i = 0; i < 25; i++) tap.onEvent({ line: `f${f} l${i}` });
    // Drain the serialized flush chain so each batch becomes its own frame.
    await new Promise((r) => setTimeout(r, 0));
  }
  await tap.stop();
  expect(seqs.length).toBeGreaterThanOrEqual(5);
  for (const s of seqs) expect(typeof s).toBe("number");
  for (let i = 1; i < seqs.length; i++) {
    expect(seqs[i]).toBeGreaterThan(seqs[i - 1]);
  }
});

// listenEvents over two snapshots: the second snapshot inserts a doc with an
// EARLIER ts but a HIGHER worker-assigned seq (clock skew / same-second interleave).
// With positional seq the new doc takes a low index → low seq ≤ cursor → DROPPED,
// and its neighbor shifts up → re-delivered as a DUPLICATE. With a real `seq` on
// every doc, the new doc is delivered exactly once and nothing is re-delivered.
test("BUG2: out-of-order ts insert is delivered once, nothing re-delivered", async () => {
  let snapshotCb = null;
  // Snapshot 1: two docs already streamed (seq 10, 20).
  let docs = [
    { id: "d10", data: () => ({ seq: 10, ts: "2026-06-20T00:00:02.000Z", type: "stage_log", stage: "build", data: { lines: ["x"] } }) },
    { id: "d20", data: () => ({ seq: 20, ts: "2026-06-20T00:00:03.000Z", type: "stage_log", stage: "build", data: { lines: ["y"] } }) },
  ];
  const collectionRef = {
    onSnapshot(cb) { snapshotCb = cb; cb({ docs }); return () => {}; },
  };
  const fakeDb = {
    collection: () => ({ doc: () => ({ collection: () => collectionRef }) }),
  };
  const reader = await createFirestoreLedgerReader({ db: fakeDb, projectId: "p" });

  const delivered = [];
  reader.listenEvents("run1", { afterSeq: 20 }, (events) => {
    for (const e of events) delivered.push(e.seq);
  });

  // Snapshot 2: a NEW doc lands with an EARLIER ts (00:00:02.5) but a higher
  // worker-assigned seq (25) — must be delivered exactly once.
  docs = [
    { id: "d10", data: () => ({ seq: 10, ts: "2026-06-20T00:00:02.000Z", type: "stage_log", stage: "build", data: { lines: ["x"] } }) },
    { id: "d25", data: () => ({ seq: 25, ts: "2026-06-20T00:00:02.500Z", type: "stage_log", stage: "build", data: { lines: ["new"] } }) },
    { id: "d20", data: () => ({ seq: 20, ts: "2026-06-20T00:00:03.000Z", type: "stage_log", stage: "build", data: { lines: ["y"] } }) },
  ];
  snapshotCb({ docs });

  // The new doc (seq 25) is delivered exactly once; the old docs (seq 10, 20)
  // are never re-delivered.
  expect(delivered).toEqual([25]);
  expect(delivered.filter((s) => s === 10 || s === 20)).toEqual([]);
});

// ── P0: surface the REAL stage error + don't retry forever ────────────────────
// extractCommandError must surface the stderr tail, not a bare "<cmd> exited N".
test("extractCommandError surfaces the stderr tail, not a bare exit code", () => {
  const msg = extractCommandError("bash", ["load.sh"], { code: 1, stderr: "AccessDenied: bucket gs://x is private" });
  expect(msg).toContain("bash load.sh");
  expect(msg).toContain("exit 1");
  expect(msg).toContain("AccessDenied: bucket gs://x is private");
});

test("extractCommandError falls back to stdout, then to a no-output marker", () => {
  expect(extractCommandError("node", ["x"], { code: 2, stderr: "", stdout: "boom on stdout" })).toContain("boom on stdout");
  expect(extractCommandError("node", ["x"], { code: 2, stderr: "", stdout: "" })).toContain("no output");
});

// isTransientFailure must keep genuine transient errors retryable but treat
// deterministic ones (the load_data 500-with-no-body class) as permanent.
test("isTransientFailure: 5xx/timeout/quota are retryable; deterministic errors are not", () => {
  expect(isTransientFailure("upstream returned 503 service unavailable")).toBe(true);
  expect(isTransientFailure("ETIMEDOUT connecting to metadata server")).toBe(true);
  expect(isTransientFailure("rate limit exceeded, try again")).toBe(true);
  expect(isTransientFailure("AccessDenied: caller lacks storage.objects.create")).toBe(false);
  expect(isTransientFailure("FileNotFoundError: schema.json")).toBe(false);
  // A transient signal anywhere in the raw output also flips it retryable.
  expect(isTransientFailure("command failed", { stderr: "HTTP 429 quota" })).toBe(true);
});

// End-to-end: a stage whose command throws (exits non-zero) must (a) return a
// non-empty real error, (b) emit a stage_error/failed ledger event carrying the
// message, and (c) be marked non-retryable (deterministic) so the HTTP handler
// ACKs it (200) instead of looping. This is the run-m9anhe-9393 regression.
test("runFactoryWorker: deterministic stage failure surfaces the error, emits stage_error, and is non-retryable", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ge-worker-fail-"));
  await mkdir(join(dir, "mock_data", "cloud"), { recursive: true });
  const script = join(dir, "mock_data", "cloud", "load-to-google-cloud.sh");
  await writeFile(script, "#!/usr/bin/env bash\necho 'AccessDenied: caller lacks storage.objects.create' >&2\nexit 1\n");
  await chmod(script, 0o755);

  const payload = parseWorkerPayload({
    runId: "run-fail-1",
    itemId: "item-1",
    workspaceId: "item-1",
    stage: "load_data",
    targetStage: "load_data", // no next-stage enqueue
    workspaceDir: dir,
    cloud: { projectId: "" }, // local: Firestore/artifacts/log-tap all skipped
  });

  const result = await runFactoryWorker(payload, { dryRun: false });

  // (a) Real error, not a bare exit code, not empty.
  expect(result.status).toBe("failed");
  expect(result.error).toContain("AccessDenied: caller lacks storage.objects.create");
  expect(result.error).not.toBe("bash exited 1");
  // (c) Deterministic → non-retryable → HTTP handler will ACK (200), not loop.
  expect(result.retryable).toBe(false);

  // (b) A stage_error/failed event landed in the local run ledger with the message.
  const jsonl = await readFile(join(dir, "runs", "run-fail-1", "factory-events.jsonl"), "utf8");
  const events = jsonl.trim().split("\n").map((l) => JSON.parse(l));
  const errEvent = events.find((e) => e.type === "stage_error");
  expect(errEvent).toBeDefined();
  expect(errEvent.status).toBe("failed");
  expect(errEvent.stage).toBe("load_data");
  expect(errEvent.error).toContain("AccessDenied");
  expect(errEvent.data?.message).toContain("AccessDenied");
  expect(errEvent.data?.cmd).toContain("load-to-google-cloud.sh");
});

// A transient stage failure (5xx/timeout in the output) stays retryable so Cloud
// Tasks redelivers (bounded by the queue's max_attempts backstop).
test("runFactoryWorker: transient stage failure is marked retryable", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ge-worker-transient-"));
  await mkdir(join(dir, "mock_data", "cloud"), { recursive: true });
  const script = join(dir, "mock_data", "cloud", "load-to-google-cloud.sh");
  await writeFile(script, "#!/usr/bin/env bash\necho 'upstream 503 service unavailable, try again' >&2\nexit 1\n");
  await chmod(script, 0o755);

  const payload = parseWorkerPayload({
    runId: "run-transient-1",
    itemId: "item-1",
    stage: "load_data",
    targetStage: "load_data",
    workspaceDir: dir,
    cloud: { projectId: "" },
  });
  const result = await runFactoryWorker(payload, { dryRun: false });
  expect(result.status).toBe("failed");
  expect(result.retryable).toBe(true);
});

// ── C9: structured stage logs (Cloud Logging jsonPayload convention) ──
test("logStage: emits one-line JSON with severity, message, and queryable fields", () => {
  const logged = [];
  const errored = [];
  const origLog = console.log;
  const origError = console.error;
  console.log = (line) => logged.push(line);
  console.error = (line) => errored.push(line);
  try {
    logStage("INFO", { runId: "run-1", itemId: "item-1", stage: "load_data", attempt: 2, message: "stage started" });
    logStage("ERROR", { runId: "run-1", itemId: "item-1", stage: "load_data", attempt: 2, retryable: false, message: "stage failed: boom" });
  } finally {
    console.log = origLog;
    console.error = origError;
  }
  expect(logged).toHaveLength(1);
  expect(errored).toHaveLength(1);
  // One line each — no embedded newlines that would split the jsonPayload.
  expect(logged[0]).not.toContain("\n");
  const info = JSON.parse(logged[0]);
  expect(info).toEqual({ severity: "INFO", message: "stage started", runId: "run-1", itemId: "item-1", stage: "load_data", attempt: 2 });
  const err = JSON.parse(errored[0]);
  expect(err.severity).toBe("ERROR");
  expect(err.retryable).toBe(false);
  expect(err.message).toBe("stage failed: boom");
});
