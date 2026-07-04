---
type: Proof Obligation
title: "Golden eval obligation — Originator 'Meridian Payroll Services' (instruction_id 742118803) shows an unauthorized return rate of 0.61% in this morning's BigQuery analytics_events rollup for the week of 2026-06-29, but the Looker dashboards scorecard published yesterday still shows 0.38% for the same originator and period. Reconcile the discrepancy against FIS Payments Hub clearing_batches before notifying the relationship owner, and tell me whether we're past the Nacha 0.5% unauthorized threshold."
description: golden eval proof obligation
source_id: "eval-ach-return-root-cause-analyzer-conflicting-return-rate"
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

# Golden eval obligation — Originator 'Meridian Payroll Services' (instruction_id 742118803) shows an unauthorized return rate of 0.61% in this morning's BigQuery analytics_events rollup for the week of 2026-06-29, but the Looker dashboards scorecard published yesterday still shows 0.38% for the same originator and period. Reconcile the discrepancy against FIS Payments Hub clearing_batches before notifying the relationship owner, and tell me whether we're past the Nacha 0.5% unauthorized threshold.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [ach-return-root-cause-analyzer-conflicting-return-rate](/tests/ach-return-root-cause-analyzer-conflicting-return-rate.md)


## Mechanisms

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)

## Entities that must be referenced

- payment_instructions
- analytics_events
- dashboards

## Forbidden behaviors

- reporting either the 0.61% or 0.38% figure as authoritative without reconciling against source-system clearing_batches
- notifying the relationship owner of a threshold breach before the discrepancy is resolved

# Citations

- [ach-return-root-cause-analyzer-compliance-policy](/documents/ach-return-root-cause-analyzer-compliance-policy.md)
- [ach-return-rate-risk-mitigation-playbook](/documents/ach-return-rate-risk-mitigation-playbook.md)
