---
type: Workflow Stage
title: Retrieve Records
description: Query core accounts and account transactions from Temenos Transact and correlate with ServiceNow for the Overdraft Fee Dispute Triage Agent workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query core accounts and account transactions from Temenos Transact and correlate with ServiceNow for the Overdraft Fee Dispute Triage Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_overdraft_fee_dispute_triage_agent_compliance_policy](/tools/lookup-overdraft-fee-dispute-triage-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
