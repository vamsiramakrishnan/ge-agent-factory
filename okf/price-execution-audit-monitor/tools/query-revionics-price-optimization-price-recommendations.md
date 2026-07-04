---
type: Agent Tool
title: query_revionics_price_optimization_price_recommendations
description: Retrieve price recommendations from Revionics Price Optimization for the Price Execution Audit Monitor workflow.
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

Retrieve price recommendations from Revionics Price Optimization for the Price Execution Audit Monitor workflow.

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

- [price_of_record_intake](/workflow/price-of-record-intake.md)
- [pos_scan_reconciliation](/workflow/pos-scan-reconciliation.md)
- [variance_scoring_trend_baseline](/workflow/variance-scoring-trend-baseline.md)
- [guardrail_playbook_validation](/workflow/guardrail-playbook-validation.md)

## Evals

- [Run the Price Execution Audit Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/price-execution-audit-monitor-end-to-end.md)
- [Store 482 has been flagged for three consecutive scan-accuracy exceptions on SKU 40521193 (POS ringing $2.99 against a Revionics price of record of $2.49). The store_shift_summaries feed for store 482 hasn't refreshed in 3 business days. Determine whether this is a systemic price-zone feed failure or an isolated register error, and recommend the next action.](/tests/price-execution-audit-monitor-stale-feed-reconciliation.md)
- [Price zone 14 (urban_high_cost) shows elasticity_models with kvi_flag true for 24 SKUs where the Revionics recommended_retail deviates from current_retail by more than 3%. Cross-check whether this reprice batch trips the KVI basket guardrail before recommending activation, and cite the relevant markdown and promotion guardrail sections.](/tests/price-execution-audit-monitor-kvi-threshold-edge.md)

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
