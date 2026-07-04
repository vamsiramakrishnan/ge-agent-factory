---
type: Workflow Stage
title: "Settlement Ladder & Position Build"
description: "Pull today's trades and positions from Murex MX.3 (query_murex_mx_3_trades, query_murex_mx_3_positions) and lay trade_date, settlement_status, and notional_amount out into a per-currency intraday settlement ladder alongside book_designation and market_value from positions."
source_id: settlement_ladder_position_build
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Settlement Ladder & Position Build

Pull today's trades and positions from Murex MX.3 (query_murex_mx_3_trades, query_murex_mx_3_positions) and lay trade_date, settlement_status, and notional_amount out into a per-currency intraday settlement ladder alongside book_designation and market_value from positions.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_intraday_liquidity_forecasting_engine_compliance_policy](/tools/lookup-intraday-liquidity-forecasting-engine-compliance-policy.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)

Next: [Historical Payment Pattern Reconciliation](/workflow/historical-payment-pattern-reconciliation.md)
