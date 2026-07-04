---
type: Workflow Stage
title: "Time-Series Forecasting"
description: "Run Prophet/ARIMA models on revenue and expense lines. Apply seasonal decomposition, trend extrapolation, and generate confidence intervals for each forecast line."
source_id: time_series_forecasting
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Time-Series Forecasting

Run Prophet/ARIMA models on revenue and expense lines. Apply seasonal decomposition, trend extrapolation, and generate confidence intervals for each forecast line.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_rolling_forecast_engine_controls_playbook](/tools/lookup-rolling-forecast-engine-controls-playbook.md)
- [action_sap_s_4hana_fi_co_generate](/tools/action-sap-s-4hana-fi-co-generate.md)

Next: [Qualitative Signal Adjustment](/workflow/qualitative-signal-adjustment.md)
