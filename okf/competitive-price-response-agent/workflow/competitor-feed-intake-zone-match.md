---
type: Workflow Stage
title: "Competitor Feed Intake & Zone Match"
description: "Pull competitor-triggered price_recommendations and current price_zones from Revionics Price Optimization, matching each SKU to its price_zone_id and competitive_price_index before any move is scored."
source_id: competitor_feed_intake_zone_match
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Competitor Feed Intake & Zone Match

Pull competitor-triggered price_recommendations and current price_zones from Revionics Price Optimization, matching each SKU to its price_zone_id and competitive_price_index before any move is scored.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)
- [action_revionics_price_optimization_recommend](/tools/action-revionics-price-optimization-recommend.md)

Next: [KVI Move Detection & Elasticity Scoring](/workflow/kvi-move-detection-elasticity-scoring.md)
