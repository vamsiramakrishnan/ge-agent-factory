---
name: recording-evidence
description: Records and validates evidence for GE Factory and Autopilot runs. Use when handling ledger events, provenance, artifacts, blockers, repairs, resumability, repeated failures, or upstream fix recommendations.
---

# Recording Evidence

Use this skill to turn factory activity into facts the system can query, audit, and learn from.

Core distinction:

```text
Log = chronological text/events for a run
Evidence Ledger = typed facts with provenance, artifact pointers, causality, and rollups
```

The ledger may ingest logs, but it is not just a log. It should answer:

- What failed, where, and why?
- Which spec/generator/tool defect caused repeated downstream repairs?
- Which repair action worked?
- Which artifacts prove a workspace is ready for a target gate?
- What can be safely resumed without reinterpreting intent?

## Assembly-Line Slot

In plain language: this skill is the memory layer for the whole factory. A log says what a process printed. The Evidence Ledger says what fact was learned, which artifact proves it, who or what caused it, and what should change upstream if the same problem keeps happening.

- **First step:** identify the mission/run/item/stage being evidenced.
- **Plays a role in:** every station, as the normalized evidence layer over Factory stages, Autopilot observations, workspace gates, repairs, artifacts, and harness interventions.
- **Input:** NDJSON logs, mission contracts, workspace artifacts, Autopilot events, Factory stage results, and harness edits.
- **Output:** typed ledger events and rollups that explain blockers, repairs, provenance, and upstream fix candidates.
- **Next step:** feed repeated blocker signatures back to Mission/Factory/Workspace Gate skills for upstream fixes.

Use this skill when the question is “what did we learn, and how do we stop relearning it one workspace at a time?” The ledger should make repeated defects visible so the next fix happens in the generator, spec, simulator, console, or factory stage rather than as another manual repair.

## Workflow

1. Identify the active mission from `GET /api/ge/mission` or the Autopilot run options.
2. Classify mode using the mission `modeContract`:
   - `local_doctor_repair`: collect doctor/repair artifacts from local workspaces.
   - `remote_observe_only`: collect remote run, stage, and artifact observations; do not pretend local repair is available.
3. Emit or inspect typed ledger events using the schema in `references/ledger-contract.md`.
4. Link every event to a source:
   - Factory stage/run id
   - Autopilot run/item id
   - workspace id
   - artifact path or URI
   - harness actor, if a harness changed code
5. Prefer upstream fixes over repeated downstream repairs. If the same blocker appears across multiple workspaces, propose a generator or factory change.
6. Validate event shape with `scripts/validate-ledger-event.mjs` before adding new event producers.
7. Report findings as facts, not narration: event type, subject, evidence URI/path, blocker/action, and recommended upstream owner.

## Event Types

Use these first:

- `mission.planned`
- `factory.stage.started`
- `factory.stage.completed`
- `factory.stage.failed`
- `workspace.doctor.completed`
- `workspace.repair.attempted`
- `workspace.repair.completed`
- `autopilot.item.observed`
- `autopilot.item.blocked`
- `autopilot.run.completed`
- `artifact.produced`
- `blocker.detected`
- `upstream.fix.recommended`
- `harness.intervention`

Add new event types only when these cannot represent the fact cleanly.

## Local/Remote Rules

- In local mode, workspace doctor/repair evidence comes from `.ge/factory/projects/<workspace>/artifacts/*`.
- In remote mode, workspace doctor/repair is observation-only unless the workspace has been synced locally. Use factory run state, GCS artifacts, and job events.
- Do not mark a remote item repaired unless a real repair action happened against a local/synced workspace or a cloud factory repair stage exists.
- Preserve mission intent on resume. Never derive a new target stage from current UI state for an existing run.

## References

- Read `references/assembly-line-role.md` to understand where this skill fits in the Agent Factory assembly line.
- Read `references/ledger-contract.md` when adding events, schemas, or query behavior.
- Read `references/harness-playbook.md` when a harness must operate the ledger during Factory/Autopilot work.

## Validation

Validate a JSON event:

```bash
node skills/recording-evidence/scripts/validate-ledger-event.mjs <event.json>
```

Validate from stdin:

```bash
cat <event.json> | node skills/recording-evidence/scripts/validate-ledger-event.mjs
```
