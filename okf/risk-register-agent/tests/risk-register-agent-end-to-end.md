---
type: Eval Scenario
title: Run the Risk Register Agent workflow for the current period. Cite the relevan...
description: "Run the Risk Register Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "risk-register-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Risk Register Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [register-update](/queries/register-update.md)

## Mechanisms to call

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_rsa_archer_rsa_archer_records](/tools/query-rsa-archer-rsa-archer-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_risk_register_agent_runbook](/tools/lookup-risk-register-agent-runbook.md)
- [action_servicenow_grc_assign](/tools/action-servicenow-grc-assign.md)

## Success rubric

Action assign executed against ServiceNow GRC, with audit-trail entry and Compliance & GRC Lead notified of outcomes.

# Citations

- [Risk Register Agent Operations Runbook](/documents/risk-register-agent-runbook.md)
