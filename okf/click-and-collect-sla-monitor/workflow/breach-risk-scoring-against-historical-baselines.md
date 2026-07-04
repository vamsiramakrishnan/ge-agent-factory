---
type: Workflow Stage
title: Breach Risk Scoring Against Historical Baselines
description: "Compare current pick-rate telemetry against BigQuery historical_metrics and analytics_events (query_bigquery_historical_metrics, query_bigquery_analytics_events) to predict which orders will miss the 2-hour SLA before the picker finishes."
source_id: breach_risk_scoring_against_historical_baselines
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Breach Risk Scoring Against Historical Baselines

Compare current pick-rate telemetry against BigQuery historical_metrics and analytics_events (query_bigquery_historical_metrics, query_bigquery_analytics_events) to predict which orders will miss the 2-hour SLA before the picker finishes.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_click_and_collect_sla_monitor_execution_playbook](/tools/lookup-click-and-collect-sla-monitor-execution-playbook.md)

Next: [Inventory & Substitution Validation](/workflow/inventory-substitution-validation.md)
