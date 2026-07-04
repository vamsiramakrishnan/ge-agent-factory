---
type: Workflow Stage
title: Actuals Integration
description: "Pull month-end actuals from SAP, map to forecast categories, and refresh the Anaplan forecast baseline with latest actual results."
source_id: actuals_integration
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Actuals Integration

Pull month-end actuals from SAP, map to forecast categories, and refresh the Anaplan forecast baseline with latest actual results.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_fi_co_gl_entries](/tools/query-sap-s-4hana-fi-co-gl-entries.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_rolling_forecast_engine_controls_playbook](/tools/lookup-rolling-forecast-engine-controls-playbook.md)
- [action_sap_s_4hana_fi_co_generate](/tools/action-sap-s-4hana-fi-co-generate.md)

Next: [Time-Series Forecasting](/workflow/time-series-forecasting.md)
