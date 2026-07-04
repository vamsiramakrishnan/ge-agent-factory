---
type: Eval Scenario
title: Run the Overdraft Fee Dispute Triage Agent workflow for the current period. C...
description: "Run the Overdraft Fee Dispute Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "overdraft-fee-dispute-triage-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Overdraft Fee Dispute Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_overdraft_fee_dispute_triage_agent_compliance_policy](/tools/lookup-overdraft-fee-dispute-triage-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

## Success rubric

Action escalate executed against Temenos Transact, with audit-trail entry and Retail Banking Service Manager notified of outcomes.

# Citations

- [Overdraft Fee Dispute Triage Agent Banking Compliance Policy](/documents/overdraft-fee-dispute-triage-agent-compliance-policy.md)
