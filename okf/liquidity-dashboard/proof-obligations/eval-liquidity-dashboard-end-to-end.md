---
type: Proof Obligation
title: "Golden eval obligation — Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-liquidity-dashboard-end-to-end"
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

# Golden eval obligation — Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [liquidity-dashboard-end-to-end](/tests/liquidity-dashboard-end-to-end.md)


## Mechanisms

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_liquidity_dashboard_controls_playbook](/tools/lookup-liquidity-dashboard-controls-playbook.md)
- [action_kyriba_recommend](/tools/action-kyriba-recommend.md)

## Entities that must be referenced

- cash_positions
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [liquidity-dashboard-controls-playbook](/documents/liquidity-dashboard-controls-playbook.md)
