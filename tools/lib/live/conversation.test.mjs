// Conversation-driver contract over cassette replay: session threading is
// enforced turn to turn, responder policy folds into blockers, and the result
// is always one schema-valid LiveTranscript.
import { test, expect } from "bun:test";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runConversation } from "./conversation.mjs";
import { createCassetteRunner } from "./cassette.mjs";
import { validateTranscript } from "./transcript.mjs";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const TARGET = {
  project: "demo",
  location: "global",
  engine: "projects/demo/locations/global/collections/default_collection/engines/benefits-engine",
  assistant: "default_assistant",
  expectedAgentId: null,
};

const TURNS = [{ text: "Can I change my plan after having a child?" }, { text: "How many days do I have?" }];

test("success cassette: threaded, verdict ok, schema-valid transcript", async () => {
  const runner = createCassetteRunner(join(FIXTURES, "success.ndjson"));
  const { transcript, blockers } = await runConversation(runner, TURNS, {
    target: { ...TARGET, expectedAgentId: "agent-benefits" },
    id: "t-success",
  });
  expect(blockers).toEqual([]);
  expect(transcript.verdict.ok).toBe(true);
  expect(transcript.responder.assertion).toBe("matched");
  expect(transcript.session.name).toContain("/sessions/abc123");
  expect(transcript.session.continued).toBe(true);
  expect(transcript.turns[1].sessionBefore).toBe(transcript.turns[0].sessionAfter);
  expect(transcript.invocationTools).toEqual(["lookup_life_events", "check_enrollment_window"]);
  expect(transcript.source).toEqual({ runner: "cassette", replay: true });
  expect(validateTranscript(transcript).issues).toEqual([]);
});

test("responder mismatch cassette: GELIVE006 blocker, verdict fails", async () => {
  const runner = createCassetteRunner(join(FIXTURES, "responder-mismatch.ndjson"));
  const { transcript, blockers } = await runConversation(runner, [TURNS[0]], {
    target: { ...TARGET, expectedAgentId: "agent-benefits" },
  });
  expect(blockers.map((blocker) => blocker.code)).toEqual(["GELIVE006"]);
  expect(transcript.verdict.ok).toBe(false);
  expect(transcript.responder.assertion).toBe("mismatched");
  expect(transcript.responder.observedAgentId).toBe("agent-payroll");
});

test("stream failure cassette: FAILED terminal state becomes a retryable blocker", async () => {
  const runner = createCassetteRunner(join(FIXTURES, "stream-failure.ndjson"));
  const { transcript, blockers } = await runConversation(runner, [TURNS[0]], { target: TARGET });
  expect(blockers.map((blocker) => blocker.code)).toEqual(["GELIVE004"]);
  expect(blockers[0].retryable).toBe(true);
  expect(transcript.turns[0].assistant.state).toBe("FAILED");
});

test("strict responder turns unknown identity into a blocker", async () => {
  // stream-failure fixture carries no identity metadata at all.
  const runner = createCassetteRunner(join(FIXTURES, "stream-failure.ndjson"));
  const strict = await runConversation(runner, [TURNS[0]], {
    target: { ...TARGET, expectedAgentId: "agent-benefits" },
    strictResponder: true,
  });
  expect(strict.blockers.some((blocker) => blocker.code === "GELIVE006")).toBe(true);
  const lax = await runConversation(createCassetteRunner(join(FIXTURES, "stream-failure.ndjson")), [TURNS[0]], {
    target: { ...TARGET, expectedAgentId: "agent-benefits" },
  });
  expect(lax.blockers.some((blocker) => blocker.code === "GELIVE006")).toBe(false);
  expect(lax.responderWarning).toContain("could not be verified");
});

test("slow cassette preserves recorded latency in the transcript", async () => {
  const runner = createCassetteRunner(join(FIXTURES, "slow-ttft.ndjson"));
  const { transcript } = await runConversation(runner, [TURNS[0]], { target: TARGET });
  expect(transcript.turns[0].stream.ttftMs).toBe(4200);
  expect(transcript.turns[0].stream.maxInterChunkGapMs).toBe(4200);
  expect(transcript.turns[0].stream.fullResponseMs).toBe(7700);
});
