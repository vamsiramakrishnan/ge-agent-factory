---
type: Proof Obligation
title: "Golden eval obligation — Model 481203 and Model 552910 both score SKU 40881234 in price_zone_id 14 (a kvi_flag item), but Model 481203 reports own_price_elasticity of -2.8 while Model 552910 reports +0.4 for the same SKU and zone as of yesterday's refresh. A competitor just posted a $0.30 undercut on this item -- do we match, hold, or partial-match?"
description: golden eval proof obligation
source_id: "eval-competitive-price-response-agent-elasticity-conflict"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Model 481203 and Model 552910 both score SKU 40881234 in price_zone_id 14 (a kvi_flag item), but Model 481203 reports own_price_elasticity of -2.8 while Model 552910 reports +0.4 for the same SKU and zone as of yesterday's refresh. A competitor just posted a $0.30 undercut on this item -- do we match, hold, or partial-match?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [competitive-price-response-agent-elasticity-conflict](/tests/competitive-price-response-agent-elasticity-conflict.md)


## Mechanisms

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)

## Entities that must be referenced

- elasticity_models
- price_recommendations
- price_zones

## Forbidden behaviors

- silently averaging or picking one of the two contradictory elasticity readings
- executing a recommend action before the conflict is escalated

# Citations

- [competitive-price-response-agent-execution-playbook](/documents/competitive-price-response-agent-execution-playbook.md)
