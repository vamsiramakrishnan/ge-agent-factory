---
type: Query Capability
title: Pull BOM and routing data from SAP S/4HANA. Fetch current commodity indices f...
description: Pull BOM and routing data from SAP S/4HANA. Fetch current commodity indices from price feeds. Retrieve labor rate benchmarks by geography and process type.
source_id: "cost-data-assembly"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull BOM and routing data from SAP S/4HANA. Fetch current commodity indices from price feeds. Retrieve labor rate benchmarks by geography and process type.

## Tools used

- [query_sap_s_4hana_bom_routing_sap_s_4hana_bom_routing_records](/tools/query-sap-s-4hana-bom-routing-sap-s-4hana-bom-routing-records.md)
- [query_commodity_price_feeds_commodity_price_feeds_records](/tools/query-commodity-price-feeds-commodity-price-feeds-records.md)
- [query_industry_benchmarks_industry_benchmarks_records](/tools/query-industry-benchmarks-industry-benchmarks-records.md)
- [lookup_should_cost_modeler_policy_guide](/tools/lookup-should-cost-modeler-policy-guide.md)
- [action_sap_s_4hana_bom_routing_generate](/tools/action-sap-s-4hana-bom-routing-generate.md)

## Runs in

- [cost_data_assembly](/workflow/cost-data-assembly.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Should-Cost Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/should-cost-modeler-end-to-end.md)

# Citations

- [Should-Cost Modeler Procurement Policy Guide](/documents/should-cost-modeler-policy-guide.md)
