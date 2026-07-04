---
type: Proof Obligation
title: "Golden eval obligation — Price zone 14 (urban_high_cost) shows elasticity_models with kvi_flag true for 24 SKUs where the Revionics recommended_retail deviates from current_retail by more than 3%. Cross-check whether this reprice batch trips the KVI basket guardrail before recommending activation, and cite the relevant markdown and promotion guardrail sections."
description: golden eval proof obligation
source_id: "eval-price-execution-audit-monitor-kvi-threshold-edge"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Price zone 14 (urban_high_cost) shows elasticity_models with kvi_flag true for 24 SKUs where the Revionics recommended_retail deviates from current_retail by more than 3%. Cross-check whether this reprice batch trips the KVI basket guardrail before recommending activation, and cite the relevant markdown and promotion guardrail sections.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [price-execution-audit-monitor-kvi-threshold-edge](/tests/price-execution-audit-monitor-kvi-threshold-edge.md)


## Mechanisms

- [query_revionics_price_optimization_elasticity_models](/tools/query-revionics-price-optimization-elasticity-models.md)
- [query_revionics_price_optimization_price_zones](/tools/query-revionics-price-optimization-price-zones.md)
- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)

## Entities that must be referenced

- elasticity_models
- price_zones
- price_recommendations

## Forbidden behaviors

- auto-escalating to pricing_director for a 24-item batch without checking it against the actual 25-item threshold
- treating the 3% zone move as automatically disqualifying without confirming whether it exceeds the guardrail

# Citations

- [price-execution-audit-monitor-execution-playbook](/documents/price-execution-audit-monitor-execution-playbook.md)
