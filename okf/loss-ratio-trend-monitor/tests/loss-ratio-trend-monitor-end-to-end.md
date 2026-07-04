---
type: Eval Scenario
title: Run the Loss Ratio Trend Monitor workflow for the current period. Cite the re...
description: "Run the Loss Ratio Trend Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "loss-ratio-trend-monitor-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Loss Ratio Trend Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_loss_ratio_trend_monitor_authority_guide](/tools/lookup-loss-ratio-trend-monitor-authority-guide.md)
- [action_verisk_iso_erc_escalate](/tools/action-verisk-iso-erc-escalate.md)

## Success rubric

Action escalate executed against Verisk ISO ERC, with audit-trail entry and Chief Actuary notified of outcomes.

# Citations

- [Loss Ratio Trend Monitor Authority & Referral Guide](/documents/loss-ratio-trend-monitor-authority-guide.md)
