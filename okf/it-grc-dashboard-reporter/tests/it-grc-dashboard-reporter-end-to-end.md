---
type: Eval Scenario
title: "Run the IT GRC Dashboard & Reporter workflow for the current period. Cite the..."
description: "Run the IT GRC Dashboard & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "it-grc-dashboard-reporter-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the IT GRC Dashboard & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cross-domain-aggregation](/queries/cross-domain-aggregation.md)

## Mechanisms to call

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_rsa_archer_rsa_archer_records](/tools/query-rsa-archer-rsa-archer-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_it_grc_dashboard_reporter_runbook](/tools/lookup-it-grc-dashboard-reporter-runbook.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

## Success rubric

Action generate executed against ServiceNow GRC, with audit-trail entry and CIO / CTO notified of outcomes.

# Citations

- [IT GRC Dashboard & Reporter Operations Runbook](/documents/it-grc-dashboard-reporter-runbook.md)
