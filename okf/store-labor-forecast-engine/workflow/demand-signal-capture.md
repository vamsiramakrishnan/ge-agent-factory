---
type: Workflow Stage
title: Demand Signal Capture
description: "Pull Oracle Xstore POS pos_transactions and store_shift_summaries alongside BigQuery historical_metrics and analytics_events to reconstruct 15-minute interval demand curves per store_number before any forecast is touched."
source_id: demand_signal_capture
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Demand Signal Capture

Pull Oracle Xstore POS pos_transactions and store_shift_summaries alongside BigQuery historical_metrics and analytics_events to reconstruct 15-minute interval demand curves per store_number before any forecast is touched.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)

Next: [Interval-Level Labor Forecasting](/workflow/interval-level-labor-forecasting.md)
