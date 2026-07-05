// tools/lib/ge-job-runner.mjs — the parameterized spawn-and-emit primitive
// shared by the daemon's "ge.command" run-kind (tools/lib/daemon/command-run.mjs)
// and the console's daemon-first/fallback local job submission
// (apps/console/src/server/transport/jobs.mjs, reached via factory-core.mjs's
// re-export — jobs.mjs may not import this module directly, per the frozen
// apps/* -> tools/lib/* import surface).
//
// This is NOT a byte-identical runner. The two call sites genuinely diverge on
// six axes (confirmed against the live sources, not assumed):
//   1. spawn target      — daemon: process.execPath (node); console: "bun".
//   2. cwd                — daemon: REPO_ROOT; console: unset (server cwd).
//   3. terminal payload   — daemon attaches data:{code,signal}; console does not.
//   4. announce timestamp — console stamps `ts` on the announce event inline
//                           (no downstream sink adds one); the daemon's
//                           run-store appendEvent stamps `ts` itself, so the
//                           event runSpawnedJob builds must NOT also set one.
//   5. persistence sink    — daemon: run-store JSONL + run.json; console:
//                           SQLite job-store + an in-memory buffer/listener
//                           fan-out for the live SSE relay.
//   6. resume              — daemon's ge.command supports resume (resume_*
//                           events, an appendResumeAttempt record, prior
//                           output merged in); the console fallback is always
//                           one-shot.
// runSpawnedJob is parameterized on all six; it owns NO store — onEvent/
// onTerminal do all persistence, so the caller decides what "terminal" means
// for its own run record. Do not unify cmd/cwd/terminal-shape/ts across call
// sites — each is preserved exactly as documented above.
import { execStream } from "./exec-stream.mjs";

// Run one streamed child process, in start or resume mode, and report back to
// the caller via onEvent (every event, including the announce and terminal
// ones) and onTerminal (a single call once the child settles).
//
//   id            run/job id (threaded into execStream's meta.runId)
//   cmd, args     spawn target — always injected, never defaulted here
//   cwd, env      spawn environment — always injected, never defaulted here
//   announceLine  the "$ …" line (" (resume)" is appended in resume mode)
//   stage         event stage label
//   onEvent       (event) => void — called for the announce event, every
//                 execStream-derived event, and the terminal event
//   onTerminal    (status, { code, signal, line, result?, error?, resumeAction }) => void
//                 — does ALL persistence for the run/job record. `result` (the
//                 raw execStream resolution — code/signal/stdout/stderr) is
//                 present only when the child settled normally; `error` is
//                 present only when the execStream promise itself rejected
//                 (execStream practically never rejects — reject:false — so
//                 this is the same rare pre-spawn-throw guard task-runner.mjs
//                 carried; kept for parity, not separately drilled here).
//   terminalData  attach data:{code,signal} to the terminal event — true for
//                 the daemon shape, false (default) for the console shape
//   stampAnnounceTs  stamp `ts` on the announce event inline — true only for
//                 the console binding (see axis 4 above); false (default)
//                 leaves `ts` to the daemon's own appendEvent
//   afterAnnounce ()=>void, called synchronously right after the announce
//                 event and before execStream is invoked — lets a caller
//                 (the console fallback) interleave its own hand-authored
//                 events (a fallback-warning, a preflight trace) between the
//                 announce and the first subprocess-derived event, without
//                 racing execStream's async I/O (which cannot produce an
//                 event before the current synchronous call stack unwinds)
//   resume, resumeAction  resume mode: resume_* terminal events instead of
//                 stage_*, " (resume)" appended to the announce line, and
//                 resumeAction echoed back via onTerminal's info for the
//                 caller's own appendResumeAttempt-equivalent bookkeeping
export function runSpawnedJob({
  id,
  cmd,
  args,
  cwd,
  env,
  announceLine,
  stage,
  onEvent,
  onTerminal,
  terminalData = false,
  stampAnnounceTs = false,
  afterAnnounce = null,
  resume = false,
  resumeAction = null,
}) {
  onEvent({
    type: "stage_started",
    stage,
    line: resume ? `${announceLine} (resume)` : announceLine,
    ...(stampAnnounceTs ? { ts: new Date().toISOString() } : {}),
  });
  if (afterAnnounce) afterAnnounce();

  execStream(cmd, args, { cwd, env, meta: { runId: id, stage }, onEvent })
    .then((result) => {
      const status = result.code === 0 ? "done" : "failed";
      const doneType = resume ? "resume_done" : "stage_done";
      const failType = resume ? "resume_failed" : "stage_failed";
      const line = `exit ${result.code}`;
      onEvent({
        type: status === "done" ? doneType : failType,
        stage,
        level: status === "done" ? "info" : "error",
        line,
        ...(terminalData ? { data: { code: result.code, signal: result.signal || null } } : {}),
      });
      onTerminal(status, { code: result.code, signal: result.signal || null, line, result, resumeAction });
    })
    .catch((error) => {
      const line = error?.message || String(error);
      onEvent({ type: resume ? "resume_failed" : "stage_failed", stage, level: "error", line });
      onTerminal("failed", { code: 1, signal: null, line, error, resumeAction });
    });

  return id;
}

