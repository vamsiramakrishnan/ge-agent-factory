---
type: Proof Obligation
title: "Golden eval obligation — Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-major-incident-coordinator-end-to-end"
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

# Golden eval obligation — Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [major-incident-coordinator-end-to-end](/tests/major-incident-coordinator-end-to-end.md)


## Mechanisms

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_zoom_zoom_records](/tools/query-zoom-zoom-records.md)
- [lookup_major_incident_coordinator_runbook](/tools/lookup-major-incident-coordinator-runbook.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Entities that must be referenced

- incidents
- tickets
- messages
- zoom_records
- alerts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [major-incident-coordinator-runbook](/documents/major-incident-coordinator-runbook.md)
