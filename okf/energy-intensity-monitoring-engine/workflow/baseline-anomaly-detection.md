---
type: Workflow Stage
title: "Baseline & Anomaly Detection"
description: "Compare the reconciled intensity figure against weather- and volume-normalized analytics_events and historical_metrics in BigQuery to flag any line or shift that has drifted off its baseline."
source_id: baseline_anomaly_detection
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline & Anomaly Detection

Compare the reconciled intensity figure against weather- and volume-normalized analytics_events and historical_metrics in BigQuery to flag any line or shift that has drifted off its baseline.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)

Next: [Equipment Attribution & Downtime Cross-Check](/workflow/equipment-attribution-downtime-cross-check.md)
