---
type: Workflow Stage
title: "Degradation Scoring & RUL Estimation"
description: "Score the live sensor_readings against historical_metrics and cached_aggregates baselines in BigQuery to quantify departure from the asset's healthy signature and estimate remaining useful life."
source_id: degradation_scoring_rul_estimation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Degradation Scoring & RUL Estimation

Score the live sensor_readings against historical_metrics and cached_aggregates baselines in BigQuery to quantify departure from the asset's healthy signature and estimate remaining useful life.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)

Next: [Failure Mode Triage](/workflow/failure-mode-triage.md)
