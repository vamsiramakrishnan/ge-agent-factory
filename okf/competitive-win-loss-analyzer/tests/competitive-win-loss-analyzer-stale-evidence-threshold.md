---
type: Eval Scenario
title: "This week's briefing is due today (2026-07-04). The BigQuery analytics_events..."
description: "This week's briefing is due today (2026-07-04). The BigQuery analytics_events record for the fiber_1gig_wifi-vs-cable-overbuilder segment shows computed_at of 2026-06-29 — five days stale — while historical_metrics for the same period refreshed today. The computed competitive win rate for that segment lands at exactly 47.0%, right at the KPI target. Decide whether to publish the win-rate finding in this week's briefing or hold it, and document the evidence basis for your decision."
source_id: "competitive-win-loss-analyzer-stale-evidence-threshold"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# This week's briefing is due today (2026-07-04). The BigQuery analytics_events record for the fiber_1gig_wifi-vs-cable-overbuilder segment shows computed_at of 2026-06-29 — five days stale — while historical_metrics for the same period refreshed today. The computed competitive win rate for that segment lands at exactly 47.0%, right at the KPI target. Decide whether to publish the win-rate finding in this week's briefing or hold it, and document the evidence basis for your decision.

## Validates

- [competitive-pricing-signal-scan](/queries/competitive-pricing-signal-scan.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_competitive_win_loss_analyzer_assurance_runbook](/tools/lookup-competitive-win-loss-analyzer-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Competitive Win-Loss Analyzer Service Assurance Runbook](/documents/competitive-win-loss-analyzer-assurance-runbook.md)
