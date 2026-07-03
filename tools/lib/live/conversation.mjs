// The conversation driver — run a scripted multi-turn conversation through
// any runner (live assist surface or cassette replay) and fold the result
// into the one shared LiveTranscript.
//
// Session-threading invariant (enforced, not assumed): each turn's request
// carries the session the previous turn's final response handed back. The
// runner only executes turns; threading, responder assertion, and transcript
// assembly live here so every surface gets them identically.
import { foldTurnChunks, buildTranscript, sessionThreadingBreaks, withVerdict } from "./transcript.mjs";
import { assertResponder, responderVerdict } from "./responder.mjs";
import { liveError } from "./errors.mjs";

let transcriptCounter = 0;

export function nextTranscriptId(prefix = "transcript") {
  transcriptCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${transcriptCounter}`;
}

// turns: [{ text }] — the user side of the conversation.
// Returns { transcript, blockers } — blockers are the transport-level live
// errors (threading, responder) that the caller folds into its verdict.
export async function runConversation(runner, turns, {
  target,
  id = nextTranscriptId(),
  expectedAgentId = target?.expectedAgentId ?? null,
  strictResponder = false,
  startedAt = null,
  onTurn = () => {},
} = {}) {
  const transcriptTurns = [];
  const allChunks = [];
  let session = null;
  for (let index = 0; index < turns.length; index += 1) {
    const text = turns[index].text;
    const { chunks } = await runner.runTurn({ index, text, session });
    const folded = foldTurnChunks({ index, userText: text, chunks, sessionBefore: session });
    transcriptTurns.push(folded);
    allChunks.push(...chunks);
    session = folded.sessionAfter;
    onTurn(folded);
  }

  const responder = assertResponder({ expectedAgentId, chunks: allChunks });
  const blockers = [];

  const breaks = sessionThreadingBreaks(transcriptTurns);
  if (breaks.length) {
    blockers.push(liveError("GELIVE005", `session threading broke at turn(s) ${breaks.join(", ")}`, {
      where: `transcript ${id}`,
      why: "a follow-up turn was not sent with the session the previous final response returned",
      fix: "retry the run; if it persists the assist surface is not continuing sessions",
    }));
  }
  const failedTurn = transcriptTurns.find((turn) => turn.assistant.state === "FAILED");
  if (failedTurn) {
    blockers.push(liveError("GELIVE004", `assist call failed at turn ${failedTurn.index} (state FAILED)`, {
      where: `transcript ${id}, turn ${failedTurn.index}`,
      why: "the assist surface reported a terminal FAILED state for the answer",
      fix: "retry the turn; check the engine's logs if the failure repeats",
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
    }),
    blockers,
  );
  return { transcript, blockers, responderWarning: verdict.warning };
}
