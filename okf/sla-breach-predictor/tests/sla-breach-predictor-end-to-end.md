---
type: Eval Scenario
title: Run the SLA Breach Predictor workflow for the current period. Cite the releva...
description: "Run the SLA Breach Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sla-breach-predictor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the SLA Breach Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [queue-scanning](/queries/queue-scanning.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_it_3_it_3_records](/tools/query-it-3-it-3-records.md)
- [lookup_sla_breach_predictor_runbook](/tools/lookup-sla-breach-predictor-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Success rubric

Action recommend executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.

# Citations

- [SLA Breach Predictor Operations Runbook](/documents/sla-breach-predictor-runbook.md)
