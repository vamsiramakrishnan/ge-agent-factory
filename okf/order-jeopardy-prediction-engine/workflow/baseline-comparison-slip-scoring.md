---
type: Workflow Stage
title: "Baseline Comparison & Slip Scoring"
description: "Compare milestone velocity against BigQuery analytics_events and historical_metrics via query_bigquery_analytics_events to score each in-flight order's slip risk and match it to the historically fastest recovery path."
source_id: baseline_comparison_slip_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline Comparison & Slip Scoring

Compare milestone velocity against BigQuery analytics_events and historical_metrics via query_bigquery_analytics_events to score each in-flight order's slip risk and match it to the historically fastest recovery path.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_order_jeopardy_prediction_engine_assurance_runbook](/tools/lookup-order-jeopardy-prediction-engine-assurance-runbook.md)

Next: [Runbook & SLA Evidence Validation](/workflow/runbook-sla-evidence-validation.md)
