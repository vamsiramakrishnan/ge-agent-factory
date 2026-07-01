---
title: Console Tour
parent: Reference
nav_order: 8
layout: default
---

# Console Tour

A walkthrough of the operator console's surfaces — what each one does and when
you'd reach for it. The console (`mise run console`, <http://localhost:18260>) is the
main UI over the factory core; its Bun server exposes the same `/api/ge/*` JSON the
`ge` CLI emits, so the console and CLI are two views of one engine.

The left sidebar is the single source of truth for navigation (shared with the
command palette). Its entries are: **Overview**, **Pipeline**, **Interview**,
**Fleet**, **Repair Queue**, **Runs**, and **Readiness**. Detail surfaces (Agent
detail, Spec review) open from those.

<!-- screenshot: Console shell — sidebar + topbar (Now pulse) -->

---

## Live status model

The console's live status is built on the **durable run ledger**. Long-running work
(missions, builds, jobs) writes ledger events; the UI reduces those events into
ordered stages and a merged log tail.

- The **Now pulse** in the top bar polls the ledger on a calm, off-:00 cadence and
  shows a compact `▶running ⏸blocked ✕failed ✓done` cluster; clicking it opens Runs.
- **Follow** on any run subscribes the **Run Drawer** to that run's ledger stream
  and tails it live.
- **Remote** runs stream their stage logs through the same ledger, so a cloud
  factory run looks and follows exactly like a local one.

---

## Overview

The landing surface: the fleet at a glance plus reconcile/runtime context. It pulls
the fleet, recent runtime tasks, and a best-effort apply plan, and surfaces plane
cards and a quick path into the journey (preview / console / platform). Use it as
your home base to see overall state and jump to the next action.

<!-- screenshot: Overview -->

## Pipeline (Journey)

A 3-step wizard — **Source → Configure → Review** — for turning a use case into a
generated agent. Step 1 picks an existing spec or starts a new one; Step 2 configures
the scenario and **systems** via the BYO-capable **SystemsField**; Step 3 reviews
and launches the run. Use it to drive a single agent (or a bulk scope) from spec to
build.

The **SystemsField** autocompletes over the known simulated systems and includes a
**Bring Your Own System** flow that synthesizes a brand-new live simulator from a
natural-language description and binds it to the spec. The selection is still just a
comma-separated list under the hood, so it slots into the existing spec binding.

<!-- screenshot: Pipeline wizard — Configure step with SystemsField + BYO -->

## Interview

An artifact-driven interview that produces a spec: a chat/transcript pane on one
side and a live spec canvas on the other, with document drop-in for grounding. Use
it when you don't have a spec yet and want to author one conversationally; the result
feeds straight into the Pipeline.

<!-- screenshot: Interview — transcript + spec canvas -->

## Fleet

The roster of all generated agents, filterable by department, status, and stage
(filters live in the URL hash so a filtered view is shareable and reload-safe).
Select agents to run **bulk** build / ship / sync / repair / regenerate actions. Use
it to operate the whole fleet at once or to find and open one agent.

<!-- screenshot: Fleet table with filters + bulk actions -->

## Repair Queue (Autopilot)

A targeted queue for driving agents to a goal stage (`preview`, `promote`,
`deploy:plan`, `publish:plan`), with optional auto-repair. Pick a department/status
scope and a target stage, then run; it tracks the resulting autopilot runs. Use it to
push a batch of agents up to a boundary and let it repair blockers as it goes.

<!-- screenshot: Repair Queue -->

## Runs (Activity)

One chronological timeline over three run sources — **missions, builds, and jobs** —
normalized into a single list with a unified status filter and `StatusChip`. Each row
is tagged by origin (Mission / Build / Job) and expands to detail; **Follow** opens
the live Run Drawer on that run. Use it to watch everything happening across the
factory and to jump into any run's live tail.

<!-- screenshot: Runs (Activity) timeline -->

## Run Drawer + Now pulse

The Run Drawer is the centerpiece live-follow surface — a right-side panel mounted
once in the shell, driven by the run-follow context and a live ledger reduction. It
shows an ordered **stage timeline**, a rolling **log tail**, a blocked reason when a
run pauses, and a reconnecting indicator if the stream drops. **Pin** keeps it open
after completion; otherwise it auto-collapses on the terminal frame. Use it whenever
you want to watch a run progress stage-by-stage — local or remote — in real time.

The **Now pulse** (top bar) is the always-on summary of live run counts that feeds
this drawer; click it to open Runs and pick a run to Follow.

<!-- screenshot: Run Drawer following a live run -->

## Readiness (Doctor)

A preflight verdict with **runnable fixes**. It streams `doctor` for a chosen scope
(`all`, `local`, `cloud`, `data`, `mcp`) and optional target command, rolls every
section's checks into a single pass/warn/fail verdict, and renders each failing check
with a copy-able fix you can run (or follow as a run). Use it before standing planes
up or deploying, and whenever something is blocked and you want the concrete command
to unblock it.

<!-- screenshot: Readiness (Doctor) — verdict + section checks with fixes -->

## Agent detail

The deep view for one agent: its stage **lifecycle/pipeline**, workspace doctor +
repair reports, artifacts, and per-stage actions (build, ship, sync, regenerate,
repair). A **triage band** highlights what needs attention so you can act without
scanning the whole pipeline. Use it to inspect, unblock, and operate a single agent
end to end.

<!-- screenshot: Agent detail — pipeline + triage band -->

---

## See also

- [Console & APIs](console-and-apis.md) — the `/api/ge/*` surface the console drives.
- [CLI](cli.md) — the same factory core from the command line.
- [Contributing](https://github.com/vamsiramakrishnan/ge-agent-factory/blob/main/CONTRIBUTING.md) — running the console locally and the gates.
