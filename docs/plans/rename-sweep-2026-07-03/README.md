# Rename map — the full-rename sweep (2026-07-03)

`capability-diff.txt` compares today's surface against the pre-refactor
snapshot (`capability-before.txt`). The original mission was additive-only;
the follow-up directive ("full rename, no vestiges — nothing is released
yet") sanctioned removals, **provided every capability survives under its
new name**. This file is the audit: every removed line maps to a living
replacement. Nothing was dropped without one.

## Removed command groups → their canonical homes

| Removed (was a deprecated alias) | Capability lives at |
|---|---|
| `ge journey plan\|status\|run` | `ge pipeline plan\|status\|run` |
| `ge mission plan\|run\|status\|resume` | `ge pipeline graph\|run\|status·runs\|resume` |
| `ge autopilot run\|status\|events` | `ge fleet repair` · `ge fleet repairs [id]` · `ge runs events` |
| `ge runtime status\|tasks\|task\|events\|resume\|start autopilot·repair·job` | `ge daemon status` · `ge runs list\|show\|events\|resume\|job` · `ge fleet repair` |
| `ge agents fleet` | `ge fleet status` |

## Renamed spellings (same implementation, one name now)

| Removed spelling | Canonical spelling | Notes |
|---|---|---|
| `ge devex smoke` (flags id/target/preview/vertex/no-vertex/warm/force) | `ge prove` | prove carries every flag; fresh-machine dispatch is automatic; core fn `devexSmoke` → `firstProof`, result kind `ge.devex.smoke` → `ge.prove.fresh` |
| `ge agents ship` (flags ids/start-stage/target-stage/concurrency/no-proxy) | `ge handoff [target]` | handoff carries every flag plus the target gate; core fn `ship` → `handoff` |
| MCP `factory_ship` (ids/startStage/targetStage/noProxy) | MCP `factory_handoff` (+ target) | same handler lineage, same params + target |
| registry id `mission.run` | registry id `pipeline.run` | same argv (`ge pipeline run`) |
| route `GET /api/ge/journey` | `GET /api/ge/pipeline/plan` | console |
| route `GET /api/ge/mission` | `GET /api/ge/pipeline/graph` | console |
| routes `/api/ge/autopilot*` | `/api/ge/repair*` | console |
| route `POST /api/ge/agents/ship` | `POST /api/ge/handoff` | registry-driven |
| mise task `devex-smoke` | mise task `prove` | |

## Renamed wire/persisted identifiers (unreleased wire — clean flip, no aliases)

| Was | Is |
|---|---|
| daemon task kinds `mission.run` / `autopilot.run` | `pipeline.run` / `repair.run` (legacy kinds now 400) |
| next-actions `resume_mission` / `resume_autopilot` / `run_mission` / `ship_agents` | `resume_pipeline` / `resume_repair` / `run_pipeline` / `handoff_agents` |
| plan kinds `ge.journey.plan` / `ge.mission.graph` / `ge.factory_autopilot.mission` | `ge.pipeline.plan` / `ge.pipeline.graph` / `ge.factory_repair.pipeline` |
| ledger run kind `ship` | `handoff` |
| state dir `.ge/missions` | `.ge/pipelines` |
| sqlite tables `autopilot_runs/items/events` | `repair_runs/items/events` |
| state-machine/resume action `ship` | `handoff` |

## Description-only churn in the diff

Removed+added line pairs where the command/flag survives and only its
description text changed (e.g. the `ge agents` group description no longer
lists ship/fleet; `factory_provision`/`factory_sync` MCP descriptions now
reference `factory_handoff`; `ge pipeline graph`/`ge state reset` mention
`.ge/pipelines`). These are wording updates, not capability changes — the
flag inventory for every surviving command is unchanged or widened
(`ge prove` +preview, `ge handoff` +start-stage/target-stage/concurrency/
no-proxy).

## Deliberately kept

- `tools/bench-ttfp.mjs` still *measures* the retired `ge devex smoke`
  spelling as the decision-count comparator, labeled as retired.
- Legacy state-layout strings (`.ge-missions`, `.ge-harness`, …) in
  state-paths/source-hygiene: they read/police *old on-disk layouts*, which
  by definition keep their historical names.
- Historical archives (`docs/plans/**`, `docs/design-specs/**`,
  `REFACTOR-HANDOFF.md`) — records, not product surface.
