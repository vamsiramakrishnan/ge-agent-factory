---
type: Eval Scenario
title: Run the Regulatory Change Monitor workflow for the current period. Cite the r...
description: "Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "regulatory-change-monitor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [regulatory-scanning](/queries/regulatory-scanning.md)

## Mechanisms to call

- [query_thomson_reuters_thomson_reuters_records](/tools/query-thomson-reuters-thomson-reuters-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_change_monitor_runbook](/tools/lookup-regulatory-change-monitor-runbook.md)
- [action_thomson_reuters_update](/tools/action-thomson-reuters-update.md)

## Success rubric

Action update executed against Thomson Reuters, with audit-trail entry and Compliance & GRC Lead notified of outcomes.

# Citations

- [Regulatory Change Monitor Operations Runbook](/documents/regulatory-change-monitor-runbook.md)
