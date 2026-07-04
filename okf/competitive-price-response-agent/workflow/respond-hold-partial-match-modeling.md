---
type: Workflow Stage
title: "Respond/Hold/Partial-Match Modeling"
description: "Model the margin_impact_dollars and weeks_of_supply consequence of respond, hold, and partial-match options per item, weighting price-image sensitivity from the zone's pricing_strategy."
source_id: respond_hold_partial_match_modeling
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Respond/Hold/Partial-Match Modeling

Model the margin_impact_dollars and weeks_of_supply consequence of respond, hold, and partial-match options per item, weighting price-image sensitivity from the zone's pricing_strategy.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)
- [action_revionics_price_optimization_recommend](/tools/action-revionics-price-optimization-recommend.md)

Next: [Playbook & MAP Guardrail Check](/workflow/playbook-map-guardrail-check.md)
