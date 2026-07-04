---
type: Eval Scenario
title: Price zone 14 (urban_high_cost) shows elasticity_models with kvi_flag true fo...
description: "Price zone 14 (urban_high_cost) shows elasticity_models with kvi_flag true for 24 SKUs where the Revionics recommended_retail deviates from current_retail by more than 3%. Cross-check whether this reprice batch trips the KVI basket guardrail before recommending activation, and cite the relevant markdown and promotion guardrail sections."
source_id: "price-execution-audit-monitor-kvi-threshold-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Price zone 14 (urban_high_cost) shows elasticity_models with kvi_flag true for 24 SKUs where the Revionics recommended_retail deviates from current_retail by more than 3%. Cross-check whether this reprice batch trips the KVI basket guardrail before recommending activation, and cite the relevant markdown and promotion guardrail sections.

## Validates

- [price-of-record-intake](/queries/price-of-record-intake.md)

## Mechanisms to call

- [query_revionics_price_optimization_elasticity_models](/tools/query-revionics-price-optimization-elasticity-models.md)
- [query_revionics_price_optimization_price_zones](/tools/query-revionics-price-optimization-price-zones.md)
- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Price Execution Audit Monitor Retail Execution Playbook](/documents/price-execution-audit-monitor-execution-playbook.md)
