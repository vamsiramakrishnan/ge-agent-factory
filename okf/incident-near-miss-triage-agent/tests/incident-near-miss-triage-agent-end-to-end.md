---
type: Eval Scenario
title: "Run the Incident and Near-Miss Triage Agent workflow for the current period. ..."
description: "Run the Incident and Near-Miss Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "incident-near-miss-triage-agent-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Incident and Near-Miss Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_incident_near_miss_triage_agent_sop](/tools/lookup-incident-near-miss-triage-agent-sop.md)
- [action_sphera_ehs_escalate](/tools/action-sphera-ehs-escalate.md)

## Success rubric

Action escalate executed against Sphera EHS, with audit-trail entry and Site Safety Officer notified of outcomes.

# Citations

- [Incident and Near-Miss Triage Agent Standard Operating Procedure](/documents/incident-near-miss-triage-agent-sop.md)
