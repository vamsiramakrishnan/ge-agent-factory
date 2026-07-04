---
type: Eval Scenario
title: Model 481203 and Model 552910 both score SKU 40881234 in price_zone_id 14 (a ...
description: "Model 481203 and Model 552910 both score SKU 40881234 in price_zone_id 14 (a kvi_flag item), but Model 481203 reports own_price_elasticity of -2.8 while Model 552910 reports +0.4 for the same SKU and zone as of yesterday's refresh. A competitor just posted a $0.30 undercut on this item -- do we match, hold, or partial-match?"
source_id: "competitive-price-response-agent-elasticity-conflict"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Model 481203 and Model 552910 both score SKU 40881234 in price_zone_id 14 (a kvi_flag item), but Model 481203 reports own_price_elasticity of -2.8 while Model 552910 reports +0.4 for the same SKU and zone as of yesterday's refresh. A competitor just posted a $0.30 undercut on this item -- do we match, hold, or partial-match?

## Validates

- [competitor-feed-intake-zone-match](/queries/competitor-feed-intake-zone-match.md)

## Mechanisms to call

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_competitive_price_response_agent_execution_playbook](/tools/lookup-competitive-price-response-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Competitive Price Response Agent Retail Execution Playbook](/documents/competitive-price-response-agent-execution-playbook.md)
