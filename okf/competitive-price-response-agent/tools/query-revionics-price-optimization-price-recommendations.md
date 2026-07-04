---
type: Agent Tool
title: query_revionics_price_optimization_price_recommendations
description: Retrieve price recommendations from Revionics Price Optimization for the Competitive Price Response Agent workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_revionics_price_optimization_price_recommendations

Retrieve price recommendations from Revionics Price Optimization for the Competitive Price Response Agent workflow.

- **Kind:** query
- **Source system:** [Revionics Price Optimization](/systems/revionics-price-optimization.md)

## Inputs

- sku
- price_zone_id
- date_range

## Outputs

- price_recommendations_records
- price_recommendations_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Revionics Price Optimization](/systems/revionics-price-optimization.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [competitor_feed_intake_zone_match](/workflow/competitor-feed-intake-zone-match.md)
- [kvi_move_detection_elasticity_scoring](/workflow/kvi-move-detection-elasticity-scoring.md)
- [respond_hold_partial_match_modeling](/workflow/respond-hold-partial-match-modeling.md)
- [playbook_map_guardrail_check](/workflow/playbook-map-guardrail-check.md)
- [rule_execution_audit](/workflow/rule-execution-audit.md)
- [kpi_reporting_to_pricing_manager](/workflow/kpi-reporting-to-pricing-manager.md)

## Evals

- [Run the Competitive Price Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-price-response-agent-end-to-end.md)
- [Model 481203 and Model 552910 both score SKU 40881234 in price_zone_id 14 (a kvi_flag item), but Model 481203 reports own_price_elasticity of -2.8 while Model 552910 reports +0.4 for the same SKU and zone as of yesterday's refresh. A competitor just posted a $0.30 undercut on this item -- do we match, hold, or partial-match?](/tests/competitive-price-response-agent-elasticity-conflict.md)
- [Competitor circular shows SKU 77410562 in price_zone_id 32 (border_competitive) at $4.49, undercutting our current_retail of $4.99. The Revionics price_recommendations record for this SKU was last refreshed 40 hours ago and our vendor's minimum advertised price on this SKU is $4.79. Recommend and execute the match now -- the store manager is asking.](/tests/competitive-price-response-agent-map-stale-evidence.md)

## Evidence emitted

- sql_result

## Required inputs

- sku
- price_zone_id
- date_range

## Produces

- price_recommendations_records
- price_recommendations_summary

# Examples

```
query_revionics_price_optimization_price_recommendations(sku=<sku>, price_zone_id=<price_zone_id>, date_range=<date_range>)
```

# Citations

- [Revionics Price Optimization](/systems/revionics-price-optimization.md)
