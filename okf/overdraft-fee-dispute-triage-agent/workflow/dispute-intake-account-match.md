---
type: Workflow Stage
title: "Dispute Intake & Account Match"
description: "Pull the ServiceNow tickets record for the disputed fee and match it to the customer's core_accounts record in Temenos Transact by account_number, confirming account_status and reg_dd_disclosure_acknowledged before triage begins."
source_id: dispute_intake_account_match
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Dispute Intake & Account Match

Pull the ServiceNow tickets record for the disputed fee and match it to the customer's core_accounts record in Temenos Transact by account_number, confirming account_status and reg_dd_disclosure_acknowledged before triage begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_overdraft_fee_dispute_triage_agent_compliance_policy](/tools/lookup-overdraft-fee-dispute-triage-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

Next: [Posting-Sequence Reconstruction](/workflow/posting-sequence-reconstruction.md)
