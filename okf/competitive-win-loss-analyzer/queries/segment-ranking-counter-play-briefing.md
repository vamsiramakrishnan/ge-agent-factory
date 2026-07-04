---
type: Query Capability
title: "Use Looker dashboards, explore_queries, and metric_definitions to rank the th..."
description: "Use Looker dashboards, explore_queries, and metric_definitions to rank the three most contested market/product segments and draft counter-play recommendations for sales leadership."
source_id: "segment-ranking-counter-play-briefing"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Use Looker dashboards, explore_queries, and metric_definitions to rank the three most contested market/product segments and draft counter-play recommendations for sales leadership.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_salesforce_communications_cloud_recommend](/tools/action-salesforce-communications-cloud-recommend.md)

## Runs in

- [segment_ranking_counter_play_briefing](/workflow/segment-ranking-counter-play-briefing.md)

## Evidence expected

- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the Competitive Win-Loss Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-win-loss-analyzer-end-to-end.md)

# Citations

- [Competitive Win-Loss Analyzer Service Assurance Runbook](/documents/competitive-win-loss-analyzer-assurance-runbook.md)
- [Consumer & SMB Discount Authority Matrix](/documents/competitive-win-loss-analyzer-discount-authority-matrix.md)
