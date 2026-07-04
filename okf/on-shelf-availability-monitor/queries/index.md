---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Scan Oracle Xstore POS pos_transactions and store_shift_summaries store-by-store for positions with zero recorded sales activity despite a positive on-hand balance, the signature read of a phantom-inventory position.](/queries/zero-sales-anomaly-sweep.md)
- [Compare each flagged position's expected sell rate from BigQuery historical_metrics and analytics_events against the current read, and rule out shift-level noise using store_shift_summaries transaction_count and void_count before confirming a true shelf gap.](/queries/sell-rate-baseline-reconciliation.md)
- [Size the revenue impact of each confirmed gap using cached_aggregates and tender_records, then sequence shelf-recovery and cycle-count tasks on store devices by lost-sales value for the Store Operations Director's queue.](/queries/lost-sales-prioritization-task-sequencing.md)
- [Cite the On-Shelf Availability Monitor Retail Execution Playbook for every ranked gap, and additionally cite the Perpetual Inventory Adjustment & Cycle Count Authorization Policy whenever a recommendation touches a book-to-physical inventory correction.](/queries/playbook-inventory-adjustment-evidence-gating.md)
- [Publish the chain OSA scorecard to Looker dashboards, execute the cycle-count/inventory-adjustment action in Oracle Xstore POS once two-system evidence is attached, and escalate stores trending below threshold to the Store Operations Director.](/queries/chain-scorecard-publish-recovery-action.md)
