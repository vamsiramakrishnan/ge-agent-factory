---
type: Agent Tool
title: query_revionics_price_optimization_price_recommendations
description: Retrieve price recommendations from Revionics Price Optimization for the Promo Forecast Accuracy Analyzer workflow.
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

Retrieve price recommendations from Revionics Price Optimization for the Promo Forecast Accuracy Analyzer workflow.

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

- [retrieve_records](/workflow/retrieve-records.md)

## Evals

- [Run the Promo Forecast Accuracy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/promo-forecast-accuracy-analyzer-end-to-end.md)

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
