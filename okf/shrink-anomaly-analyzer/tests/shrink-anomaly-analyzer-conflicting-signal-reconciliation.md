---
type: Eval Scenario
title: Store 482 register 14 pos_transactions show a discount_amount spike (9 transa...
description: "Store 482 register 14 pos_transactions show a discount_amount spike (9 transactions between $60-$75 discount, tender_type credit) for business date 2026-06-28, but the matching bigquery analytics_events record for that store-week shows variance_pct of only 1.8%, under the 2% shrink-variance escalation trigger. Reconcile the conflict and decide whether to escalate to the district asset protection manager."
source_id: "shrink-anomaly-analyzer-conflicting-signal-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store 482 register 14 pos_transactions show a discount_amount spike (9 transactions between $60-$75 discount, tender_type credit) for business date 2026-06-28, but the matching bigquery analytics_events record for that store-week shows variance_pct of only 1.8%, under the 2% shrink-variance escalation trigger. Reconcile the conflict and decide whether to escalate to the district asset protection manager.

## Validates

- [case-file-assembly-risk-ranking](/queries/case-file-assembly-risk-ranking.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Shrink Anomaly Analyzer Retail Execution Playbook](/documents/shrink-anomaly-analyzer-execution-playbook.md)
