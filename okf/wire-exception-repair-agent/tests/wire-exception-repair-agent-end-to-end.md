---
type: Eval Scenario
title: Run the Wire Exception Repair Agent workflow for the current period. Cite the...
description: "Run the Wire Exception Repair Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "wire-exception-repair-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Wire Exception Repair Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_wire_exception_repair_agent_compliance_policy](/tools/lookup-wire-exception-repair-agent-compliance-policy.md)
- [action_fis_payments_hub_escalate](/tools/action-fis-payments-hub-escalate.md)

## Success rubric

Action escalate executed against FIS Payments Hub, with audit-trail entry and Payments Operations Manager notified of outcomes.

# Citations

- [Wire Exception Repair Agent Banking Compliance Policy](/documents/wire-exception-repair-agent-compliance-policy.md)
