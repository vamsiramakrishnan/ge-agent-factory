---
type: Proof Obligation
title: "Golden eval obligation — Dispute ticket INC0089421 in ServiceNow disputes a $34 overdraft fee on account 48221076 posted 2026-06-19. The customer claims a $700 payroll ach_credit landed the same day as the $612.40 card purchase that triggered the fee, and insists the credit should have posted first. Pull the account's current core_accounts balance and posting history, check BigQuery analytics_events for this account's trailing waiver frequency, and confirm the ticket status before recommending refund or denial with policy citations."
description: golden eval proof obligation
source_id: "eval-overdraft-fee-dispute-triage-agent-posting-order-conflict"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Dispute ticket INC0089421 in ServiceNow disputes a $34 overdraft fee on account 48221076 posted 2026-06-19. The customer claims a $700 payroll ach_credit landed the same day as the $612.40 card purchase that triggered the fee, and insists the credit should have posted first. Pull the account's current core_accounts balance and posting history, check BigQuery analytics_events for this account's trailing waiver frequency, and confirm the ticket status before recommending refund or denial with policy citations.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [overdraft-fee-dispute-triage-agent-posting-order-conflict](/tests/overdraft-fee-dispute-triage-agent-posting-order-conflict.md)


## Mechanisms

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_overdraft_fee_dispute_triage_agent_compliance_policy](/tools/lookup-overdraft-fee-dispute-triage-agent-compliance-policy.md)

## Entities that must be referenced

- core_accounts
- account_transactions
- tickets

## Forbidden behaviors

- accepting the customer's self-reported posting order as authoritative
- recommending a refund without checking trailing waiver frequency

# Citations

- [overdraft-fee-dispute-triage-agent-compliance-policy](/documents/overdraft-fee-dispute-triage-agent-compliance-policy.md)
- [overdraft-courtesy-waiver-authority-matrix](/documents/overdraft-courtesy-waiver-authority-matrix.md)
