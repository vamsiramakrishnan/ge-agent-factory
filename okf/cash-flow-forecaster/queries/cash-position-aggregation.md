---
type: Query Capability
title: "Aggregate real-time cash positions across 45+ bank accounts in 12+ currencies..."
description: "Aggregate real-time cash positions across 45+ bank accounts in 12+ currencies. Pull AR expected inflows and AP scheduled outflows from ERP sub-ledgers. Convert to reporting currency using current rates."
source_id: "cash-position-aggregation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate real-time cash positions across 45+ bank accounts in 12+ currencies. Pull AR expected inflows and AP scheduled outflows from ERP sub-ledgers. Convert to reporting currency using current rates.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_cash_flow_forecaster_controls_playbook](/tools/lookup-cash-flow-forecaster-controls-playbook.md)

## Runs in

- [cash_position_aggregation](/workflow/cash-position-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Cash Flow Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cash-flow-forecaster-end-to-end.md)

# Citations

- [Cash Flow Forecaster Controls Playbook](/documents/cash-flow-forecaster-controls-playbook.md)
