---
type: Workflow Stage
title: "Lapse-Risk Scoring"
description: "Score purchase cadence decay against historical_metrics and analytics_events baselines in BigQuery via query_bigquery_analytics_events to produce a weekly lapse-risk rank for every active loyalty member."
source_id: lapse_risk_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Lapse-Risk Scoring

Score purchase cadence decay against historical_metrics and analytics_events baselines in BigQuery via query_bigquery_analytics_events to produce a weekly lapse-risk rank for every active loyalty member.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)

Next: [Treatment & Incrementality Selection](/workflow/treatment-incrementality-selection.md)
