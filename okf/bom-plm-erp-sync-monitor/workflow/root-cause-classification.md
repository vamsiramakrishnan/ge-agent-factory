---
type: Workflow Stage
title: "Root-cause classification"
description: "Classify each mismatch as failed interface transfer, manual ERP override, or pending change, cross-referencing BigQuery historical_metrics and analytics_events baselines to separate real drift from timing noise."
source_id: root_cause_classification
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Root-cause classification

Classify each mismatch as failed interface transfer, manual ERP override, or pending change, cross-referencing BigQuery historical_metrics and analytics_events baselines to separate real drift from timing noise.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bom_plm_erp_sync_monitor_sop](/tools/lookup-bom-plm-erp-sync-monitor-sop.md)

Next: [Effectivity & build-risk scoring](/workflow/effectivity-build-risk-scoring.md)
