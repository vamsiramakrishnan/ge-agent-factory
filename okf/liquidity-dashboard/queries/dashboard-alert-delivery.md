---
type: Query Capability
title: Refresh Looker dashboards with current positions and deliver treasury briefin...
description: Refresh Looker dashboards with current positions and deliver treasury briefing. Execute approved sweep instructions through TMS.
source_id: "dashboard-alert-delivery"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Refresh Looker dashboards with current positions and deliver treasury briefing. Execute approved sweep instructions through TMS.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_liquidity_dashboard_controls_playbook](/tools/lookup-liquidity-dashboard-controls-playbook.md)

## Runs in

- [dashboard_alert_delivery](/workflow/dashboard-alert-delivery.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/liquidity-dashboard-end-to-end.md)

# Citations

- [Liquidity Dashboard Controls Playbook](/documents/liquidity-dashboard-controls-playbook.md)
