---
type: Eval Scenario
title: "SKU 45213099 at store 1187 has a forecast_overrides request for the 2026-07-1..."
description: "SKU 45213099 at store 1187 has a forecast_overrides request for the 2026-07-13 week: override_units of 640 against a statistical_baseline_units of 210 (override_pct roughly 205%), submitted with override_reason 'unmodeled_promotion'. The demand_forecasts row for that SKU-store-week has frozen_period_flag = true and wmape = 0.41. Should this override be auto-published tonight?"
source_id: "demand-forecast-exception-agent-frozen-period-override-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SKU 45213099 at store 1187 has a forecast_overrides request for the 2026-07-13 week: override_units of 640 against a statistical_baseline_units of 210 (override_pct roughly 205%), submitted with override_reason 'unmodeled_promotion'. The demand_forecasts row for that SKU-store-week has frozen_period_flag = true and wmape = 0.41. Should this override be auto-published tonight?

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
