---
type: Eval Scenario
title: Run the Liquidity Dashboard workflow for the current period. Cite the relevan...
description: "Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "liquidity-dashboard-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [dashboard-alert-delivery](/queries/dashboard-alert-delivery.md)

## Mechanisms to call

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_liquidity_dashboard_controls_playbook](/tools/lookup-liquidity-dashboard-controls-playbook.md)
- [action_kyriba_recommend](/tools/action-kyriba-recommend.md)

## Success rubric

Action recommend executed against Kyriba, with audit-trail entry and Treasurer notified of outcomes.

# Citations

- [Liquidity Dashboard Controls Playbook](/documents/liquidity-dashboard-controls-playbook.md)
