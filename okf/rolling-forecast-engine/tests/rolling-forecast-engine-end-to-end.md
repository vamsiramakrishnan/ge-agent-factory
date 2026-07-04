---
type: Eval Scenario
title: Run the Rolling Forecast Engine workflow for the current period. Cite the rel...
description: "Run the Rolling Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "rolling-forecast-engine-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Rolling Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [actuals-integration](/queries/actuals-integration.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_co_gl_entries](/tools/query-sap-s-4hana-fi-co-gl-entries.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_rolling_forecast_engine_controls_playbook](/tools/lookup-rolling-forecast-engine-controls-playbook.md)
- [action_sap_s_4hana_fi_co_generate](/tools/action-sap-s-4hana-fi-co-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA FI/CO, with audit-trail entry and FP&A Director notified of outcomes.

# Citations

- [Rolling Forecast Engine Controls Playbook](/documents/rolling-forecast-engine-controls-playbook.md)
