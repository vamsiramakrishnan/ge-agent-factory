---
type: Proof Obligation
title: "Golden eval obligation — Run the Product Profitability Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-product-profitability-analyzer-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Product Profitability Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [product-profitability-analyzer-end-to-end](/tests/product-profitability-analyzer-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_product_profitability_analyzer_controls_playbook](/tools/lookup-product-profitability-analyzer-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

## Entities that must be referenced

- cost_centers
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [product-profitability-analyzer-controls-playbook](/documents/product-profitability-analyzer-controls-playbook.md)
