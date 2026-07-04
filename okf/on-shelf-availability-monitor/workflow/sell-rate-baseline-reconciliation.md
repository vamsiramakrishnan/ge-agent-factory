---
type: Workflow Stage
title: "Sell-Rate Baseline Reconciliation"
description: "Compare each flagged position's expected sell rate from BigQuery historical_metrics and analytics_events against the current read, and rule out shift-level noise using store_shift_summaries transaction_count and void_count before confirming a true shelf gap."
source_id: sell_rate_baseline_reconciliation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Sell-Rate Baseline Reconciliation

Compare each flagged position's expected sell rate from BigQuery historical_metrics and analytics_events against the current read, and rule out shift-level noise using store_shift_summaries transaction_count and void_count before confirming a true shelf gap.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_on_shelf_availability_monitor_execution_playbook](/tools/lookup-on-shelf-availability-monitor-execution-playbook.md)
- [action_oracle_xstore_pos_publish](/tools/action-oracle-xstore-pos-publish.md)

Next: [Lost-Sales Prioritization & Task Sequencing](/workflow/lost-sales-prioritization-task-sequencing.md)
