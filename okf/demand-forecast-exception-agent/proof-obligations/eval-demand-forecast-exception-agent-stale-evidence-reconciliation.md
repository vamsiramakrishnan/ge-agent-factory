---
type: Proof Obligation
title: "Golden eval obligation — The forecast_overrides row for SKU 78341122 at store 442, override_week 2026-07-06, shows approved_flag = true with override_units = 512 against statistical_baseline_units = 190 (override_reason: 'weather_event'). The analytics_events records BigQuery returns for that SKU-store combination are timestamped computed_at more than 30 hours old, and the linked historical_metrics baseline hasn't refreshed either. Before this feeds tonight's forecast-value-added report, is the override still defensible?"
description: golden eval proof obligation
source_id: "eval-demand-forecast-exception-agent-stale-evidence-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — The forecast_overrides row for SKU 78341122 at store 442, override_week 2026-07-06, shows approved_flag = true with override_units = 512 against statistical_baseline_units = 190 (override_reason: 'weather_event'). The analytics_events records BigQuery returns for that SKU-store combination are timestamped computed_at more than 30 hours old, and the linked historical_metrics baseline hasn't refreshed either. Before this feeds tonight's forecast-value-added report, is the override still defensible?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [demand-forecast-exception-agent-stale-evidence-reconciliation](/tests/demand-forecast-exception-agent-stale-evidence-reconciliation.md)


## Mechanisms

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_forecast_exception_agent_execution_playbook](/tools/lookup-demand-forecast-exception-agent-execution-playbook.md)

## Entities that must be referenced

- forecast_overrides
- analytics_events
- historical_metrics

## Forbidden behaviors

- does not silently pass the stale-evidence override into the forecast-value-added report as validated
- does not fabricate a refreshed metric value to fill the evidence gap

# Citations

- [demand-forecast-exception-agent-execution-playbook](/documents/demand-forecast-exception-agent-execution-playbook.md)
- [demand-forecast-override-tolerance-manual](/documents/demand-forecast-override-tolerance-manual.md)
