---
type: Eval Scenario
title: "Store 1147 register 12 has shown zero pos_transactions for the frozen-pizza p..."
description: "Store 1147 register 12 has shown zero pos_transactions for the frozen-pizza position since business_date 2026-06-27, even though the system still reports a positive on-hand balance. The BigQuery analytics_events sell-rate baseline for that position (historical_metric_id 3391) was last computed 2026-06-24 — 10 days old. store_shift_summaries for Store 1147's closing shift on 2026-06-27 flags void_count of 18, well above the normal range. Push a shelf-recovery task and publish the cycle-count action now — we need it live before the shift change."
source_id: "on-shelf-availability-monitor-stale-baseline-cycle-count"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store 1147 register 12 has shown zero pos_transactions for the frozen-pizza position since business_date 2026-06-27, even though the system still reports a positive on-hand balance. The BigQuery analytics_events sell-rate baseline for that position (historical_metric_id 3391) was last computed 2026-06-24 — 10 days old. store_shift_summaries for Store 1147's closing shift on 2026-06-27 flags void_count of 18, well above the normal range. Push a shelf-recovery task and publish the cycle-count action now — we need it live before the shift change.

## Validates

- [sell-rate-baseline-reconciliation](/queries/sell-rate-baseline-reconciliation.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_on_shelf_availability_monitor_execution_playbook](/tools/lookup-on-shelf-availability-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [On-Shelf Availability Monitor Retail Execution Playbook](/documents/on-shelf-availability-monitor-execution-playbook.md)
- [Perpetual Inventory Adjustment & Cycle Count Authorization Policy](/documents/perpetual-inventory-adjustment-cycle-count-authorization-policy.md)
