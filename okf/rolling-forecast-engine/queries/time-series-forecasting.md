---
type: Query Capability
title: Run Prophet/ARIMA models on revenue and expense lines. Apply seasonal decompo...
description: "Run Prophet/ARIMA models on revenue and expense lines. Apply seasonal decomposition, trend extrapolation, and generate confidence intervals for each forecast line."
source_id: "time-series-forecasting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run Prophet/ARIMA models on revenue and expense lines. Apply seasonal decomposition, trend extrapolation, and generate confidence intervals for each forecast line.

## Tools used

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_rolling_forecast_engine_controls_playbook](/tools/lookup-rolling-forecast-engine-controls-playbook.md)
- [action_sap_s_4hana_fi_co_generate](/tools/action-sap-s-4hana-fi-co-generate.md)

## Runs in

- [time_series_forecasting](/workflow/time-series-forecasting.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Rolling Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/rolling-forecast-engine-end-to-end.md)

# Citations

- [Rolling Forecast Engine Controls Playbook](/documents/rolling-forecast-engine-controls-playbook.md)
