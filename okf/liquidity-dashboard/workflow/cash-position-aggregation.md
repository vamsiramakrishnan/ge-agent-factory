---
type: Workflow Stage
title: Cash Position Aggregation
description: Aggregate balances from 45+ bank accounts across 12+ currencies. Pull intraday positions where available. Convert all balances to reporting currency using current market rates.
source_id: cash_position_aggregation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cash Position Aggregation

Aggregate balances from 45+ bank accounts across 12+ currencies. Pull intraday positions where available. Convert all balances to reporting currency using current market rates.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)

Next: [Liquidity Analytics](/workflow/liquidity-analytics.md)
