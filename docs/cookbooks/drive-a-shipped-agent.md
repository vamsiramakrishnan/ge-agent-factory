---
title: Drive a shipped agent
parent: Guides
nav_order: 11
layout: default
description: Talk to the deployed agent through the same streaming assist surface real users hit — interactive or scripted, with a timing/responder footer per turn, recording conversations as eval cases and cassettes.
---

# Drive a shipped agent

**Scope:** live by default — talks to the deployed assist surface with your
application default credentials. Replay with `--cassette` is local-only, zero
cloud.

`ge drive` is the conversation end of [live proof](../concepts/live-proof.html):
you talk to the *deployed* agent through the same streaming assist surface real
users hit, and every answer arrives with an instrumentation footer — time to
first text, full response time, chunk count, worst stall, session, responder
identity, tool invocations. The interview captures intent into contracts;
drive captures behavior into evalsets.

## When to use this

- The agent shipped and you want to feel what users feel — with numbers.
- You need eval cases grounded in real conversations, not invented ones
  (`--record` turns a driven conversation into an evalset case).
- You need a deterministic recording of the live stream (`--record-cassette`)
  so live proof and load runs can execute offline later.
- You want to exercise *any* deployed agent — factory-built or not — by
  pointing `--ge-app` and `--assistant` at it.

## Prerequisites

- A deployed agent behind a Gemini Enterprise engine, and `geAppId` set in
  `.ge.json` (`ge init` discovers it; `ge config explain` shows where it came
  from). Or bring your own engine with `--ge-app`.
- Application default credentials for live turns:
  `gcloud auth application-default login`.
- Nothing at all for replay: `--cassette` needs no config and no credentials.

## Input artifact

None required — an interactive drive starts from a prompt. Scripted drives
take a plain text file (one user turn per line, `#` comments allowed) via
`--script`. Replays take a recorded cassette via `--cassette`.

## Command

Interactive (TTY):

```bash
bun tools/ge.mjs drive
```

Scripted, recording the conversation as an eval case *and* the raw stream as
a cassette:

```bash
printf 'Can I change my plan after having a child?\nWhat documents do I need?\n' > turns.txt
bun tools/ge.mjs drive --script turns.txt \
  --record evals/recorded.evalset.json \
  --record-cassette .ge/cassettes/enrollment.ndjson
```

Replay a recording — no cloud, no credentials, deterministic timings (the
repo ships fixtures under `tools/lib/live/fixtures/`):

```bash
bun tools/ge.mjs drive --cassette tools/lib/live/fixtures/success.ndjson --json
```

Drive any deployed agent, factory-built or not (BYO agent): `--ge-app` takes
the full engine resource name (or a bare id plus `project` in config) and
`--assistant` picks a non-default assistant on it. Add `--target-agent` to
assert who answers:

```bash
bun tools/ge.mjs drive \
  --ge-app projects/acme/locations/global/collections/default_collection/engines/support-engine \
  --assistant support_assistant \
  --target-agent support-agent-v2 --strict-responder
```

Machine callers use `--json` (the full LiveTranscript on stdout). The same
command is exposed as `POST /api/ge/drive` in the console and as the
`factory_drive` MCP tool.

## The footer, field by field

Every turn ends with one dim line:

```
ttft 412ms · full 1.4s · chunks 5 · max gap 610ms · session …/sessions/abc123 · responder matched · tools 1
```

| Field | Meaning |
| --- | --- |
| `ttft` | Time to first *text* — from sending the turn to the first chunk that carried answer text. |
| `full` | Full response time — offset of the last chunk in the stream. |
| `chunks` | How many streamed chunks the answer arrived in. |
| `max gap` | The worst inter-chunk stall inside the stream (omitted for single-chunk answers). |
| `session` | The live session the service handed back (shortened to its last two path segments; `new` before the first response). Follow-up turns must continue it — that is the session-threading check. |
| `responder` | The identity assertion when `--target-agent` was given: `matched`, `mismatched`, or `unknown ⚠` when the stream carried no identity evidence. Absent when no expected agent is configured. |
| `tools` | Number of tool invocations the stream surfaced for this turn (absent when none). |

These are the same numbers `ge bench` later holds against budgets — the
footer is the single-conversation view of the same measurements.

## Expected output

- Each turn: the answer text, then the footer line.
- On finish: a verdict block — `verdict ok`, the transcript path under
  `.ge/transcripts/`, the recorded evalset case (when `--record`), and any
  responder warning.
- Exit code 0 when the transcript verdict is ok; 1 when a blocker was raised.
- With no live target configured, `ge drive` renders a position screen
  instead of a bare error: where you stand on capture → prove → handoff, the
  blocker, and the exact next command.

## Generated files

- `.ge/transcripts/<id>.json` — the [LiveTranscript](../reference/live-transcript.html):
  per-turn text, folded stream chunks, timings, session threading, responder
  evidence, tools, citations, verdict.
- `evals/recorded.evalset.json` (with `--record`) — an ADK-compatible evalset;
  the assistant's answers become reference responses, so the case is gradeable
  by `ge prove --live` later. `--record-id` names the case.
- `.ge/cassettes/<name>.ndjson` (with `--record-cassette`) — the raw stream
  with timing offsets, replayable byte-for-byte. Serve it over HTTP with
  `bun tools/mock-streamassist.mjs --cassette <path>` for anything that speaks
  the REST endpoint.

## Common failures

- **`GELIVE001` — no shipped live target found.** No engine is recorded for
  this project. Fix: `ge init` (or pass `--ge-app <engine>`); if you passed a
  bare engine id, set `project` too (`ge config explain`).
- **`GELIVE002` — application default credentials unavailable.** Fix:
  `gcloud auth application-default login` (or `bun install` if the Discovery
  Engine client library itself is missing).
- **`GELIVE003` — live assist call was denied.** The caller lacks
  `discoveryengine.assistants.assist` on the engine. Fix: `ge doctor`.
- **`GELIVE004` — live stream could not be parsed.** Also raised for a
  missing/corrupt cassette, or a script with more turns than the recording.
  Retryable for transport blips; for cassettes, re-record:
  `ge drive --record-cassette <path>`.
- **`GELIVE006` — responder identity mismatched** (or unverifiable under
  `--strict-responder`). The stream's identity evidence names a different
  agent than `--target-agent`. Check what actually answered in the transcript's
  `responder.evidence`.
- **`GELIVE007` — live targeting is unsupported for this engine.** The
  configured engine/assistant resource does not exist. Fix:
  `ge config explain` (check `geAppId` / `geLocation`).

## Next step

Recorded a conversation? Prove it stays true:
[Prove the shipped agent live](prove-live.html) —
`ge prove --live --evalset evals/recorded.evalset.json --max-cases 1`. Or
compile a full suite from the contract first:
[Compile behavioral evals](compile-behavioral-evals.html).
