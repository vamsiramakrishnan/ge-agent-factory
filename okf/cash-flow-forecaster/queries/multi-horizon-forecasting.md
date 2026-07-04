---
type: Query Capability
title: "Time-series models forecast cash at daily (1-week), weekly (1-month), and mon..."
description: "Time-series models forecast cash at daily (1-week), weekly (1-month), and monthly (1-year) horizons. Seasonal decomposition captures payroll cycles, tax payments, and quarterly patterns. Variance-to-prior-forecast tracking measures accuracy."
source_id: "multi-horizon-forecasting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Time-series models forecast cash at daily (1-week), weekly (1-month), and monthly (1-year) horizons. Seasonal decomposition captures payroll cycles, tax payments, and quarterly patterns. Variance-to-prior-forecast tracking measures accuracy.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_cash_flow_forecaster_controls_playbook](/tools/lookup-cash-flow-forecaster-controls-playbook.md)

## Runs in

- [multi_horizon_forecasting](/workflow/multi-horizon-forecasting.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Cash Flow Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cash-flow-forecaster-end-to-end.md)

# Citations

- [Cash Flow Forecaster Controls Playbook](/documents/cash-flow-forecaster-controls-playbook.md)
