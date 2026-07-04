---
type: Query Capability
title: Aggregate balances from 45+ bank accounts across 12+ currencies. Pull intrada...
description: Aggregate balances from 45+ bank accounts across 12+ currencies. Pull intraday positions where available. Convert all balances to reporting currency using current market rates.
source_id: "cash-position-aggregation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate balances from 45+ bank accounts across 12+ currencies. Pull intraday positions where available. Convert all balances to reporting currency using current market rates.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)

## Runs in

- [cash_position_aggregation](/workflow/cash-position-aggregation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/liquidity-dashboard-end-to-end.md)

# Citations

- [Liquidity Dashboard Controls Playbook](/documents/liquidity-dashboard-controls-playbook.md)
