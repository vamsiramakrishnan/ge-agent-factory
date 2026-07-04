---
type: Agent Tool
title: query_revionics_price_optimization_price_zones
description: Retrieve price zones from Revionics Price Optimization for the Price Execution Audit Monitor workflow.
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

# query_revionics_price_optimization_price_zones

Retrieve price zones from Revionics Price Optimization for the Price Execution Audit Monitor workflow.

- **Kind:** query
- **Source system:** [Revionics Price Optimization](/systems/revionics-price-optimization.md)

## Inputs

- price_zone_id
- date_range

## Outputs

- price_zones_records

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

_Not bound to a workflow stage._

## Evals

- [Price zone 14 (urban_high_cost) shows elasticity_models with kvi_flag true for 24 SKUs where the Revionics recommended_retail deviates from current_retail by more than 3%. Cross-check whether this reprice batch trips the KVI basket guardrail before recommending activation, and cite the relevant markdown and promotion guardrail sections.](/tests/price-execution-audit-monitor-kvi-threshold-edge.md)

## Evidence emitted

- sql_result

## Required inputs

- price_zone_id
- date_range

## Produces

- price_zones_records

# Examples

```
query_revionics_price_optimization_price_zones(price_zone_id=<price_zone_id>, date_range=<date_range>)
```

# Citations

- [Revionics Price Optimization](/systems/revionics-price-optimization.md)
