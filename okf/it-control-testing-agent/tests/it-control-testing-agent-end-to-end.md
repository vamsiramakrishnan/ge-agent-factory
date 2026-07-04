---
type: Eval Scenario
title: Run the IT Control Testing Agent workflow for the current period. Cite the re...
description: "Run the IT Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "it-control-testing-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the IT Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [test-planning-execution](/queries/test-planning-execution.md)

## Mechanisms to call

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_rsa_archer_rsa_archer_records](/tools/query-rsa-archer-rsa-archer-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_it_control_testing_agent_runbook](/tools/lookup-it-control-testing-agent-runbook.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

## Success rubric

Action generate executed against ServiceNow GRC, with audit-trail entry and Compliance & GRC Lead notified of outcomes.

# Citations

- [IT Control Testing Agent Operations Runbook](/documents/it-control-testing-agent-runbook.md)
