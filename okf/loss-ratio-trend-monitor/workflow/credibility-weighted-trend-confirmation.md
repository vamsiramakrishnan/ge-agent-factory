---
type: Workflow Stage
title: "Credibility-Weighted Trend Confirmation"
description: "Weight each cell's variance_pct by credibility_factor and benchmark it against Looker dashboards and metric_definitions via query_looker_dashboards, so a thin-volume blip is not mistaken for confirmed deterioration."
source_id: credibility_weighted_trend_confirmation
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Credibility-Weighted Trend Confirmation

Weight each cell's variance_pct by credibility_factor and benchmark it against Looker dashboards and metric_definitions via query_looker_dashboards, so a thin-volume blip is not mistaken for confirmed deterioration.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_loss_ratio_trend_monitor_authority_guide](/tools/lookup-loss-ratio-trend-monitor-authority-guide.md)

Next: [Authority & Referral Gate](/workflow/authority-referral-gate.md)
