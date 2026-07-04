---
type: Eval Scenario
title: "Store 1188's closing shift on business date 2026-07-02 posted cash_over_short..."
description: "Store 1188's closing shift on business date 2026-07-02 posted cash_over_short of -$248.50 on register 6. The last bigquery analytics_events refresh available for that store-week is timestamped 2026-06-30T02:00:00Z, more than 48 hours old. The store manager wants the case filed today. Decide whether to file action_oracle_xstore_pos_file now."
source_id: "shrink-anomaly-analyzer-stale-baseline-threshold-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store 1188's closing shift on business date 2026-07-02 posted cash_over_short of -$248.50 on register 6. The last bigquery analytics_events refresh available for that store-week is timestamped 2026-06-30T02:00:00Z, more than 48 hours old. The store manager wants the case filed today. Decide whether to file action_oracle_xstore_pos_file now.

## Validates

- [baseline-variance-comparison](/queries/baseline-variance-comparison.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_shrink_anomaly_analyzer_execution_playbook](/tools/lookup-shrink-anomaly-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Register Cash Accountability & Drawer Audit Standard](/documents/shrink-anomaly-analyzer-cash-drawer-accountability-standard.md)
