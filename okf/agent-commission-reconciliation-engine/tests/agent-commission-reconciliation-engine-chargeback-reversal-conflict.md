---
type: Eval Scenario
title: "Billing account BA-100482 (policy PLC-77213) has a premium_invoices row marke..."
description: "Billing account BA-100482 (policy PLC-77213) has a premium_invoices row marked cancelled_flat on 2026-06-18 for $2,140.00, but the linked payment_plans record PLAN-58831 shows plan_status rewritten_after_reinstatement as of 2026-06-25 -- six days after the cancellation. The June commission statement run drafted a $612.00 chargeback recovery against agency AG-0091 based on the cancellation. Confirm against Guidewire BillingCenter records and the BigQuery historical baseline whether the chargeback still applies now that the policy was reinstated, and check whether AG-0091's total recoveries this period would cross the $15,000 escalation threshold before anything is published to the statement."
source_id: "agent-commission-reconciliation-engine-chargeback-reversal-conflict"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Billing account BA-100482 (policy PLC-77213) has a premium_invoices row marked cancelled_flat on 2026-06-18 for $2,140.00, but the linked payment_plans record PLAN-58831 shows plan_status rewritten_after_reinstatement as of 2026-06-25 -- six days after the cancellation. The June commission statement run drafted a $612.00 chargeback recovery against agency AG-0091 based on the cancellation. Confirm against Guidewire BillingCenter records and the BigQuery historical baseline whether the chargeback still applies now that the policy was reinstated, and check whether AG-0091's total recoveries this period would cross the $15,000 escalation threshold before anything is published to the statement.

## Validates

- [variance-duplicate-payment-detection](/queries/variance-duplicate-payment-detection.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agent_commission_reconciliation_engine_authority_guide](/tools/lookup-agent-commission-reconciliation-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Agent Commission Reconciliation Engine Authority & Referral Guide](/documents/agent-commission-reconciliation-engine-authority-guide.md)
- [Commission Chargeback & Rate Adjustment Runbook](/documents/agent-commission-reconciliation-engine-chargeback-rate-runbook.md)
