// Contract tests for the LiveTranscript — the one behavioral artifact every
// live surface shares. The chunk-folding fixtures mirror the wire shape
// verified live in tests/e2e/stream-assist.e2e.test.mjs.
import { test, expect } from "bun:test";
import {
  foldTurnChunks,
  buildTranscript,
  withVerdict,
  validateTranscript,
  sessionThreadingBreaks,
  chunkTextDelta,
} from "./transcript.mjs";
import { liveError } from "./errors.mjs";

const reply = (text) => ({ groundedContent: { content: { text } } });

const TURN_CHUNKS = [
  { atMs: 0, json: { answer: { state: "IN_PROGRESS", replies: [] } } },
  { atMs: 412, json: { answer: { state: "IN_PROGRESS", replies: [reply("Yes, you may ")] } } },
  { atMs: 610, json: { answer: { state: "IN_PROGRESS", replies: [reply("be eligible.")] }, invocationTools: ["lookup_life_events"] } },
  { atMs: 1240, json: { answer: { state: "SUCCEEDED" }, sessionInfo: { session: "projects/p/sessions/abc" }, assistToken: "tok-1" } },
];

test("foldTurnChunks accumulates text, state, session, token, and timings", () => {
  const turn = foldTurnChunks({ index: 0, userText: "Can I change plans?", chunks: TURN_CHUNKS, sessionBefore: null });
  expect(turn.assistant.text).toBe("Yes, you may be eligible.");
  expect(turn.assistant.state).toBe("SUCCEEDED");
  expect(turn.sessionBefore).toBe(null);
  expect(turn.sessionAfter).toBe("projects/p/sessions/abc");
  expect(turn.assistToken).toBe("tok-1");
  expect(turn.invocationTools).toEqual(["lookup_life_events"]);
  expect(turn.stream.ttftMs).toBe(412); // first chunk carrying text, not the first chunk
  expect(turn.stream.fullResponseMs).toBe(1240);
  expect(turn.stream.maxInterChunkGapMs).toBe(630); // 1240 - 610
});

test("foldTurnChunks with no text keeps ttft null", () => {
  const turn = foldTurnChunks({ index: 0, userText: "hi", chunks: [{ atMs: 5, json: { answer: { state: "FAILED" } } }], sessionBefore: "s" });
  expect(turn.stream.ttftMs).toBe(null);
  expect(turn.assistant.state).toBe("FAILED");
  expect(turn.sessionAfter).toBe("s"); // no sessionInfo → session unchanged
});

test("chunkTextDelta joins multiple replies in one chunk", () => {
  expect(chunkTextDelta({ answer: { replies: [reply("a"), reply("b")] } })).toBe("ab");
});

const target = { project: "p", location: "global", engine: "projects/p/locations/global/collections/default_collection/engines/e", assistant: "default_assistant", expectedAgentId: null };

function transcriptOf(turns) {
  return buildTranscript({
    id: "t-1",
    target,
    runner: "cassette",
    replay: true,
    turns,
    responder: { expectedAgentId: null, observedAgentId: null, assertion: "not_applicable", evidence: [] },
    cassettePath: "fixtures/x.ndjson",
  });
}

test("buildTranscript produces a schema-valid replay transcript", () => {
  const turn = foldTurnChunks({ index: 0, userText: "q", chunks: TURN_CHUNKS, sessionBefore: null });
  const transcript = transcriptOf([turn]);
  const verdict = validateTranscript(transcript);
  expect(verdict.issues).toEqual([]);
  expect(verdict.ok).toBe(true);
  expect(transcript.session.name).toBe("projects/p/sessions/abc");
  expect(transcript.invocationTools).toEqual(["lookup_life_events"]);
  expect(transcript.raw.cassettePath).toBe("fixtures/x.ndjson");
});

test("validateTranscript rejects an invented shape with named issues", () => {
  const verdict = validateTranscript({ kind: "LiveTranscript", turns: "nope" });
  expect(verdict.ok).toBe(false);
  expect(verdict.issues.length).toBeGreaterThan(0);
});

test("withVerdict records blockers as live error shapes", () => {
  const turn = foldTurnChunks({ index: 0, userText: "q", chunks: TURN_CHUNKS, sessionBefore: null });
  const failed = withVerdict(transcriptOf([turn]), [liveError("GELIVE006", undefined, { fix: "ge drive --target-agent <id>" })]);
  expect(failed.verdict.ok).toBe(false);
  expect(failed.verdict.blockers[0].code).toBe("GELIVE006");
  expect(failed.verdict.blockers[0].retryable).toBe(false);
  expect(validateTranscript(failed).ok).toBe(true);
});

test("sessionThreadingBreaks flags a turn that dropped the session", () => {
  const t0 = foldTurnChunks({ index: 0, userText: "a", chunks: TURN_CHUNKS, sessionBefore: null });
  const threaded = foldTurnChunks({ index: 1, userText: "b", chunks: TURN_CHUNKS, sessionBefore: "projects/p/sessions/abc" });
  const dropped = foldTurnChunks({ index: 1, userText: "b", chunks: TURN_CHUNKS, sessionBefore: null });
  expect(sessionThreadingBreaks([t0, threaded])).toEqual([]);
  expect(sessionThreadingBreaks([t0, dropped])).toEqual([1]);
});
