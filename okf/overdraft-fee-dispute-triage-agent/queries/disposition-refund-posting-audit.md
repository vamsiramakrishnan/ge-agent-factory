---
type: Query Capability
title: Execute action_temenos_transact_escalate to post the refund or escalate the p...
description: "Execute action_temenos_transact_escalate to post the refund or escalate the pattern-abuse case in Temenos Transact, update the ServiceNow tickets status, and emit the generated_audit_trail evidence for the Retail Banking Service Manager."
source_id: "disposition-refund-posting-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_temenos_transact_escalate to post the refund or escalate the pattern-abuse case in Temenos Transact, update the ServiceNow tickets status, and emit the generated_audit_trail evidence for the Retail Banking Service Manager.

## Tools used

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

## Runs in

- [disposition_refund_posting_audit](/workflow/disposition-refund-posting-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Overdraft Fee Dispute Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/overdraft-fee-dispute-triage-agent-end-to-end.md)
- [Dispute ticket INC0089421 in ServiceNow disputes a $34 overdraft fee on account 48221076 posted 2026-06-19. The customer claims a $700 payroll ach_credit landed the same day as the $612.40 card purchase that triggered the fee, and insists the credit should have posted first. Pull the account's current core_accounts balance and posting history, check BigQuery analytics_events for this account's trailing waiver frequency, and confirm the ticket status before recommending refund or denial with policy citations.](/tests/overdraft-fee-dispute-triage-agent-posting-order-conflict.md)
- [Ticket INC0091167 disputes a $35 overdraft fee on account 71304519, filed 2026-07-03. The last BigQuery analytics_events refresh for this account is timestamped 2026-06-30 21:00 UTC (over 24 hours old) and shows exactly 2 prior waivers in the trailing 12 months, right at the tier-2 threshold in the waiver authority playbook. Determine whether this ticket can be adjudicated now or must wait for fresh evidence, and state the correct next step.](/tests/overdraft-fee-dispute-triage-agent-stale-waiver-history.md)

# Citations

- [Overdraft Fee Dispute Triage Agent Banking Compliance Policy](/documents/overdraft-fee-dispute-triage-agent-compliance-policy.md)
- [Courtesy Overdraft Fee Waiver Authority & Approval Limits Playbook](/documents/overdraft-courtesy-waiver-authority-matrix.md)