// The shared daemon-first/fallback ordering: try the injected daemonSubmit;
// on connection failure, mint a local id, register it with the injected
// sinks, emit the fallback-warning trace, and run the child locally via
// runSpawnedJob. Everything console-specific — the 600ms daemon client, the
// SQLite job-store, the in-memory buffer/listener fan-out, the jobSeq id
// counter, the "bun" spawn target, and the fallback wording itself — is
// supplied by the caller (apps/console/src/server/transport/jobs.mjs, via
// factory-core.mjs's re-export); this module owns only the ordering.
//
//   daemonSubmit(argv, command) -> Promise<{ id }>   the daemon POST attempt
//   mintId() -> string                                local-fallback id minting
//   spawnBinding { cmd, args(argv), cwd, env, stage, announceLine(argv) }
//                                                      the local spawn target
//   sinks {
//     create(id, argv, command) -> Promise            persist the job record
//                                                      (called for BOTH the
//                                                      daemon-submitted id and
//                                                      the local-fallback id)
//     registerLocal(id, argv, command) -> job          register the live,
//                                                      in-memory job handle
//                                                      (buffer + listeners)
//     push(job, event) -> void                         append + fan out one
//                                                      event for a local job
//     finish(job, id, status, info) -> Promise|void     terminal persistence
//   }
//
// Returns { id, daemon: true } on daemon success, or { id, daemon: false }
// once the local spawn has been started (fire-and-forget, matching
// runSpawnedJob's own synchronous-return contract).
//
// The returned submit function also takes per-call options:
//   extraLocalTrace(push) -> void   invoked once, after the fallback-warning
//                                    event, only on the local-fallback path —
//                                    lets the caller push its own trace
//                                    events (e.g. jobs.mjs's preflight trace)
//                                    into the same buffered/persisted stream
//                                    without this module knowing about them
//   onFallback(error, id) -> void   invoked once the daemon submit has failed
//                                    and the local id has been minted — for
//                                    caller-side logging/telemetry only, no
//                                    persistence effect
export function createLocalJobSubmit({ daemonSubmit, mintId, spawnBinding, sinks }) {
  return async function submitLocalJob(argv, command, { extraLocalTrace = null, onFallback = null } = {}) {
    let daemonSubmitError = null;
    try {
      const run = await daemonSubmit(argv, command);
      await sinks.create(run.id, argv, command);
      return { id: run.id, daemon: true };
    } catch (error) {
      daemonSubmitError = error;
    }

    const id = mintId();
    if (onFallback) onFallback(daemonSubmitError, id);
    const job = sinks.registerLocal(id, argv, command);
    await sinks.create(id, argv, command);

    const push = (event) => sinks.push(job, event);
    const reason = daemonSubmitError?.message || String(daemonSubmitError);

    runSpawnedJob({
      id,
      cmd: spawnBinding.cmd,
      args: spawnBinding.args(argv),
      cwd: spawnBinding.cwd,
      env: spawnBinding.env,
      announceLine: spawnBinding.announceLine(argv),
      stage: spawnBinding.stage,
      onEvent: push,
      onTerminal: (status, info) => sinks.finish(job, id, status, info),
      terminalData: false,
      stampAnnounceTs: true,
      afterAnnounce: () => {
        push({ type: "log", level: "warn", line: `Daemon unavailable; running this job locally instead — ${reason}`, data: { fellBackToLocal: true } });
        if (extraLocalTrace) extraLocalTrace(push);
      },
    });

    return { id, daemon: false };
  };
}
