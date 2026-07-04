---
type: Eval Scenario
title: "Run the Should-Cost Modeler workflow for the current period. Cite the relevan..."
description: "Run the Should-Cost Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "should-cost-modeler-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Should-Cost Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cost-data-assembly](/queries/cost-data-assembly.md)

## Mechanisms to call

- [query_sap_s_4hana_bom_routing_sap_s_4hana_bom_routing_records](/tools/query-sap-s-4hana-bom-routing-sap-s-4hana-bom-routing-records.md)
- [query_commodity_price_feeds_commodity_price_feeds_records](/tools/query-commodity-price-feeds-commodity-price-feeds-records.md)
- [query_industry_benchmarks_industry_benchmarks_records](/tools/query-industry-benchmarks-industry-benchmarks-records.md)
- [lookup_should_cost_modeler_policy_guide](/tools/lookup-should-cost-modeler-policy-guide.md)
- [action_sap_s_4hana_bom_routing_generate](/tools/action-sap-s-4hana-bom-routing-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA (BOM/routing), with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [Should-Cost Modeler Procurement Policy Guide](/documents/should-cost-modeler-policy-guide.md)
