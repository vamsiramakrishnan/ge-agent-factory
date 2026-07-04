---
type: Workflow Stage
title: "Baseline Deviation & Risk Scoring"
description: "Score the claim against BigQuery analytics_events, historical_metrics, and cached_aggregates baselines to detect wardrobing/bracketing velocity and prioritize the Fraud Analyst's queue."
source_id: baseline_deviation_risk_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline Deviation & Risk Scoring

Score the claim against BigQuery analytics_events, historical_metrics, and cached_aggregates baselines to detect wardrobing/bracketing velocity and prioritize the Fraud Analyst's queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_returns_abuse_analyzer_execution_playbook](/tools/lookup-returns-abuse-analyzer-execution-playbook.md)

Next: [Evidence-Gated Tiering](/workflow/evidence-gated-tiering.md)
