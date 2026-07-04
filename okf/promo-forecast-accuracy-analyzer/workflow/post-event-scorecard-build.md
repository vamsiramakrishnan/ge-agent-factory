---
type: Workflow Stage
title: "Post-Event Scorecard Build"
description: "Compare analytics_events actuals against historical_metrics baselines in BigQuery to compute variance_pct alongside wmape and bias_pct for every closed promo event, assembling the scorecard within the 72-hour SLA."
source_id: post_event_scorecard_build
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Post-Event Scorecard Build

Compare analytics_events actuals against historical_metrics baselines in BigQuery to compute variance_pct alongside wmape and bias_pct for every closed promo event, assembling the scorecard within the 72-hour SLA.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)

Next: [Playbook & Guardrail Validation](/workflow/playbook-guardrail-validation.md)
