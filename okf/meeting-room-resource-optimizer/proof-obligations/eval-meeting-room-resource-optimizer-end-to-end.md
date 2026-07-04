---
type: Proof Obligation
title: "Golden eval obligation — Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-meeting-room-resource-optimizer-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [meeting-room-resource-optimizer-end-to-end](/tests/meeting-room-resource-optimizer-end-to-end.md)


## Mechanisms

- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_meeting_room_resource_optimizer_runbook](/tools/lookup-meeting-room-resource-optimizer-runbook.md)
- [action_google_calendar_recommend](/tools/action-google-calendar-recommend.md)

## Entities that must be referenced

- events
- accounts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [meeting-room-resource-optimizer-runbook](/documents/meeting-room-resource-optimizer-runbook.md)
