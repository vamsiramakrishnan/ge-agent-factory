---
type: Proof Obligation
title: "Golden eval obligation — SKU 48213076 in price_zone 17 shows a recommended_retail of $6.49 in price_recommendations dated 2026-06-28, but Oracle Retail MFCS logged a cost_changes record effective 2026-07-01 raising new_unit_cost from $4.10 to $6.85 for the same SKU due to a tariff_adjustment. Reconcile whether the markdown can still go out, and if not, tell me what to do."
description: golden eval proof obligation
source_id: "eval-markdown-optimization-engine-cost-vs-markdown-conflict"
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

# Golden eval obligation — SKU 48213076 in price_zone 17 shows a recommended_retail of $6.49 in price_recommendations dated 2026-06-28, but Oracle Retail MFCS logged a cost_changes record effective 2026-07-01 raising new_unit_cost from $4.10 to $6.85 for the same SKU due to a tariff_adjustment. Reconcile whether the markdown can still go out, and if not, tell me what to do.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [markdown-optimization-engine-cost-vs-markdown-conflict](/tests/markdown-optimization-engine-cost-vs-markdown-conflict.md)


## Mechanisms

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)

## Entities that must be referenced

- price_recommendations
- item_master
- cost_changes

## Forbidden behaviors

- publishing or executing the $6.49 markdown without reconciling the newer cost_changes record
- fabricating a corrected unit_cost instead of requesting buyer confirmation

# Citations

- [markdown-optimization-engine-execution-playbook](/documents/markdown-optimization-engine-execution-playbook.md)
- [markdown-optimization-engine-map-compliance-bulletin](/documents/markdown-optimization-engine-map-compliance-bulletin.md)
