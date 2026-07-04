---
type: Query Capability
title: Pull 3 years of category spend from Ariba and Coupa. Enrich with UNSPSC class...
description: Pull 3 years of category spend from Ariba and Coupa. Enrich with UNSPSC classification and supplier entity resolution from BigQuery spend cube.
source_id: "spend-aggregation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull 3 years of category spend from Ariba and Coupa. Enrich with UNSPSC classification and supplier entity resolution from BigQuery spend cube.

## Tools used

- [query_sap_ariba_category_mgmt_suppliers](/tools/query-sap-ariba-category-mgmt-suppliers.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_category_strategy_generator_policy_guide](/tools/lookup-category-strategy-generator-policy-guide.md)
- [action_sap_ariba_category_mgmt_generate](/tools/action-sap-ariba-category-mgmt-generate.md)

## Runs in

- [spend_aggregation](/workflow/spend-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Category Strategy Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-strategy-generator-end-to-end.md)

# Citations

- [Category Strategy Generator Procurement Policy Guide](/documents/category-strategy-generator-policy-guide.md)
