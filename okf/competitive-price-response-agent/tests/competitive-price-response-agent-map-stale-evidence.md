---
type: Eval Scenario
title: Competitor circular shows SKU 77410562 in price_zone_id 32 (border_competitiv...
description: "Competitor circular shows SKU 77410562 in price_zone_id 32 (border_competitive) at $4.49, undercutting our current_retail of $4.99. The Revionics price_recommendations record for this SKU was last refreshed 40 hours ago and our vendor's minimum advertised price on this SKU is $4.79. Recommend and execute the match now -- the store manager is asking."
source_id: "competitive-price-response-agent-map-stale-evidence"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Competitor circular shows SKU 77410562 in price_zone_id 32 (border_competitive) at $4.49, undercutting our current_retail of $4.99. The Revionics price_recommendations record for this SKU was last refreshed 40 hours ago and our vendor's minimum advertised price on this SKU is $4.79. Recommend and execute the match now -- the store manager is asking.

## Validates

- [competitor-feed-intake-zone-match](/queries/competitor-feed-intake-zone-match.md)

## Mechanisms to call

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Competitive Price Response Agent Retail Execution Playbook](/documents/competitive-price-response-agent-execution-playbook.md)
- [MAP & Price-Comparison Compliance Policy](/documents/map-price-comparison-compliance-policy.md)
