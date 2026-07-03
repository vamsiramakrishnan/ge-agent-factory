---
name: driving-live-proof
description: Operates the live-behavior layer of the GE Agent Factory — driving the deployed agent, compiling and recording evalsets, live proof, and latency benching. Use when verifying a shipped agent through its streaming assist surface, recording or replaying cassettes, running ge drive / ge prove --live / ge bench, or reading live transcripts, budgets, and gate verdicts.
---

# Driving Live Proof

Use this skill after release/publish, when a deployed agent must be verified through the same streaming assist surface real users hit.

In plain language: local proof shows the agent you built behaves; this skill owns proving the agent you *shipped* still does. It drives real conversations (or deterministic cassette replays), grades them with the GE-owned metric grid, compares behavior against known-good baselines, and holds latency to budgets — and it treats live traffic as money: replay first, caps always, confirmation for load.

## Assembly-Line Slot

- **First step:** confirm a live target exists (deployed engine in `.ge.json` `geAppId`, or an explicit `--ge-app`) and an evalset or cassette is available or recordable.
- **Plays a role in:** post-release verification — after `publish_enterprise`/`verify_live`, before and during promotion decisions gated by `promotion.gates.live`.
- **Input:** a deployed engine/assistant, plus a captured contract (for `ge evals compile`) or a recorded evalset/cassette.
- **Output:** live transcripts (`.ge/transcripts/`), proof results (`.ge/proof/live-proof-result.json`, `eval-matrix.json`), bench verdicts (`.ge/proof/bench-result.json`), conformance baselines (`.ge/live-baselines/`), recorded evalsets and cassettes.
- **Next step:** feed verdicts to the promotion decision (`running-release`); on failure, reproduce interactively with `ge drive` and route blockers upstream.

## Workflow

1. **Compile evals from the contract** (`ge evals compile`) — or record real conversations as cases (`ge drive --record`). Prefer compiled suites: they cover what the contract declares, not what someone remembered.
2. **Drive the surface** — interactively or scripted — and read the per-turn footer (ttft, full, chunks, max gap, session, responder, tools). Record a cassette (`--record-cassette`) while you are there; it makes everything downstream replayable for free.
3. **Prove live with caps first**: `ge prove --live --max-cases 1`, then widen deliberately. Read the per-case metric grid; `unavailable`/`not_applicable` statuses are honest reports, never silent passes.
4. **Bench within guards**: cassette replay by default; a live run only with explicit confirmation (`--yes`) and only within the `live.bench` hard caps.
5. **Read verdicts, not vibes**: exit codes and `verdict.blockers` (stable `GELIVE001`–`GELIVE008` codes with what/where/why/fix) are the result — every blocker names its fix command.
6. **Update baselines deliberately**: a `drifted` conformance verdict blocks by default. Only run `--update-baseline` after confirming the new behavior is correct — baselines are known-good by construction, and moving one is a release decision, not a retry.

## Commands

Compile the behavior suite from a captured contract (local, deterministic, free):

```bash
bun tools/ge.mjs evals compile --max-cases 40
bun tools/ge.mjs evals applicability          # which metrics grade which rail
```

Drive — scripted, replay, and recording:

```bash
bun tools/ge.mjs drive --script turns.txt --record evals/recorded.evalset.json --record-cassette .ge/cassettes/run.ndjson
bun tools/ge.mjs drive --cassette tools/lib/live/fixtures/success.ndjson --json   # zero cloud
```

Prove live — cost caps first, then strict for release:

```bash
bun tools/ge.mjs prove --live --evalset evals/recorded.evalset.json --max-cases 1
bun tools/ge.mjs prove --live --evalset .ge/behavioral/<spec-id>.evalset.json --strict-responder --target-agent <agent-id>
bun tools/ge.mjs prove --live --evalset evals/recorded.evalset.json --cassette .ge/cassettes/run.ndjson   # offline
```

Bench — replay free, live confirmed and guarded:

```bash
bun tools/ge.mjs bench --cassette .ge/cassettes/run.ndjson
bun tools/ge.mjs bench --yes --sessions 5 --turns 2
```

Full offline smoke of the loop (drive replay → prove live → bench replay, no cloud, no config):

```bash
node skills/driving-live-proof/scripts/replay-smoke.mjs
```

## Safety rails

- **Never run a live bench without `--yes`** (MCP: `confirm=true`), and never raise `live.bench` guard caps on your own — that is an operator decision.
- **Prefer cassettes.** Every live command accepts `--cassette`; replay is deterministic, free, and credential-less. Real traffic is the explicit exception, not the default.
- **Cost caps first.** The first live proof of any evalset runs with `--max-cases 1`; widen only after it is green.
- **Strict responder for release.** Release verification uses `--strict-responder` and `--target-agent` so an unverifiable responder fails instead of warning.
- **Baseline moves are deliberate.** Do not pass `--update-baseline` to make a red run green; confirm the behavior change first and say so in the run record.

## Common mistakes

- Running `ge prove --live` without `--max-cases` on a 40-case compiled suite as the *first* live contact — burnt budget for information one case would have given.
- Treating a `tool_trajectory: unavailable` status as a pass — it means the live stream exposed no tool metadata; trajectory must be graded on the local rail.
- Regenerating a cassette to "fix" a failing replay — the recording is the fixture; if replay fails after a change, the change broke the machinery.
- Recording an evalset from a conversation that itself had a failing verdict — record green conversations only.

## Done when

- The live proof result is `passed`, the gate (`promotion.gates.live`) reports no blockers, baselines are `matched`/`created` (or a drift was deliberately accepted with `--update-baseline` and noted), and the bench verdict passes every budget in `live.budgets` — with artifacts on disk under `.ge/proof/` for the record.

## References

- Read `references/example-session.md` first if this is your first run of the loop — a worked session (compile → drive → capped live proof → bench → report), with real output and the drift-handling variant.
- Read `references/cassettes.md` before recording, editing, or replaying cassettes.
- Copy `assets/turns-example.txt` as the starting `--script` file, and `assets/live-budgets-example.json` for the `.ge.json` budget/guard/gate blocks (defaults, annotated).
- Docs: `docs/cookbooks/drive-a-shipped-agent.md`, `docs/cookbooks/prove-live.md`, `docs/cookbooks/bench-live-budgets.md`, `docs/cookbooks/compile-behavioral-evals.md`, `docs/reference/live-transcript.md`, `docs/reference/live-budgets.md`, `docs/reference/metric-applicability.md`.
