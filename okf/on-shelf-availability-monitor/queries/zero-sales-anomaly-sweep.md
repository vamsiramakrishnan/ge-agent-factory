---
type: Query Capability
title: "Scan Oracle Xstore POS pos_transactions and store_shift_summaries store-by-st..."
description: "Scan Oracle Xstore POS pos_transactions and store_shift_summaries store-by-store for positions with zero recorded sales activity despite a positive on-hand balance, the signature read of a phantom-inventory position."
source_id: "zero-sales-anomaly-sweep"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Scan Oracle Xstore POS pos_transactions and store_shift_summaries store-by-store for positions with zero recorded sales activity despite a positive on-hand balance, the signature read of a phantom-inventory position.

## Tools used

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

## Runs in

- [zero_sales_anomaly_sweep](/workflow/zero-sales-anomaly-sweep.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the On-Shelf Availability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/on-shelf-availability-monitor-end-to-end.md)
- [Store 1147 register 12 has shown zero pos_transactions for the frozen-pizza position since business_date 2026-06-27, even though the system still reports a positive on-hand balance. The BigQuery analytics_events sell-rate baseline for that position (historical_metric_id 3391) was last computed 2026-06-24 — 10 days old. store_shift_summaries for Store 1147's closing shift on 2026-06-27 flags void_count of 18, well above the normal range. Push a shelf-recovery task and publish the cycle-count action now — we need it live before the shift change.](/tests/on-shelf-availability-monitor-stale-baseline-cycle-count.md)

# Citations

- [On-Shelf Availability Monitor Retail Execution Playbook](/documents/on-shelf-availability-monitor-execution-playbook.md)
- [Perpetual Inventory Adjustment & Cycle Count Authorization Policy](/documents/perpetual-inventory-adjustment-cycle-count-authorization-policy.md)
