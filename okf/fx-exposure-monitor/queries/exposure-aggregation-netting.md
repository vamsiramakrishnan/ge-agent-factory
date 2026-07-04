---
type: Query Capability
title: "Aggregate FX exposures from treasury positions, AR, AP, and intercompany bala..."
description: "Aggregate FX exposures from treasury positions, AR, AP, and intercompany balances across all entities. Net offsetting positions within currency pairs to calculate true net exposure by tenor."
source_id: "exposure-aggregation-netting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate FX exposures from treasury positions, AR, AP, and intercompany balances across all entities. Net offsetting positions within currency pairs to calculate true net exposure by tenor.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_fx_exposure_monitor_controls_playbook](/tools/lookup-fx-exposure-monitor-controls-playbook.md)

## Runs in

- [exposure_aggregation_netting](/workflow/exposure-aggregation-netting.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the FX Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fx-exposure-monitor-end-to-end.md)

# Citations

- [FX Exposure Monitor Controls Playbook](/documents/fx-exposure-monitor-controls-playbook.md)
