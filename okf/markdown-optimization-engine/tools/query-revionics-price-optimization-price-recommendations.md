---
type: Agent Tool
title: query_revionics_price_optimization_price_recommendations
description: Retrieve price recommendations from Revionics Price Optimization for the Markdown Optimization Engine workflow.
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

Retrieve price recommendations from Revionics Price Optimization for the Markdown Optimization Engine workflow.

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

- [elasticity_zone_intake](/workflow/elasticity-zone-intake.md)
- [aging_inventory_detection](/workflow/aging-inventory-detection.md)
- [markdown_ladder_simulation](/workflow/markdown-ladder-simulation.md)
- [playbook_guardrail_validation](/workflow/playbook-guardrail-validation.md)
- [escalate_audit](/workflow/escalate-audit.md)

## Evals

- [Run the Markdown Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/markdown-optimization-engine-end-to-end.md)
- [SKU 48213076 in price_zone 17 shows a recommended_retail of $6.49 in price_recommendations dated 2026-06-28, but Oracle Retail MFCS logged a cost_changes record effective 2026-07-01 raising new_unit_cost from $4.10 to $6.85 for the same SKU due to a tariff_adjustment. Reconcile whether the markdown can still go out, and if not, tell me what to do.](/tests/markdown-optimization-engine-cost-vs-markdown-conflict.md)
- [Item 55190244 (department general_merchandise, item_status clearance) is sitting at weeks_of_supply 21.4 with only a first_markdown_25 applied per the June 20 price_recommendations pull, and BigQuery analytics_events hasn't refreshed for this zone since June 25 (over 24 hours stale). Decide whether to push a deeper markdown now.](/tests/markdown-optimization-engine-aging-clearance-edge.md)

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
