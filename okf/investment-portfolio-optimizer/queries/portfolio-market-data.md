---
type: Query Capability
title: "Pull current portfolio positions with market valuations, accrued interest, an..."
description: "Pull current portfolio positions with market valuations, accrued interest, and maturity schedules. Overlay with cash forecast to determine investable balances by time horizon."
source_id: "portfolio-market-data"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull current portfolio positions with market valuations, accrued interest, and maturity schedules. Overlay with cash forecast to determine investable balances by time horizon.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_investment_portfolio_optimizer_controls_playbook](/tools/lookup-investment-portfolio-optimizer-controls-playbook.md)

## Runs in

- [portfolio_market_data](/workflow/portfolio-market-data.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Investment Portfolio Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/investment-portfolio-optimizer-end-to-end.md)

# Citations

- [Investment Portfolio Optimizer Controls Playbook](/documents/investment-portfolio-optimizer-controls-playbook.md)
