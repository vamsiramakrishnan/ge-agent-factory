import { mkdirSync, appendFileSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { makeEvent, splitLines } from "../../../tools/lib/events.mjs";
import { writeJson } from "@ge/std/json-io";

// A per-(run,stage) journal writer. Returns { log(stream, text), event(ev) }.
export function openJournal(runsDir, { runId, agentId, stage }) {
  const file = join(runsDir, runId, `${stage}.ndjson`);
  mkdirSync(dirname(file), { recursive: true });
  const splitters = { stdout: splitLines(), stderr: splitLines() };
  // Journal writes are best-effort (never fail the run), but dropped events were
  // previously invisible. Warn once per journal so a full disk / permission
  // problem is diagnosable without emitting one warning per log line.
  let appendFailureWarned = false;
  const write = (ev) => {
    try { appendFileSync(file, JSON.stringify(ev) + "\n"); } catch (error) {
      if (!appendFailureWarned) {
        appendFailureWarned = true;
        console.warn(`[harness-journal] journal append failed for ${file} (later failures for this journal are suppressed) — ${error?.message || String(error)}`);
      }
    }
  };
  return {
    file,
    log(stream, text) { for (const line of splitters[stream].push(String(text))) write(makeEvent({ runId, agentId, stage, type: "log", level: stream === "stderr" ? "warn" : "info", line, data: { stream } })); },
    event(partial) { write(makeEvent({ runId, agentId, stage, ...partial })); },
  };
}

// Upsert a run record into runs/index.json (best-effort).
export function recordRun(runsDir, record) {
  const idx = join(runsDir, "index.json");
  let all = [];
  try { if (existsSync(idx)) all = JSON.parse(readFileSync(idx, "utf8")); } catch (error) {
    // Behaviour-preserving: a corrupt/unreadable index still resets to []. But the
    // write below then OVERWRITES the file with only this record, dropping every
    // previously recorded run — so surface why before that data loss happens.
    console.warn(`[harness-journal] run index ${idx} unreadable; resetting (prior run records will be overwritten) — ${error?.message || String(error)}`);
  }
  const i = all.findIndex((r) => r.runId === record.runId && r.stage === record.stage);
  if (i >= 0) all[i] = { ...all[i], ...record }; else all.push(record);
  try { writeJson(idx, all); } catch (error) {
    // The run record never reaches runs/index.json, so the run silently won't appear
    // in listings. Best-effort write is unchanged; just make the loss observable.
    console.warn(`[harness-journal] failed to persist run record (${record.runId}/${record.stage}) to ${idx} — ${error?.message || String(error)}`);
  }
}
