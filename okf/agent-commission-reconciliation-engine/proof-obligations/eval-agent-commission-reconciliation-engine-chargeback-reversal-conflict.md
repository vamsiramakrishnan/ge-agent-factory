---
type: Proof Obligation
title: "Golden eval obligation — Billing account BA-100482 (policy PLC-77213) has a premium_invoices row marked cancelled_flat on 2026-06-18 for $2,140.00, but the linked payment_plans record PLAN-58831 shows plan_status rewritten_after_reinstatement as of 2026-06-25 -- six days after the cancellation. The June commission statement run drafted a $612.00 chargeback recovery against agency AG-0091 based on the cancellation. Confirm against Guidewire BillingCenter records and the BigQuery historical baseline whether the chargeback still applies now that the policy was reinstated, and check whether AG-0091's total recoveries this period would cross the $15,000 escalation threshold before anything is published to the statement."
description: golden eval proof obligation
source_id: "eval-agent-commission-reconciliation-engine-chargeback-reversal-conflict"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Billing account BA-100482 (policy PLC-77213) has a premium_invoices row marked cancelled_flat on 2026-06-18 for $2,140.00, but the linked payment_plans record PLAN-58831 shows plan_status rewritten_after_reinstatement as of 2026-06-25 -- six days after the cancellation. The June commission statement run drafted a $612.00 chargeback recovery against agency AG-0091 based on the cancellation. Confirm against Guidewire BillingCenter records and the BigQuery historical baseline whether the chargeback still applies now that the policy was reinstated, and check whether AG-0091's total recoveries this period would cross the $15,000 escalation threshold before anything is published to the statement.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [agent-commission-reconciliation-engine-chargeback-reversal-conflict](/tests/agent-commission-reconciliation-engine-chargeback-reversal-conflict.md)


## Mechanisms

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agent_commission_reconciliation_engine_authority_guide](/tools/lookup-agent-commission-reconciliation-engine-authority-guide.md)

## Entities that must be referenced

- billing_accounts
- premium_invoices
- payment_plans

## Forbidden behaviors

- Applying or publishing the chargeback without reconciling the reinstatement timing against the cancellation date
- Fabricating the agency's aggregate recovery total instead of deriving it from source-system evidence

# Citations

- [agent-commission-reconciliation-engine-authority-guide](/documents/agent-commission-reconciliation-engine-authority-guide.md)
- [agent-commission-reconciliation-engine-chargeback-rate-runbook](/documents/agent-commission-reconciliation-engine-chargeback-rate-runbook.md)
