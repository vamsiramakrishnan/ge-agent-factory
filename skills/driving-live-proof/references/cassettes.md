# Cassettes

A cassette is a recorded live-assist stream, replayable byte-for-byte. It is
the default execution target for every live test in CI; real traffic is the
explicit opt-in. Source of truth: `tools/lib/live/cassette.mjs`
(`CASSETTE_VERSION = 1`).

## Format

NDJSON — one JSON record per line, in stream order. Three record types:

```
{"type":"meta","version":1,"target":{"project":"…","location":"…","engine":"…","assistant":"…"},"recordedAt":"…"}
{"type":"request","turn":0,"session":null,"body":{"query":{"text":"…"}}}
{"type":"chunk","turn":0,"atMs":0,"json":{…StreamAssistResponse…}}
{"type":"chunk","turn":0,"atMs":412,"json":{…}}
{"type":"request","turn":1,"session":"projects/…/sessions/abc","body":{…}}
```

- **`meta`** — must be present (first line by convention): cassette version,
  the recorded target (project/location/engine/assistant), and `recordedAt`.
  Replay resolves its target from here, which is why replays need no config.
- **`request`** — one per turn: the 0-based `turn` index, the `session` the
  turn was sent with (`null` for the first), and the request `body` (the user
  text lives at `body.query.text`).
- **`chunk`** — the verbatim `StreamAssistResponse` JSON for that turn, with
  `atMs`: the chunk's time offset from the start of the turn's stream.

Rules the parser enforces (violations raise `GELIVE004` with a re-record
fix): every line valid JSON, chunks only after their turn's request, turns
contiguous from 0, a meta record present. Unknown record types are skipped on
purpose — future recorders may add annotation records and old readers must
keep replaying.

## Why `atMs` offsets matter

Offsets are preserved from the recording, so replay reproduces the original
time-to-first-text and inter-chunk gaps deterministically. That is what lets
the latency-budget machinery (`ge bench`, the footer, budget verdicts) be
tested with zero cloud calls — a replay of a slow recording *fails* the ttft
budget, reliably, forever.

## Recording

```bash
bun tools/ge.mjs drive --record-cassette .ge/cassettes/<name>.ndjson
```

The recorder streams: it appends records as chunks arrive, so a crashed run
still leaves a usable prefix on disk. Re-recording truncates the file first.

## Replaying

Every live command accepts `--cassette`:

```bash
bun tools/ge.mjs drive --cassette <path> --json     # replays the recorded turns
bun tools/ge.mjs prove --live --evalset <set> --cassette <path>
bun tools/ge.mjs bench --cassette <path>            # loops turns across synthetic sessions
```

A bare `ge drive --cassette <path>` needs no script — the recorded request
turns are replayed. A script with more turns than the recording raises
`GELIVE004`. Bench replay wraps turn indexes modulo the recording length, so
a short cassette can back many synthetic sessions.

To serve a cassette over HTTP for anything that speaks the REST endpoint
(console dev, curl, k6):

```bash
bun tools/mock-streamassist.mjs --cassette <path> [--port 8199] [--speed 1|0]
```

`--speed 0` drops the recorded delays; requests without a session play turn
0, and each request carrying the previous turn's session advances.

## Repo fixtures

Checked-in cassettes under `tools/lib/live/fixtures/`, one per failure class
the live layer must handle:

| Fixture | What it exercises |
| --- | --- |
| `success.ndjson` | Two threaded turns, grounded answer with a citation, one tool invocation — the green path. |
| `responder-mismatch.ndjson` | Identity evidence naming a different agent — responder assertion / `GELIVE006` paths. |
| `stream-failure.ndjson` | A stream ending in a terminal `FAILED` state — transport metric / `GELIVE004` paths. |
| `slow-ttft.ndjson` | Recorded ttft and stalls beyond default budgets — budget-verdict failure paths. |

Use fixtures for machinery checks (they are stable test inputs — never edit
them to make a run green); record fresh cassettes for agent-specific
behavior.
