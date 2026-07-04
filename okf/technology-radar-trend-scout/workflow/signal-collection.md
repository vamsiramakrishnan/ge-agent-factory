---
type: Workflow Stage
title: Signal Collection
description: "Scan technology adoption trends from GitHub trending, StackShare data, Gartner research, and internal codebase analysis. Track open-source project health signals (stars, contributors, release cadence)."
source_id: signal_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Signal Collection

Scan technology adoption trends from GitHub trending, StackShare data, Gartner research, and internal codebase analysis. Track open-source project health signals (stars, contributors, release cadence).

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_gartner_api_gartner_api_records](/tools/query-gartner-api-gartner-api-records.md)
- [lookup_technology_radar_trend_scout_runbook](/tools/lookup-technology-radar-trend-scout-runbook.md)
- [action_github_update](/tools/action-github-update.md)

Next: [Adoption Curve Modeling](/workflow/adoption-curve-modeling.md)
