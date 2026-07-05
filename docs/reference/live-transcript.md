---
title: Live transcript
parent: Reference
nav_order: 10
layout: default
description: The LiveTranscript artifact — the one behavioral record every live surface produces and consumes; field-by-field reference for target, source, session, responder, turns, timings, and verdict.
---

# Live transcript

The **LiveTranscript** is the one behavioral artifact shared by every live
surface. `ge drive`, `ge prove --live`, `ge bench`, cassette replay, the
console's live views, and the MCP (Model Context Protocol) live tools all
produce and consume this shape (schema: `tools/lib/live/transcript.mjs`,
`apiVersion: ge.dev/v1`, `kind: LiveTranscript`). If two live features ever
needed different transcript shapes, the abstraction would be wrong — the
design rule is to extend this one.

The wire shape mirrors what the Discovery Engine AssistantService streams:
each chunk is a `StreamAssistResponse`, answer text accumulates from
`replies[].groundedContent.content.text` while `answer.state` is
`IN_PROGRESS`, terminating at `SUCCEEDED` / `FAILED` / `SKIPPED`. The
transcript *folds* those chunks down to what each contributed; raw chunk JSON
stays in the cassette, not the transcript, to keep transcripts readable.

## Where transcripts are written

`.ge/transcripts/<id>.json`, one file per driven conversation. Ids are
prefixed by their producer: `drive-…` from `ge drive`,
`prove-<evalset>-<case>` from `ge prove --live`. (`GE_STATE_ROOT` relocates
the `.ge` tree as usual.)

## Top-level fields

| Field | Type | Meaning |
| --- | --- | --- |
| `apiVersion`, `kind` | literals | `"ge.dev/v1"`, `"LiveTranscript"`. |
| `id` | string | Transcript id; also the filename. |
| `target` | object | What was driven: `project?`, `location`, `engine` (full resource name), `assistant`, `expectedAgentId?` (null unless `--target-agent` was given). |
| `source` | object | How: `runner` is `"streamassist"` (live) or `"cassette"` (replay); `replay` is the boolean twin. |
| `session` | object | `name` — the live session after the last turn (null if none was returned); `continued` — whether the conversation spanned multiple turns. |
| `responder` | object | The identity assertion: `expectedAgentId`, `observedAgentId`, `assertion` (`matched` / `mismatched` / `unknown` / `not_applicable`), and the `evidence` strings the assertion was made from. |
| `turns` | array | One record per conversation turn — see below. |
| `timings` | object | `startedAt` (ISO timestamp or null) and `totalMs` — the sum of per-turn full-response times. |
| `invocationTools` | string[] | Deduplicated union of every tool the stream surfaced across turns. |
| `verdict` | object? | `ok` plus `blockers[]` (structured what/where/why/fix errors with `GELIVE` codes). Attached when the producer verdicts the run (`ge drive`, `ge prove --live`). |
| `raw` | object? | Archaeology: `cassettePath?` (when recorded/replayed) and `assistTokens?`. |

## Per-turn fields (`turns[]`)

| Field | Type | Meaning |
| --- | --- | --- |
| `index` | number | 0-based turn index. |
| `user` | object | `text` (and optional `at` timestamp) of the user turn. |
| `assistant` | object | `text` — the accumulated answer; `state?` — the terminal stream state (`SUCCEEDED` / `FAILED` / `SKIPPED`). |
| `stream.chunks` | array | Folded chunks: `atMs` offset plus whatever the chunk contributed (`textDelta?`, `state?`, `session?`, `assistToken?`). |
| `stream.ttftMs` | number\|null | Time to first *text* — offset of the first chunk carrying answer text. |
| `stream.fullResponseMs` | number\|null | Offset of the last chunk — the full response time. |
| `stream.maxInterChunkGapMs` | number\|null | The worst stall between consecutive chunks. |
| `sessionBefore` / `sessionAfter` | string\|null | The session the turn was sent with, and the one the service handed back. Each turn after the first must be sent with the previous turn's `sessionAfter` — that is the session-threading invariant (`GELIVE005` when broken). |
| `assistToken` | string\|null | The assist token the stream returned, when any. |
| `invocationTools` | string[]? | Tools the stream surfaced for this turn. |
| `citations` | array? | Grounding references: `{ source, title?, uri? }`. |
| `errors` | array? | Structured live errors raised during the turn. |

The three latency numbers per turn (`ttftMs`, `fullResponseMs`,
`maxInterChunkGapMs`) are exactly the fields every surface reports — the
[drive footer](../cookbooks/drive-a-shipped-agent.html) renders them per
turn, and [`ge bench`](../cookbooks/bench-live-budgets.html) aggregates them
into percentiles against [budgets](live-budgets.html).

## Who consumes transcripts

- **`ge drive`** writes one per conversation and renders its verdict; with
  `--record`, the transcript's turns become an evalset case (user text +
  assistant text as the reference answer — timing detail stays in the
  transcript, linked by id).
- **`ge prove --live`** writes one per eval case, grades the GE-owned metric
  grid from it, and summarizes it into the conformance baseline
  (responder, threading, tool set, cited sources, timing classes, turn
  states). The case rows in `.ge/proof/eval-matrix.json` link each
  transcript by path.
- **`ge bench`** drives the same conversation machinery and aggregates the
  per-turn stream timings; the transcript shape is what makes one recording
  reusable across drive, proof, and load.
- **Cassettes** are the transcript's raw sibling: the unfolded stream
  (request bodies + verbatim chunks with `atMs` offsets), replayable
  byte-for-byte. A transcript produced from a replay records
  `source.replay: true` and `raw.cassettePath`.

## Validation

`validateTranscript(candidate)` (same module) parses against the zod schema
and returns `{ ok, transcript, issues }` — consumers reject malformed
transcripts with the exact field paths that failed.
