// Cassettes — recorded live-assist streams, replayable byte-for-byte.
//
// A cassette is NDJSON, one record per line, in stream order:
//   {"type":"meta","version":1,"target":{…},"recordedAt":"…"}
//   {"type":"request","turn":0,"session":null,"body":{"query":{"text":"…"}}}
//   {"type":"chunk","turn":0,"atMs":0,"json":{…StreamAssistResponse…}}
//   {"type":"chunk","turn":0,"atMs":412,"json":{…}}
//   {"type":"request","turn":1,"session":"projects/…/sessions/abc","body":{…}}
//
// atMs offsets are preserved from the recording, so replay reproduces the
// original time-to-first-text and inter-chunk gaps deterministically — which
// is what lets the latency-budget machinery be tested with zero cloud calls.
// Cassettes are the default execution target for every live test in CI; real
// traffic is the explicit opt-in.
import { readFileSync, writeFileSync, mkdirSync, appendFileSync } from "node:fs";
import { dirname } from "node:path";
import { liveError } from "./errors.mjs";

export const CASSETTE_VERSION = 1;

export function parseCassette(text, { path = "<inline>" } = {}) {
  const lines = String(text).split("\n").filter((line) => line.trim().length);
  let meta = null;
  const turns = [];
  lines.forEach((line, lineNo) => {
    let record;
    try {
      record = JSON.parse(line);
    } catch (cause) {
      throw liveError("GELIVE004", `cassette line ${lineNo + 1} is not valid JSON`, {
        where: path,
        why: cause?.message || String(cause),
        fix: `re-record the cassette (ge drive --record-cassette ${path})`,
        cause,
      });
    }
    if (record.type === "meta") {
      meta = record;
    } else if (record.type === "request") {
      turns[record.turn] = { request: record, chunks: [] };
    } else if (record.type === "chunk") {
      if (!turns[record.turn]) {
        throw liveError("GELIVE004", `cassette chunk for turn ${record.turn} appears before its request`, {
          where: `${path}:${lineNo + 1}`,
          why: "cassette records must arrive in stream order: request, then its chunks",
          fix: `re-record the cassette (ge drive --record-cassette ${path})`,
        });
      }
      turns[record.turn].chunks.push({ atMs: record.atMs ?? 0, json: record.json });
    }
    // Unknown record types are skipped on purpose: future recorders may add
    // annotation records and old readers must keep replaying.
  });
  if (!meta) {
    throw liveError("GELIVE004", "cassette has no meta record", {
      where: path,
      why: "the first line of a cassette names its version and target",
      fix: `re-record the cassette (ge drive --record-cassette ${path})`,
    });
  }
  const missing = turns.findIndex((turn) => !turn);
  if (missing >= 0) {
    throw liveError("GELIVE004", `cassette is missing turn ${missing}`, {
      where: path,
      why: "turns must be contiguous from 0",
      fix: `re-record the cassette (ge drive --record-cassette ${path})`,
    });
  }
  return { meta, turns, path };
}

export function readCassette(path) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch (cause) {
    throw liveError("GELIVE004", `cassette not found: ${path}`, {
      where: path,
      why: "the cassette file does not exist or is unreadable",
      fix: "record one first: ge drive --record-cassette <path>",
      cause,
    });
  }
  return parseCassette(text, { path });
}

// Streaming recorder — append records as the live stream arrives, so a
// crashed run still leaves a usable prefix on disk.
export function createCassetteRecorder(path, { target, recordedAt } = {}) {
  mkdirSync(dirname(path), { recursive: true });
  // A cassette is an append-only NDJSON stream (one record per line), not a
  // JSON state file — truncate, then append every record including the meta.
  writeFileSync(path, "");
  const append = (record) => appendFileSync(path, JSON.stringify(record) + "\n");
  append({ type: "meta", version: CASSETTE_VERSION, target: target || null, recordedAt: recordedAt || new Date().toISOString() });
  return {
    path,
    request(turn, session, body) {
      append({ type: "request", turn, session: session ?? null, body });
    },
    chunk(turn, atMs, json) {
      append({ type: "chunk", turn, atMs, json });
    },
  };
}

// Replay runner — the cassette-backed implementation of the one runner
// interface every live surface drives:
//   { kind, meta, turnCount, async runTurn({ index, text, session }) → { chunks, request }, close() }
//
// `loop: true` wraps turn indexes module the recording length (bench replays a
// short cassette across many synthetic sessions). Replay is deterministic:
// recorded chunks and offsets come back verbatim, regardless of wall clock.
export function createCassetteRunner(pathOrParsed, { loop = false } = {}) {
  const cassette = typeof pathOrParsed === "string" ? readCassette(pathOrParsed) : pathOrParsed;
  return {
    kind: "cassette",
    meta: cassette.meta,
    path: cassette.path,
    turnCount: cassette.turns.length,
    async runTurn({ index }) {
      let turn = cassette.turns[loop ? index % cassette.turns.length : index];
      if (!turn) {
        throw liveError("GELIVE004", `cassette has no turn ${index} (recorded turns: ${cassette.turns.length})`, {
          where: cassette.path || "<inline>",
          why: "the conversation script has more turns than the recording",
          fix: "re-record a longer cassette, or trim the script to the recorded turns",
        });
      }
      return { chunks: turn.chunks, request: turn.request };
    },
    close() {},
  };
}
