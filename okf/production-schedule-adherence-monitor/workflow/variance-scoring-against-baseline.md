---
type: Workflow Stage
title: Variance scoring against baseline
description: "Compare the gap against historical_metrics and analytics_events in BigQuery via query_bigquery_analytics_events to quantify downstream capacity and customer-ship impact, then rank the at-risk process_orders and production_orders queue for the Production Scheduler."
source_id: variance_scoring_against_baseline
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Variance scoring against baseline

Compare the gap against historical_metrics and analytics_events in BigQuery via query_bigquery_analytics_events to quantify downstream capacity and customer-ship impact, then rank the at-risk process_orders and production_orders queue for the Production Scheduler.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_production_schedule_adherence_monitor_sop](/tools/lookup-production-schedule-adherence-monitor-sop.md)

Next: [SOP-gated recommendation](/workflow/sop-gated-recommendation.md)
