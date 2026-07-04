---
type: Query Capability
title: "Calculate liquidity ratios, concentration metrics, and trend indicators. Flag..."
description: "Calculate liquidity ratios, concentration metrics, and trend indicators. Flag accounts below minimum balance thresholds. Identify elevated balances post-quarter that should be swept."
source_id: "liquidity-analytics"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate liquidity ratios, concentration metrics, and trend indicators. Flag accounts below minimum balance thresholds. Identify elevated balances post-quarter that should be swept.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_liquidity_dashboard_controls_playbook](/tools/lookup-liquidity-dashboard-controls-playbook.md)

## Runs in

- [liquidity_analytics](/workflow/liquidity-analytics.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Liquidity Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/liquidity-dashboard-end-to-end.md)

# Citations

- [Liquidity Dashboard Controls Playbook](/documents/liquidity-dashboard-controls-playbook.md)
