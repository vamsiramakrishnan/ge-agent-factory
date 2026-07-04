---
type: Workflow Stage
title: "Portfolio & Market Data"
description: "Pull current portfolio positions with market valuations, accrued interest, and maturity schedules. Overlay with cash forecast to determine investable balances by time horizon."
source_id: portfolio_market_data
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Portfolio & Market Data

Pull current portfolio positions with market valuations, accrued interest, and maturity schedules. Overlay with cash forecast to determine investable balances by time horizon.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_investment_portfolio_optimizer_controls_playbook](/tools/lookup-investment-portfolio-optimizer-controls-playbook.md)

Next: [Portfolio Optimization](/workflow/portfolio-optimization.md)
