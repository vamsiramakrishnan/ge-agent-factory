---
type: Workflow Stage
title: "Baseline & Capability Reconciliation"
description: "Query historical_metrics and analytics_events in BigQuery via query_bigquery_analytics_events to compare current cpk and variance_pct against per-characteristic capability baselines, separating true process drift from measurement noise or a machine_events-driven excursion (fault_alarm, e_stop)."
source_id: baseline_capability_reconciliation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline & Capability Reconciliation

Query historical_metrics and analytics_events in BigQuery via query_bigquery_analytics_events to compare current cpk and variance_pct against per-characteristic capability baselines, separating true process drift from measurement noise or a machine_events-driven excursion (fault_alarm, e_stop).

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_spc_drift_detection_monitor_sop](/tools/lookup-spc-drift-detection-monitor-sop.md)

Next: [Evidence-Gated Hold Recommendation](/workflow/evidence-gated-hold-recommendation.md)
