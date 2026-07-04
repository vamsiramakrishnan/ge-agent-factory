---
type: Workflow Stage
title: Liquidity Analytics
description: "Calculate liquidity ratios, concentration metrics, and trend indicators. Flag accounts below minimum balance thresholds. Identify elevated balances post-quarter that should be swept."
source_id: liquidity_analytics
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Liquidity Analytics

Calculate liquidity ratios, concentration metrics, and trend indicators. Flag accounts below minimum balance thresholds. Identify elevated balances post-quarter that should be swept.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_liquidity_dashboard_controls_playbook](/tools/lookup-liquidity-dashboard-controls-playbook.md)

Next: [Treasury Briefing Generation](/workflow/treasury-briefing-generation.md)
