---
type: Eval Scenario
title: Dispute ticket INC0089421 in ServiceNow disputes a $34 overdraft fee on accou...
description: "Dispute ticket INC0089421 in ServiceNow disputes a $34 overdraft fee on account 48221076 posted 2026-06-19. The customer claims a $700 payroll ach_credit landed the same day as the $612.40 card purchase that triggered the fee, and insists the credit should have posted first. Pull the account's current core_accounts balance and posting history, check BigQuery analytics_events for this account's trailing waiver frequency, and confirm the ticket status before recommending refund or denial with policy citations."
source_id: "overdraft-fee-dispute-triage-agent-posting-order-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Dispute ticket INC0089421 in ServiceNow disputes a $34 overdraft fee on account 48221076 posted 2026-06-19. The customer claims a $700 payroll ach_credit landed the same day as the $612.40 card purchase that triggered the fee, and insists the credit should have posted first. Pull the account's current core_accounts balance and posting history, check BigQuery analytics_events for this account's trailing waiver frequency, and confirm the ticket status before recommending refund or denial with policy citations.

## Validates

- [dispute-intake-account-match](/queries/dispute-intake-account-match.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_overdraft_fee_dispute_triage_agent_compliance_policy](/tools/lookup-overdraft-fee-dispute-triage-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Overdraft Fee Dispute Triage Agent Banking Compliance Policy](/documents/overdraft-fee-dispute-triage-agent-compliance-policy.md)
- [Courtesy Overdraft Fee Waiver Authority & Approval Limits Playbook](/documents/overdraft-courtesy-waiver-authority-matrix.md)
