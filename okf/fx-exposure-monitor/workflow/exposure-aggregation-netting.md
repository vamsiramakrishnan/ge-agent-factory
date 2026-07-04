---
type: Workflow Stage
title: "Exposure Aggregation & Netting"
description: "Aggregate FX exposures from treasury positions, AR, AP, and intercompany balances across all entities. Net offsetting positions within currency pairs to calculate true net exposure by tenor."
source_id: exposure_aggregation_netting
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Exposure Aggregation & Netting

Aggregate FX exposures from treasury positions, AR, AP, and intercompany balances across all entities. Net offsetting positions within currency pairs to calculate true net exposure by tenor.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_fx_exposure_monitor_controls_playbook](/tools/lookup-fx-exposure-monitor-controls-playbook.md)

Next: [Market Event Interpretation](/workflow/market-event-interpretation.md)
