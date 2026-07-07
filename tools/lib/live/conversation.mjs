// The conversation driver — run a multi-turn conversation through any runner
// (live assist surface or cassette replay) and fold the result into the one
// shared LiveTranscript.
//
// Two consumption styles over the same state machine:
//   createConversationSession() — incremental, one turn at a time (interactive
//                                 drive: send, render footer, repeat)
//   runConversation()           — scripted, all turns up front (live proof,
//                                 load runs, replays)
//
// Session-threading invariant (enforced, not assumed): each turn's request
// carries the session the previous turn's final response handed back. The
// runner only executes turns; threading, responder assertion, and transcript
// assembly live here so every surface gets them identically.
import { foldTurnChunks, buildTranscript, sessionThreadingBreaks, withVerdict } from "./transcript.mjs";
import { assertResponder, responderVerdict } from "./responder.mjs";
import { createTraceRecorder, recordTurnSpan } from "./otel-spans.mjs";
import { liveError } from "./errors.mjs";

let transcriptCounter = 0;

export function nextTranscriptId(prefix = "transcript") {
  transcriptCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${transcriptCounter}`;
}

export function createConversationSession(runner, {
  target,
  id = nextTranscriptId(),
  expectedAgentId = target?.expectedAgentId ?? null,
  strictResponder = false,
  startedAt = null,
  trace = createTraceRecorder(),
} = {}) {
  const transcriptTurns = [];
  const allChunks = [];
  let session = null;
  // The conversation root span; every turn is a CLIENT child. Recorded in
  // OTLP/JSON shape (see otel-spans.mjs) and folded into transcript.trace —
  // this is what makes a drive/prove run correlatable as a trace instead of
  // only wall-clock numbers in bespoke JSON.
  const rootSpan = trace.startSpan("ge.live.conversation", {
    attributes: {
      "gen_ai.system": "gemini-enterprise",
      "ge.transcript.id": id,
      "ge.runner.kind": runner.kind || "unknown",
      ...(target?.engine ? { "ge.target.engine": target.engine } : {}),
      ...(target?.assistant ? { "ge.target.assistant": target.assistant } : {}),
    },
  });

  return {
    id,
    trace,
    get session() {
      return session;
    },
    get turns() {
      return transcriptTurns;
    },
    // Run one user turn; returns the folded transcript turn.
    async turn(text) {
      const index = transcriptTurns.length;
      const turnStartMs = Date.now();
      const { chunks } = await runner.runTurn({ index, text, session });
      const folded = foldTurnChunks({ index, userText: text, chunks, sessionBefore: session });
      recordTurnSpan(trace, { parent: rootSpan, turn: folded, turnStartMs, endTimeMs: Date.now() });
      transcriptTurns.push(folded);
      allChunks.push(...chunks);
      session = folded.sessionAfter;
      return folded;
    },
    // Responder assertion over everything streamed so far (drive's per-turn
    // footer wants a live read, not just the end-of-run verdict).
    responderSoFar() {
      return assertResponder({ expectedAgentId, chunks: allChunks });
    },
    // Close out: assert threading + responder policy, build the transcript.
    finish() {
      const responder = assertResponder({ expectedAgentId, chunks: allChunks });
      const blockers = [];

      const breaks = sessionThreadingBreaks(transcriptTurns);
      if (breaks.length) {
        blockers.push(liveError("GELIVE005", `session threading broke at turn(s) ${breaks.join(", ")}`, {
          where: `transcript ${id}`,
          why: "a follow-up turn was not sent with the session the previous final response returned",
          fix: "ge drive --record-cassette <path> to capture a reproducible transcript, then file it",
        }));
      }
      const failedTurn = transcriptTurns.find((turn) => turn.assistant.state === "FAILED");
      if (failedTurn) {
        blockers.push(liveError("GELIVE004", `assist call failed at turn ${failedTurn.index} (state FAILED)`, {
          where: `transcript ${id}, turn ${failedTurn.index}`,
          why: "the assist surface reported a terminal FAILED state for the answer",
          fix: "retry the turn; if it keeps failing, ge doctor to check the live target",
          retryable: true,
        }));
      }
      const verdict = responderVerdict(responder.assertion, { strict: strictResponder });
      if (!verdict.ok) {
        blockers.push(liveError("GELIVE006", responder.assertion === "unknown"
          ? "responder identity could not be verified (strict run)"
          : `responder mismatched: expected ${responder.expectedAgentId}, observed ${responder.observedAgentId}`, {
          where: `transcript ${id}`,
          why: responder.assertion === "unknown"
            ? "the stream carried no identity evidence and --strict-responder treats unverifiable identity as failure"
            : "identity evidence in the stream names a different agent than the one under test",
          fix: responder.assertion === "unknown" ? "re-run without --strict-responder, or enable richer response metadata on the engine" : "check the engine's agent registration and the configured --target-agent id",
        }));
      }

      rootSpan.end({
        attributes: {
          "ge.turns": transcriptTurns.length,
          "ge.responder.assertion": responder.assertion,
          "ge.blockers": blockers.length,
        },
        status: blockers.length ? "STATUS_CODE_ERROR" : "STATUS_CODE_OK",
        ...(blockers.length ? { statusMessage: blockers[0].what || String(blockers[0].message || blockers[0]) } : {}),
      });

      const transcript = withVerdict(
        buildTranscript({
          id,
          target,
          runner: runner.kind === "cassette" ? "cassette" : "streamassist",
          replay: runner.kind === "cassette",
          turns: transcriptTurns,
          responder,
          startedAt,
          cassettePath: runner.path,
          trace: { traceId: trace.traceId, spans: trace.spans() },
        }),
        blockers,
      );
      return { transcript, blockers, responderWarning: verdict.warning };
    },
  };
}

// turns: [{ text }] — the user side of the conversation, scripted up front.
// Returns { transcript, blockers, responderWarning }.
export async function runConversation(runner, turns, { onTurn = () => {}, ...options } = {}) {
  const session = createConversationSession(runner, options);
  for (const { text } of turns) onTurn(await session.turn(text));
  return session.finish();
}
