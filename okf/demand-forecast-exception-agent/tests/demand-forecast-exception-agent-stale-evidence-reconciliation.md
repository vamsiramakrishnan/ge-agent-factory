---
type: Eval Scenario
title: "The forecast_overrides row for SKU 78341122 at store 442, override_week 2026-..."
description: "The forecast_overrides row for SKU 78341122 at store 442, override_week 2026-07-06, shows approved_flag = true with override_units = 512 against statistical_baseline_units = 190 (override_reason: 'weather_event'). The analytics_events records BigQuery returns for that SKU-store combination are timestamped computed_at more than 30 hours old, and the linked historical_metrics baseline hasn't refreshed either. Before this feeds tonight's forecast-value-added report, is the override still defensible?"
source_id: "demand-forecast-exception-agent-stale-evidence-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# The forecast_overrides row for SKU 78341122 at store 442, override_week 2026-07-06, shows approved_flag = true with override_units = 512 against statistical_baseline_units = 190 (override_reason: 'weather_event'). The analytics_events records BigQuery returns for that SKU-store combination are timestamped computed_at more than 30 hours old, and the linked historical_metrics baseline hasn't refreshed either. Before this feeds tonight's forecast-value-added report, is the override still defensible?

## Validates

- [nightly-exception-scan](/queries/nightly-exception-scan.md)

## Mechanisms to call

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Demand Forecast Exception Agent Retail Execution Playbook](/documents/demand-forecast-exception-agent-execution-playbook.md)
- [Demand Planning Override Tolerance & Frozen-Period Manual](/documents/demand-forecast-override-tolerance-manual.md)
