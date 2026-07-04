---
title: Agent operability
parent: Reference
nav_order: 15
layout: default
description: The contract that makes the factory drivable by an AI agent — position and next-command guidance, background runs, event streams, resume plans, mid-run questions and answers, and the skill-loading model.
---

# Agent operability

**Definition:** the set of mechanisms that let an agent (Claude Code,
Antigravity, Codex, Gemini CLI — or a CI job) operate the factory without a
human translating for it: know where it is, run long work safely, watch it,
resume it, answer its questions, and recover from failure with a named next
command.

Five mechanisms, one rule each.

## 1. Position — every surface answers "where am I, what next"

- **Bare `ge`** (or `ge status --json`) prints the position on
  capture → prove → handoff, the current blocker, and the exact next command
  (`goldenPath.next` in JSON).
- **`ge <command> --help`** ends with an `ORIENTATION` section — use-when,
  expected duration, risk, and the literal next commands — sourced from the
  same command registry the console and MCP server read, so guidance cannot
  drift per surface.
- **Every result carries `next`.** Live results (`LiveProofResult`,
  `LiveBenchResult`, drive output, `ge evals compile`) return a `next` field
  with a runnable command.
- **Every failure names its fix.** Errors follow the four-field contract
  (what / where / why / **fix** — a literal command), with stable codes
  (`GE####`, `GELIVE001`–`GELIVE008`) that mean the same thing in text
  output, `--json` payloads, transcripts, and gate verdicts.

Rule: an agent should never have to guess a command — it either reads it from
`next:`, from a `fix:`, or from the ORIENTATION block.

## 2. Background runs — anything long is a run, and runs are durable

`ge runs job -- <any ge command>` executes a command as a background task
under the local runtime; `ge runs list` is the one timeline over everything
(background tasks + durable build ledger). Long-running verbs (builds,
repairs, data generation) create runs natively. Runs persist their input,
output, status, and full event log on disk — surviving the process that
started them.

Rule: an agent never babysits a terminal; it starts a run, then observes it.

## 3. Observation — events are streamed, replayable, and resumable

- **Follow live:** `ge runs events <id> --follow` (SSE, Server-Sent Events,
  with Last-Event-ID resume — a dropped connection continues from the last
  event seen; `--json` emits NDJSON, newline-delimited JSON, for machine
  consumption).
- **Replay later:** `ge runs replay <id>` re-renders a finished run's
  recorded events at speed — a run an agent missed is a run it can still
  read.
- **Console parity:** the same event streams back the console's run views;
  nothing is console-only.

## 4. Interruption and resume — runs pause, ask, and continue

Two distinct affordances, often confused:

- **Questions (mid-run interaction).** A running task that needs a decision
  emits a `ge.interaction.request` event carrying an interaction id and a
  question form. Whoever is driving — human, CI, or agent — answers with
  `ge runs respond <task> <interaction>` (`--answers <json>` for full forms,
  `--question/--freeform/--select` shorthand, `--cancel` to decline). The
  run picks the answer up and continues. This is how a factory run can ask
  *the operating agent* something without dying.
- **Resume (after stop/failure).** Every persisted run classifies its own
  resumability: `ge runs show <id> --json` returns a `resumePlan` —
  `safeToRun`, `nextAction`, `reason`, and a literal `commands` list
  (typically `ge runs show/resume/events`). `ge runs resume <id>` re-enters
  the run deterministically; run kinds that are not safe to blindly re-run
  say so and say why.

Rule: interruptions are answered (`respond`), stops are resumed (`resume`),
and both paths are discoverable from the run itself — no tribal knowledge.

## 5. Skills and hooks — how an agent learns the jobs

- **In factory-run sessions** skills load automatically: the run's
  capabilities/stages/message select skills
  (`skills/skill-routing.json` triggers + composition edges), the selected
  set is materialized into the run workspace, and "read and follow" is
  injected into the agent's context. Risky stations compose
  `guarding-the-factory` — the safety rail rides along by construction.
- **In external sessions** the same skills install via the distribution
  surfaces (Claude Code plugin marketplace, Gemini CLI extension,
  `bunx create-ge-agent-factory --skills …`, `mise run skills-install`).
- **Progressive disclosure** keeps them cheap: routing description →
  SKILL.md decision layer → composed references (including a worked
  `example-session.md` per skill) → executable scripts and copyable assets.
  See [the skills README](https://github.com/vamsiramakrishnan/ge-agent-factory/tree/main/skills#progressive-disclosure--the-four-levels).

## The machine contract, in one table

| Need | Mechanism | Machine shape |
| --- | --- | --- |
| Where am I? | bare `ge` / `ge status` | `--json` → `goldenPath.{current,blocker,next}` |
| What is this command for? | `ge <cmd> --help` ORIENTATION | registry `guide.{when,next}` |
| Run something long | `ge runs job -- <cmd>` | task id, durable state |
| Watch it | `ge runs events <id> --follow` | SSE / NDJSON, resumable cursor |
| It asked me something | `ge runs respond <task> <interaction>` | interaction request/response JSON |
| It stopped | `ge runs resume <id>` | `resumePlan.{safeToRun,commands}` |
| It failed | error `fix:` field | stable `GE####`/`GELIVE###` codes |
| Do it without a terminal | MCP (Model Context Protocol) `factory_*` tools / `/api/ge/*` routes | registry-derived, same core functions |

## Known gaps (tracked follow-ups)

- Push-style completion callbacks (webhooks) do not exist; observation is
  pull/stream. An agent that cannot hold an SSE connection should poll
  `ge runs show <id> --json`.
- `ge runs respond` covers question forms; free-form mid-run *instruction*
  ("also check X") is not a supported interruption — stop, adjust, resume.
- ORIENTATION currently covers the single-word verbs with registry entries;
  group subcommands (e.g. `ge evals compile`) rely on their own `--help`
  descriptions.
