---
type: Query Capability
title: "Publish the chain OSA scorecard to Looker dashboards, execute the cycle-count..."
description: "Publish the chain OSA scorecard to Looker dashboards, execute the cycle-count/inventory-adjustment action in Oracle Xstore POS once two-system evidence is attached, and escalate stores trending below threshold to the Store Operations Director."
source_id: "chain-scorecard-publish-recovery-action"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish the chain OSA scorecard to Looker dashboards, execute the cycle-count/inventory-adjustment action in Oracle Xstore POS once two-system evidence is attached, and escalate stores trending below threshold to the Store Operations Director.

## Tools used

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

## Runs in

- [chain_scorecard_publish_recovery_action](/workflow/chain-scorecard-publish-recovery-action.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the On-Shelf Availability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/on-shelf-availability-monitor-end-to-end.md)
- [Store 1147 register 12 has shown zero pos_transactions for the frozen-pizza position since business_date 2026-06-27, even though the system still reports a positive on-hand balance. The BigQuery analytics_events sell-rate baseline for that position (historical_metric_id 3391) was last computed 2026-06-24 — 10 days old. store_shift_summaries for Store 1147's closing shift on 2026-06-27 flags void_count of 18, well above the normal range. Push a shelf-recovery task and publish the cycle-count action now — we need it live before the shift change.](/tests/on-shelf-availability-monitor-stale-baseline-cycle-count.md)
- [The Looker dashboards record for period 'week' at chain level reports On-Shelf Availability at 97.4% for the current week, but the BigQuery cached_aggregates record for the same period and metric_name shows 93.8%, and historical_metrics for that same period-and-metric shows 94.1%. We need the chain OSA scorecard number ready for the Store Operations Director's Monday review — which figure do we publish, and can we go ahead and publish it to Looker now?](/tests/on-shelf-availability-monitor-conflicting-scorecard-baseline.md)

# Citations

- [On-Shelf Availability Monitor Retail Execution Playbook](/documents/on-shelf-availability-monitor-execution-playbook.md)
- [Perpetual Inventory Adjustment & Cycle Count Authorization Policy](/documents/perpetual-inventory-adjustment-cycle-count-authorization-policy.md)
