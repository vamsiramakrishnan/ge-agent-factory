---
type: Proof Obligation
title: "Golden eval obligation — Run the Incident and Near-Miss Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-incident-near-miss-triage-agent-end-to-end"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Incident and Near-Miss Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [incident-near-miss-triage-agent-end-to-end](/tests/incident-near-miss-triage-agent-end-to-end.md)


## Mechanisms

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_incident_near_miss_triage_agent_sop](/tools/lookup-incident-near-miss-triage-agent-sop.md)
- [action_sphera_ehs_escalate](/tools/action-sphera-ehs-escalate.md)

## Entities that must be referenced

- safety_incidents
- tickets
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [incident-near-miss-triage-agent-sop](/documents/incident-near-miss-triage-agent-sop.md)
