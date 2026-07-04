---
type: Query Capability
title: "Optimize portfolio allocation across yield, liquidity, and credit risk dimens..."
description: "Optimize portfolio allocation across yield, liquidity, and credit risk dimensions. Duration matching against expected cash needs. Benchmark comparison against money market and short-term bond indices."
source_id: "portfolio-optimization"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Optimize portfolio allocation across yield, liquidity, and credit risk dimensions. Duration matching against expected cash needs. Benchmark comparison against money market and short-term bond indices.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_investment_portfolio_optimizer_controls_playbook](/tools/lookup-investment-portfolio-optimizer-controls-playbook.md)

## Runs in

- [portfolio_optimization](/workflow/portfolio-optimization.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Investment Portfolio Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/investment-portfolio-optimizer-end-to-end.md)

# Citations

- [Investment Portfolio Optimizer Controls Playbook](/documents/investment-portfolio-optimizer-controls-playbook.md)
