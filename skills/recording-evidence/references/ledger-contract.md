# Evidence Ledger Contract

## Purpose

The Evidence Ledger is an append-only stream of typed facts about Factory, Autopilot, Mission Control, workspace gates, artifacts, blockers, and harness interventions.

It differs from a log:

| Surface | Shape | Use |
| --- | --- | --- |
| Log | ordered text/events from a process | replay what happened |
| Evidence Ledger | normalized facts with subject, provenance, artifact pointers, causality, and outcomes | learn, query, resume, audit, and fix upstream |

## Minimal Event Shape

```json
{
  "id": "evt_...",
  "type": "workspace.doctor.completed",
  "ts": "2026-06-06T00:00:00.000Z",
  "subject": {
    "kind": "workspace",
    "id": "ws-benefits-agent"
  },
  "run": {
    "missionId": "mission_...",
    "factoryRunId": "run-...",
    "autopilotRunId": "auto-...",
    "stage": "preview"
  },
  "mode": {
    "name": "local",
    "capability": "local_doctor_repair"
  },
  "actor": {
    "kind": "system|harness|human",
    "id": "autopilot"
  },
  "evidence": [
    {
      "kind": "artifact",
      "path": "artifacts/checking-workspaces.json",
      "uri": null,
      "sha256": null
    }
  ],
  "outcome": {
    "status": "passed|blocked|failed|repaired|observed",
    "blockers": [],
    "repairActions": []
  },
  "causality": {
    "parentEventIds": [],
    "correlationId": "ws-benefits-agent:preview"
  },
  "labels": {
    "department": "hr",
    "targetStage": "preview"
  }
}
```

## Required Fields

- `type`: dot-delimited event type.
- `ts`: ISO timestamp.
- `subject.kind` and `subject.id`.
- `mode.name`: `local` or `remote`.
- `actor.kind` and `actor.id`.
- `outcome.status`.

## Recommended Indexes

- `type`
- `subject.kind + subject.id`
- `run.missionId`
- `run.autopilotRunId`
- `run.factoryRunId`
- `run.stage`
- `outcome.status`
- `outcome.blockers[].id`
- `labels.department`
- `labels.targetStage`

## Rollups

Generate rollups from events, not from ad hoc UI state:

- blocker frequency by target stage
- repair success rate by blocker id
- generator defect candidates by repeated blocker signature
- artifact readiness by workspace
- local/remote convergence status by mission
- harness intervention effectiveness

## Upstream Fix Rule

If the same blocker signature appears in three or more workspaces, stop treating it as a workspace repair problem. Emit `upstream.fix.recommended` with:

- blocker id and message
- affected workspaces
- likely owner: spec, generator, data pack, workspace contract, factory stage, console, or cloud infra
- evidence event ids

