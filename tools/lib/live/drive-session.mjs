// Drive orchestration — the core behind `ge drive` (CLI), the console Drive
// view, and the MCP drive tool. Returns data / throws DxError; rendering
// stays at the surfaces.
//
// A drive session talks to exactly one of:
//   - the deployed assist surface (resolved LiveTarget, ADC auth), optionally
//     recording a cassette as it goes
//   - a cassette replay (deterministic, zero cloud) — the default in tests
import { statePath, relativeToRepo } from "../state-paths.mjs";
import { writeJson } from "@ge/std/json-io";
import { resolveLiveTarget } from "./target.mjs";
import { createCassetteRunner, createCassetteRecorder, readCassette } from "./cassette.mjs";
import { createLiveRunner } from "./streamassist-client.mjs";
import { createConversationSession, runConversation, nextTranscriptId } from "./conversation.mjs";
import { appendRecordedCase } from "../evals/evalset.mjs";
import { liveError } from "./errors.mjs";

// Resolve the execution side of a drive: runner + target (+ the recorded
// user turns when replaying, so a bare `ge drive --cassette f` can replay the
// original conversation without a script).
export async function prepareDrive(cfg, { cassette, recordCassette, targetAgent, loop = false } = {}) {
  if (cassette) {
    const parsed = readCassette(cassette);
    const runner = createCassetteRunner(parsed, { loop });
    const metaTarget = parsed.meta.target || {};
    const target = {
      project: metaTarget.project || cfg?.project,
      location: metaTarget.location || cfg?.geLocation || "global",
      engine: metaTarget.engine || cfg?.geAppId || "<recorded>",
      assistant: metaTarget.assistant || "default_assistant",
      expectedAgentId: targetAgent ?? null,
    };
    const recordedTurns = parsed.turns.map((turn) => turn.request?.body?.query?.text).filter(Boolean);
    return { runner, target, recordedTurns };
  }
  const target = resolveLiveTarget(cfg, { expectedAgentId: targetAgent ?? null });
  const recorder = recordCassette ? createCassetteRecorder(recordCassette, { target: { project: target.project, location: target.location, engine: target.engine, assistant: target.assistant } }) : null;
  const runner = await createLiveRunner(target, { recorder });
  return { runner, target, recordedTurns: [] };
}

// `dir` is injectable so tests (and callers with their own state root) never
// depend on the module-load-time GE_STATE_ROOT resolution in state-paths.
export function transcriptPathFor(id, { dir = statePath("transcripts") } = {}) {
  return `${dir}/${id}.json`;
}

export function saveTranscript(transcript, { dir } = {}) {
  const path = transcriptPathFor(transcript.id, dir ? { dir } : {});
  writeJson(path, transcript);
  return relativeToRepo(path);
}

// Append the driven conversation to an evalset as a new case. The assistant's
// answers are recorded as reference responses (that is what makes the case
// gradeable later); stream/timing detail stays in the transcript, which the
// case links by id — the evalset must not become a timing dump.
export function recordTranscriptAsEvalCase(transcript, { evalsetPath, caseId }) {
  const id = caseId || transcript.id.replace(/^transcript-/, "recorded-");
  return appendRecordedCase(evalsetPath, {
    caseId: id,
    turns: transcript.turns.map((turn) => ({ user: turn.user.text, reference: turn.assistant.text || null })),
    metadata: {
      source: "ge drive",
      session: transcript.session.name,
      transcript: transcript.id,
      responder: transcript.responder.assertion,
    },
  });
}

// Scripted (non-interactive) drive: the shared path for --script, --json,
// replay, console, and MCP. Interactive TTY drive uses
// createConversationSession directly and shares everything else.
export async function runDrive(cfg, {
  turns,
  cassette,
  recordCassette,
  record,
  recordId,
  targetAgent,
  strictResponder = false,
  onTurn = () => {},
} = {}) {
  const { runner, target, recordedTurns } = await prepareDrive(cfg, { cassette, recordCassette, targetAgent });
  const scriptTurns = (turns && turns.length ? turns : recordedTurns).map((text) => ({ text }));
  if (!scriptTurns.length) {
    throw liveError("GELIVE004", "nothing to drive: no script turns and the cassette recorded none", {
      where: cassette || "script",
      why: "a non-interactive drive needs user turns from --script, or a cassette with recorded requests",
      fix: "ge drive --script <turns.txt> (one user turn per line)",
    });
  }
  try {
    const result = await runConversation(runner, scriptTurns, {
      target,
      id: nextTranscriptId("drive"),
      strictResponder,
      startedAt: new Date().toISOString(),
      onTurn,
    });
    const transcriptPath = saveTranscript(result.transcript);
    const recorded = record ? recordTranscriptAsEvalCase(result.transcript, { evalsetPath: record, caseId: recordId }) : null;
    return {
      ok: result.transcript.verdict.ok,
      transcript: result.transcript,
      transcriptPath,
      recorded,
      responderWarning: result.responderWarning,
      target,
    };
  } finally {
    await runner.close?.();
  }
}
