import { test, expect } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  cloudBuildLogDelta,
  cloudBuildLogLinesFromEntries,
  cloudBuildPollArtifactName,
  cloudBuildSubmissionArtifactName,
  logStage,
  makeLedgerLogTap,
  mirrorCloudBuildLogs,
  progressFromCloudBuildLogLine,
  readCloudBuildLogsFromLogging,
  resolveBuilderServiceAccount,
  extractCommandError,
  isTransientFailure,
  runFactoryWorker,
  projectStageEventToItem,
  parseWorkerPayload,
  stageResultArtifactCandidates,
} from "./factory-worker.js";
import { createFirestoreLedgerReader } from "../../../tools/lib/ledger/run-ledger-firestore.mjs";

test("item projection advances intermediate stages without declaring the run terminal", () => {
  const payload = { stage: "deploy_runtime" };
  expect(projectStageEventToItem(payload, { type: "stage_done", status: "done", nextStage: "poll_runtime" })).toEqual({
    status: "running",
    currentStage: "poll_runtime",
  });
  expect(projectStageEventToItem(payload, { type: "stage_next_queued", status: "queued", nextStage: "poll_runtime" })).toEqual({
    status: "queued",
    currentStage: "poll_runtime",
  });
  expect(projectStageEventToItem({ stage: "publish_enterprise" }, { type: "stage_done", status: "done", nextStage: null })).toEqual({
    status: "done",
    currentStage: "publish_enterprise",
  });
});

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

test("Cloud Build log mirror computes a cursor-based delta", () => {
  const first = cloudBuildLogDelta("a\nb\nc\n", 0);
  expect(first).toEqual({ lines: ["a", "b", "c"], nextOffset: 3, droppedLines: 0 });
  const second = cloudBuildLogDelta("a\nb\nc\nd\n", 3);
  expect(second).toEqual({ lines: ["d"], nextOffset: 4, droppedLines: 0 });
});

test("Cloud Build progress parser recognizes builder markers and Cloud Build steps", () => {
  expect(progressFromCloudBuildLogLine('Step #1 - "run-stage": ::ge-progress validate.eval_grade agents-cli eval grade')).toEqual({
    phase: "validate.eval_grade",
    message: "agents-cli eval grade",
  });
  expect(progressFromCloudBuildLogLine('Starting Step #0 - "restore-workspace"')).toEqual({
    phase: "cloud_build.restore_workspace",
    message: "restore workspace archive",
  });
});

test("Cloud Build log entries are ordered by build insert ordinal", () => {
  expect(cloudBuildLogLinesFromEntries([
    { insertId: "build-1-12", timestamp: "2026-01-01T00:00:01Z", textPayload: "third" },
    { insertId: "build-1-2", timestamp: "2026-01-01T00:00:01Z", textPayload: "second" },
    { insertId: "build-1-1", timestamp: "2026-01-01T00:00:01Z", textPayload: "first" },
    { insertId: "build-1-x", timestamp: "2026-01-01T00:00:00Z", textPayload: "fallback" },
  ], "build-1")).toEqual(["first", "second", "third", "fallback"]);
});

test("Cloud Build logs can be read directly from Cloud Logging", async () => {
  const requests = [];
  const read = await readCloudBuildLogsFromLogging("project-1", "build-1", {
    fetchLogs: async (url, opts) => {
      requests.push({ url, opts });
      return {
        ok: true,
        text: async () => JSON.stringify({
          entries: [
            { insertId: "build-1-2", textPayload: "line 2" },
            { insertId: "build-1-1", textPayload: "line 1" },
          ],
        }),
      };
    },
  });
  expect(read).toMatchObject({ ok: true, lines: ["line 1", "line 2"], truncated: false });
  expect(requests[0].url).toBe("https://logging.googleapis.com/v2/entries:list");
  const body = JSON.parse(requests[0].opts.body);
  expect(body.resourceNames).toEqual(["projects/project-1"]);
  expect(body.filter).toContain('resource.labels.build_id="build-1"');
  expect(body.filter).toContain('logName="projects/project-1/logs/cloudbuild"');
  expect(body.orderBy).toBe("timestamp asc");
});

