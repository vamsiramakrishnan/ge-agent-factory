---
type: Eval Scenario
title: "Run the Supplier Discovery & Matching workflow for the current period. Cite t..."
description: "Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-discovery-matching-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [requirement-parsing-taxonomy-translation](/queries/requirement-parsing-taxonomy-translation.md)

## Mechanisms to call

- [query_sap_ariba_discovery_suppliers](/tools/query-sap-ariba-discovery-suppliers.md)
- [query_thomasnet_thomasnet_records](/tools/query-thomasnet-thomasnet-records.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [query_google_search_api_google_search_api_records](/tools/query-google-search-api-google-search-api-records.md)
- [lookup_supplier_discovery_matching_policy_guide](/tools/lookup-supplier-discovery-matching-policy-guide.md)
- [action_sap_ariba_discovery_match](/tools/action-sap-ariba-discovery-match.md)

## Success rubric

Action match executed against SAP Ariba Discovery, with audit-trail entry and Sourcing Specialist notified of outcomes.

# Citations

- [Supplier Discovery & Matching Procurement Policy Guide](/documents/supplier-discovery-matching-policy-guide.md)
