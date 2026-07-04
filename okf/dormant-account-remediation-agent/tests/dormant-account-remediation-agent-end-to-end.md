---
type: Eval Scenario
title: Run the Dormant Account Remediation Agent workflow for the current period. Ci...
description: "Run the Dormant Account Remediation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "dormant-account-remediation-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Dormant Account Remediation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

## Success rubric

Action escalate executed against Temenos Transact, with audit-trail entry and Deposit Operations Analyst notified of outcomes.

# Citations

- [Dormant Account Remediation Agent Banking Compliance Policy](/documents/dormant-account-remediation-agent-compliance-policy.md)
