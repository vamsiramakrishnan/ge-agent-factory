---
type: Proof Obligation
title: "Golden eval obligation — Run the Investment Portfolio Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-investment-portfolio-optimizer-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Investment Portfolio Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [investment-portfolio-optimizer-end-to-end](/tests/investment-portfolio-optimizer-end-to-end.md)


## Mechanisms

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_bloomberg_bloomberg_records](/tools/query-bloomberg-bloomberg-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_investment_portfolio_optimizer_controls_playbook](/tools/lookup-investment-portfolio-optimizer-controls-playbook.md)

## Entities that must be referenced

- cash_positions
- bloomberg_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [investment-portfolio-optimizer-controls-playbook](/documents/investment-portfolio-optimizer-controls-playbook.md)
