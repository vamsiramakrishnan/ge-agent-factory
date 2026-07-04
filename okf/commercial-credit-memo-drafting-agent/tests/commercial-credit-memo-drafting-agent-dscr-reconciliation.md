---
type: Eval Scenario
title: "Draft the first-cut credit memo for application 30184552 (Meridian Fabricator..."
description: "Draft the first-cut credit memo for application 30184552 (Meridian Fabricators Inc., requested $3,250,000 term loan). loan_applications shows DSCR 1.32, but credit_memos memo #812044 for the same application_number lists global_cash_flow of $410,000 against roughly $525,000 of annual debt service -- that implies a DSCR closer to 0.78. Reconcile the discrepancy and tell me whether this memo is ready to route to committee."
source_id: "commercial-credit-memo-drafting-agent-dscr-reconciliation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Draft the first-cut credit memo for application 30184552 (Meridian Fabricators Inc., requested $3,250,000 term loan). loan_applications shows DSCR 1.32, but credit_memos memo #812044 for the same application_number lists global_cash_flow of $410,000 against roughly $525,000 of annual debt service -- that implies a DSCR closer to 0.78. Reconcile the discrepancy and tell me whether this memo is ready to route to committee.

## Validates

- [deal-intake-financial-spread-assembly](/queries/deal-intake-financial-spread-assembly.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Commercial Credit Memo Drafting Agent Banking Compliance Policy](/documents/commercial-credit-memo-drafting-agent-compliance-policy.md)
- [Delegated Lending Authority & House Hold-Limit Matrix](/documents/commercial-credit-memo-drafting-agent-delegated-authority-matrix.md)
