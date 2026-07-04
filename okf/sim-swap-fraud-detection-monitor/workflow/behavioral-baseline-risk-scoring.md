---
type: Workflow Stage
title: "Behavioral Baseline & Risk Scoring"
description: "Compare the swap and surrounding usage_records against BigQuery analytics_events and historical_metrics dormancy, recency, and channel-anomaly baselines in cached_aggregates to produce a risk score for the Fraud Operations Analyst queue."
source_id: behavioral_baseline_risk_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Behavioral Baseline & Risk Scoring

Compare the swap and surrounding usage_records against BigQuery analytics_events and historical_metrics dormancy, recency, and channel-anomaly baselines in cached_aggregates to produce a risk score for the Fraud Operations Analyst queue.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)

Next: [Step-Up Hold & Routing Block](/workflow/step-up-hold-routing-block.md)
