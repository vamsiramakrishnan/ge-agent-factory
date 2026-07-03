// tools/ge/drive.mjs — `ge drive`: talk to the shipped agent through the same
// streaming assist surface real users hit, with the instrumentation footer
// after every answer (time to first text, full response, chunks, max stall,
// session, responder identity, tools).
//
//   ge drive                                interactive chat (TTY)
//   ge drive --script turns.txt             scripted, one user turn per line
//   ge drive --cassette <path>              replay a recording (zero cloud)
//   ge drive --record evals/x.evalset.json  save the conversation as an eval case
//   ge drive --record-cassette <path>       record the live stream for replay
//   ge drive --json                         machine result (LiveTranscript)
//
// Interview captures intent into contracts. Drive captures behavior into
// evalsets.
import { readFileSync, existsSync } from "node:fs";
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core } from "./shared.mjs";
import { prepareDrive, runDrive, saveTranscript, recordTranscriptAsEvalCase } from "../lib/live/drive-session.mjs";
import { createConversationSession, nextTranscriptId } from "../lib/live/conversation.mjs";
import { DxError } from "../lib/errors/dx-error.mjs";

export function fmtMs(ms) {
  if (ms === null || ms === undefined) return "—";
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`;
}

export function shortSession(session) {
  if (!session) return "new";
  const parts = session.split("/");
  return parts.length > 2 ? `…/${parts.slice(-2).join("/")}` : session;
}

// The per-turn footer — one dim line, same fields on every surface.
export function turnFooter(turn, responder) {
  const parts = [
    `ttft ${fmtMs(turn.stream.ttftMs)}`,
    `full ${fmtMs(turn.stream.fullResponseMs)}`,
    `chunks ${turn.stream.chunks.length}`,
  ];
  if (turn.stream.maxInterChunkGapMs !== null) parts.push(`max gap ${fmtMs(turn.stream.maxInterChunkGapMs)}`);
  parts.push(`session ${shortSession(turn.sessionAfter)}`);
  if (responder) {
    parts.push(responder.assertion === "unknown" ? `responder unknown ${ui.glyph("warning")}` : `responder ${responder.assertion}`);
  }
  if (turn.invocationTools?.length) parts.push(`tools ${turn.invocationTools.length}`);
  return parts.join(" · ");
}

function readScriptTurns(path) {
  if (!existsSync(path)) {
    throw new DxError(`script not found: ${path}`, {
      where: path,
      why: "the --script file does not exist",
      fix: `printf 'Hello\\n' > ${path}  (one user turn per line)`,
    });
  }
  return readFileSync(path, "utf8").split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#"));
}

// GELIVE001 renders as a position screen, not a bare error: where the
// operator stands on capture → prove → handoff and the exact next command.
async function renderMissingTarget(error, cfg) {
  out(ui.title("Drive"));
  out(pc.dim("  ge drive talks to a deployed agent — no live target is recorded yet."));
  try {
    const gp = await core.goldenPathPosition(cfg, { haveConfig: !!cfg.project });
    if (gp?.stages?.length) {
      out(ui.section("Current position"));
      for (const stage of gp.stages) out(`  ${stage.done ? ui.glyph("passed") : ui.glyph("queued")} ${stage.id.padEnd(8)} ${pc.dim(stage.detail || "")}`);
    }
  } catch { /* best-effort: the position board is orientation, not required to explain the missing target */ }
  out(ui.kv([
    ["blocker", pc.red(error.what || error.message)],
    error.why && ["why", pc.dim(error.why)],
  ]));
  out(ui.next(error.fix || "ge init"));
}

function renderTurnBlock(turn, responder) {
  out(`${pc.bold("> ")}${turn.user.text}`);
  out(turn.assistant.text ? turn.assistant.text : pc.dim("(no answer text)"));
  out(pc.dim(`  ${turnFooter(turn, responder)}`));
  out("");
}

function renderDriveResult(result) {
  out(ui.kv([
    ["verdict", result.ok ? pc.green("ok") : pc.red("failed")],
    ["transcript", pc.dim(result.transcriptPath)],
    result.recorded && ["saved", `${ui.cmd(result.recorded.evalsetPath)}${pc.dim(`#${result.recorded.caseId}`)}`],
    result.responderWarning && ["warning", pc.yellow(result.responderWarning)],
  ]));
  if (!result.ok) {
    for (const blocker of result.transcript.verdict.blockers) {
      out(`  ${ui.glyph("failed")} ${pc.red(blocker.code || "")} ${blocker.what}`);
      if (blocker.fix) out(ui.fixLine(blocker.fix, 4));
    }
  }
  out(ui.next(result.recorded ? `ge prove --live --max-cases 1` : `ge drive --record evals/recorded.evalset.json`, result.recorded ? "prove the recorded case against the live surface" : "save the next conversation as an eval case"));
}

async function interactiveDrive(cfg, args) {
  const { runner, target } = await prepareDrive(cfg, {
    cassette: args.cassette,
    recordCassette: args.recordCassette,
    targetAgent: args.targetAgent,
    assistant: args.assistant,
  });
  out(ui.title("GE Drive", target.engine.split("/").at(-1)));
  out(pc.dim(`  target ${target.engine}`));
  out(pc.dim(`  you are talking to the ${args.cassette ? "recorded replay of the" : "shipped"} assist surface — ctrl-d or "exit" to finish\n`));
  const session = createConversationSession(runner, {
    target,
    id: nextTranscriptId("drive"),
    strictResponder: args.strictResponder,
    startedAt: new Date().toISOString(),
  });
  const readline = await import("node:readline/promises");
  const rl = readline.createInterface({ input: process.stdin, output: process.stderr });
  try {
    for (;;) {
      let text;
      try {
        text = await rl.question(pc.bold("> "));
      } catch {
        break; // best-effort: readline closes on ctrl-c/ctrl-d — both mean "finish the session", not an error
      }
      const trimmed = text.trim();
      if (!trimmed) continue;
      if (trimmed === "exit" || trimmed === "quit") break;
      const turn = await session.turn(trimmed);
      out(turn.assistant.text || pc.dim("(no answer text)"));
      out(pc.dim(`  ${turnFooter(turn, session.responderSoFar())}`));
    }
  } finally {
    rl.close();
    await runner.close?.();
  }
  if (!session.turns.length) {
    out(pc.dim("  nothing driven — no turns sent"));
    return;
  }
  const finished = session.finish();
  const transcriptPath = saveTranscript(finished.transcript);
  const recorded = args.record ? recordTranscriptAsEvalCase(finished.transcript, { evalsetPath: args.record, caseId: args.recordId }) : null;
  out("");
  renderDriveResult({ ok: finished.transcript.verdict.ok, transcript: finished.transcript, transcriptPath, recorded, responderWarning: finished.responderWarning });
  if (!finished.transcript.verdict.ok) process.exitCode = 1;
}

export const drive = defineCommand({
  meta: { name: "drive", description: "Talk to the shipped agent over its live assist surface — per-turn timing/responder footer; --record saves the conversation as an eval case" },
  args: {
    ...common,
    turns: { type: "string", description: "Drive non-interactively from inline turns (one user turn per line/newline) instead of --script — the transport for programmatic callers" },
    script: { type: "string", description: "Drive non-interactively: file with one user turn per line (# comments allowed)" },
    cassette: { type: "string", description: "Replay a recorded cassette instead of calling the live surface (no cloud, deterministic)" },
    record: { type: "string", description: "Append the driven conversation to this evalset as a new eval case" },
    recordId: { type: "string", description: "Case id to record under (default: derived from the transcript id)" },
    recordCassette: { type: "string", description: "Record the live stream to this cassette file for later replay" },
    targetAgent: { type: "string", description: "Expected responding agent id — responder identity is asserted against the stream" },
    assistant: { type: "string", description: "Assistant id on the engine (default default_assistant) — plug any deployed agent, factory-built or not" },
    strictResponder: { type: "boolean", description: "Fail when responder identity cannot be verified (default: warn)" },
    geApp: { type: "string", description: "Gemini Enterprise engine (full resource name or bare id; default from .ge.json geAppId)" },
  },
  run: guarded(async ({ args }) => {
    const cfg = cfgFrom(args);
    const scripted = args.script || args.json || (args.cassette && !process.stdin.isTTY) || !process.stdin.isTTY;
    try {
      if (!scripted && !args.turns) return await interactiveDrive(cfg, args);
      const turns = args.turns
        ? String(args.turns).split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#"))
        : args.script ? readScriptTurns(args.script) : [];
      const result = await runDrive(cfg, {
        turns,
        cassette: args.cassette,
        recordCassette: args.recordCassette,
        record: args.record,
        recordId: args.recordId,
        targetAgent: args.targetAgent,
        assistant: args.assistant,
        strictResponder: args.strictResponder,
        onTurn: args.json ? () => {} : (turn) => renderTurnBlock(turn),
      });
      emit(args, { ok: result.ok, transcript: result.transcript, transcriptPath: result.transcriptPath, recorded: result.recorded, responderWarning: result.responderWarning }, renderDriveResult);
      if (!result.ok) process.exitCode = 1;
    } catch (error) {
      if (error?.code === "GELIVE001" && !args.json) {
        await renderMissingTarget(error, cfg);
        process.exitCode = 1;
        return;
      }
      throw error;
    }
  }),
});
