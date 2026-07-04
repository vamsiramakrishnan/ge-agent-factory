---
type: Eval Scenario
title: Run the Major Incident Coordinator workflow for the current period. Cite the ...
description: "Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "major-incident-coordinator-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [incident-detection-classification](/queries/incident-detection-classification.md)

## Mechanisms to call

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_zoom_zoom_records](/tools/query-zoom-zoom-records.md)
- [lookup_major_incident_coordinator_runbook](/tools/lookup-major-incident-coordinator-runbook.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Success rubric

Action generate executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.

# Citations

- [Major Incident Coordinator Operations Runbook](/documents/major-incident-coordinator-runbook.md)