test("Cloud Build log mirror writes only new lines and emits progress frames", async () => {
  const logFrames = [];
  const progressFrames = [];
  const mirrored = await mirrorCloudBuildLogs(
    {
      runId: "run-1",
      itemId: "item-1",
      stage: "validate",
      cloud: { projectId: "project-1", pubsubTopic: "topic-1" },
      options: { cloudBuildLogOffset: 2 },
    },
    "build-1",
    {
      run: async (cmd, args) => {
        expect(cmd).toBe("gcloud");
        expect(args).toContain("build-1");
        return {
          code: 0,
          stdout: [
            "old 1",
            "old 2",
            'Step #1 - "run-stage": ::ge-progress validate.eval_generate agents-cli eval generate',
            "new tail",
            "",
          ].join("\n"),
          stderr: "",
        };
      },
      makeTap: (_payload, _base, opts) => makeLedgerLogTap(payload, () => {}, {
        write: async (lines, frame, doc) => {
          expect(opts).toBeDefined();
          logFrames.push({ lines, frame, doc });
        },
      }),
      writeProgress: async (_payload, event) => {
        progressFrames.push(event);
      },
    },
  );

  expect(mirrored).toMatchObject({ ok: true, offset: 4, mirroredLines: 2, progressEvents: 1 });
  expect(logFrames.flatMap((frame) => frame.lines)).toEqual([
    'Step #1 - "run-stage": ::ge-progress validate.eval_generate agents-cli eval generate',
    "new tail",
  ]);
  expect(progressFrames).toEqual([
    {
      type: "stage_progress",
      status: "running",
      data: {
        phase: "validate.eval_generate",
        message: "agents-cli eval generate",
        buildId: "build-1",
      },
    },
  ]);
});

test("Cloud Build log mirror falls back to Cloud Logging when gcloud returns no lines", async () => {
  const logFrames = [];
  const progressFrames = [];
  const mirrored = await mirrorCloudBuildLogs(
    {
      runId: "run-1",
      itemId: "item-1",
      stage: "validate",
      cloud: { projectId: "project-1", pubsubTopic: "topic-1" },
      options: { cloudBuildLogOffset: 0 },
    },
    "build-1",
    {
      run: async () => ({ code: 0, stdout: "", stderr: "" }),
      readLogs: async () => ({
        ok: true,
        lines: [
          'Starting Step #1 - "run-stage"',
          'Step #1 - "run-stage": ::ge-progress validate.smoke pytest smoke tests',
        ],
      }),
      makeTap: (_payload, _base, opts) => makeLedgerLogTap(payload, () => {}, {
        write: async (lines, frame, doc) => {
          logFrames.push({ lines, frame, doc, opts });
        },
      }),
      writeProgress: async (_payload, event) => {
        progressFrames.push(event);
      },
    },
  );

  expect(mirrored).toMatchObject({ ok: true, offset: 2, mirroredLines: 2, progressEvents: 2, source: "cloud_logging" });
  expect(logFrames.flatMap((frame) => frame.lines)).toEqual([
    'Starting Step #1 - "run-stage"',
    'Step #1 - "run-stage": ::ge-progress validate.smoke pytest smoke tests',
  ]);
  expect(progressFrames.map((event) => event.data.phase)).toEqual([
    "cloud_build.run_stage",
    "validate.smoke",
  ]);
});

test("Cloud Build poll/submission artifacts do not collide with terminal stage result", () => {
  expect(stageResultArtifactCandidates("gs://bucket/runs/r/items/i", "validate")).toEqual([
    "gs://bucket/runs/r/items/i/factory-validate-result.json",
    "gs://bucket/runs/r/items/i/files/./artifacts/factory-validate-result.json",
  ]);
  expect(cloudBuildPollArtifactName("validate")).toBe("factory-validate-poll-result.json");
  expect(cloudBuildSubmissionArtifactName("validate")).toBe("factory-validate-cloud-build.json");
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
  }, { GOOGLE_CLOUD_PROJECT: "", GCLOUD_PROJECT: "", GE_AGENT_FACTORY_PROJECT: "" });

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
  }, { GOOGLE_CLOUD_PROJECT: "", GCLOUD_PROJECT: "", GE_AGENT_FACTORY_PROJECT: "" });
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
