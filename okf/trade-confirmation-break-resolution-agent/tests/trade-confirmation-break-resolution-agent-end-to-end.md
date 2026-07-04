---
type: Eval Scenario
title: Run the Trade Confirmation Break Resolution Agent workflow for the current pe...
description: "Run the Trade Confirmation Break Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "trade-confirmation-break-resolution-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Trade Confirmation Break Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_trade_confirmation_break_resolution_agent_compliance_policy](/tools/lookup-trade-confirmation-break-resolution-agent-compliance-policy.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

## Success rubric

Action escalate executed against Murex MX.3, with audit-trail entry and Treasury Operations Analyst notified of outcomes.

# Citations

- [Trade Confirmation Break Resolution Agent Banking Compliance Policy](/documents/trade-confirmation-break-resolution-agent-compliance-policy.md)
