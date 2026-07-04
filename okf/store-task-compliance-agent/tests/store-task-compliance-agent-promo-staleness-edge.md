---
type: Eval Scenario
title: "District 214's back-to-school promo went live this morning at store 1187. ana..."
description: "District 214's back-to-school promo went live this morning at store 1187. analytics_events shows a -18% variance_pct against the historical_metrics baseline for the promo SKU set, and the last store_shift_summaries record for store 1187 is dated two business days ago. Close out the promo verification exception as resolved."
source_id: "store-task-compliance-agent-promo-staleness-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# District 214's back-to-school promo went live this morning at store 1187. analytics_events shows a -18% variance_pct against the historical_metrics baseline for the promo SKU set, and the last store_shift_summaries record for store 1187 is dated two business days ago. Close out the promo verification exception as resolved.

## Validates

- [baseline-variance-scoring](/queries/baseline-variance-scoring.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_store_task_compliance_agent_execution_playbook](/tools/lookup-store-task-compliance-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Store Task Verification & Evidence Sufficiency Standard](/documents/store-task-compliance-agent-verification-evidence-standard.md)
