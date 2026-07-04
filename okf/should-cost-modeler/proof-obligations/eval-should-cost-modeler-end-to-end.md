---
type: Proof Obligation
title: "Golden eval obligation — Run the Should-Cost Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-should-cost-modeler-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Should-Cost Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [should-cost-modeler-end-to-end](/tests/should-cost-modeler-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_bom_routing_sap_s_4hana_bom_routing_records](/tools/query-sap-s-4hana-bom-routing-sap-s-4hana-bom-routing-records.md)
- [query_commodity_price_feeds_commodity_price_feeds_records](/tools/query-commodity-price-feeds-commodity-price-feeds-records.md)
- [query_industry_benchmarks_industry_benchmarks_records](/tools/query-industry-benchmarks-industry-benchmarks-records.md)
- [lookup_should_cost_modeler_policy_guide](/tools/lookup-should-cost-modeler-policy-guide.md)
- [action_sap_s_4hana_bom_routing_generate](/tools/action-sap-s-4hana-bom-routing-generate.md)

## Entities that must be referenced

- sap_s_4hana_bom_routing_records
- commodity_price_feeds_records
- industry_benchmarks_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [should-cost-modeler-policy-guide](/documents/should-cost-modeler-policy-guide.md)
