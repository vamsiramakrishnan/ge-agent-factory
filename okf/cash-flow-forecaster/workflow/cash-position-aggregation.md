---
type: Workflow Stage
title: Cash Position Aggregation
description: "Aggregate real-time cash positions across 45+ bank accounts in 12+ currencies. Pull AR expected inflows and AP scheduled outflows from ERP sub-ledgers. Convert to reporting currency using current rates."
source_id: cash_position_aggregation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cash Position Aggregation

Aggregate real-time cash positions across 45+ bank accounts in 12+ currencies. Pull AR expected inflows and AP scheduled outflows from ERP sub-ledgers. Convert to reporting currency using current rates.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_cash_flow_forecaster_controls_playbook](/tools/lookup-cash-flow-forecaster-controls-playbook.md)

Next: [Multi-Horizon Forecasting](/workflow/multi-horizon-forecasting.md)
