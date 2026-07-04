---
type: Workflow Stage
title: Staging and constraint check
description: "Cross-reference material_stagings.shortage_flag and machine_events on the affected resource to determine whether a trending-late process_order is a materials shortage, a constraint-asset stoppage, or a genuine schedule slip before it gets scored."
source_id: staging_and_constraint_check
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Staging and constraint check

Cross-reference material_stagings.shortage_flag and machine_events on the affected resource to determine whether a trending-late process_order is a materials shortage, a constraint-asset stoppage, or a genuine schedule slip before it gets scored.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_production_schedule_adherence_monitor_sop](/tools/lookup-production-schedule-adherence-monitor-sop.md)

Next: [Variance scoring against baseline](/workflow/variance-scoring-against-baseline.md)
