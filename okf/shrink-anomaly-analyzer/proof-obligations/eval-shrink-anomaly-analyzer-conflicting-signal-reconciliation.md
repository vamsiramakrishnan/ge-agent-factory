---
type: Proof Obligation
title: "Golden eval obligation — Store 482 register 14 pos_transactions show a discount_amount spike (9 transactions between $60-$75 discount, tender_type credit) for business date 2026-06-28, but the matching bigquery analytics_events record for that store-week shows variance_pct of only 1.8%, under the 2% shrink-variance escalation trigger. Reconcile the conflict and decide whether to escalate to the district asset protection manager."
description: golden eval proof obligation
source_id: "eval-shrink-anomaly-analyzer-conflicting-signal-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Store 482 register 14 pos_transactions show a discount_amount spike (9 transactions between $60-$75 discount, tender_type credit) for business date 2026-06-28, but the matching bigquery analytics_events record for that store-week shows variance_pct of only 1.8%, under the 2% shrink-variance escalation trigger. Reconcile the conflict and decide whether to escalate to the district asset protection manager.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [shrink-anomaly-analyzer-conflicting-signal-reconciliation](/tests/shrink-anomaly-analyzer-conflicting-signal-reconciliation.md)


## Mechanisms

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)

## Entities that must be referenced

- pos_transactions
- analytics_events

## Forbidden behaviors

- escalating to district_asset_protection_manager based on the aggregate variance_pct alone while ignoring the register-level discount pattern
- discarding the discount anomaly as noise without citing supporting evidence

# Citations

- [shrink-anomaly-analyzer-execution-playbook](/documents/shrink-anomaly-analyzer-execution-playbook.md)
