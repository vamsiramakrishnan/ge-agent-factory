---
type: Query Capability
title: "Execute embedding-based semantic search across supplier capability databases...."
description: "Execute embedding-based semantic search across supplier capability databases. Apply geographic, capacity, and certification filters. Aggregate results from multiple platforms with different data models."
source_id: "multi-source-discovery-filtering"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execute embedding-based semantic search across supplier capability databases. Apply geographic, capacity, and certification filters. Aggregate results from multiple platforms with different data models.

## Tools used

- [query_sap_ariba_discovery_suppliers](/tools/query-sap-ariba-discovery-suppliers.md)
- [query_google_search_api_google_search_api_records](/tools/query-google-search-api-google-search-api-records.md)
- [lookup_supplier_discovery_matching_policy_guide](/tools/lookup-supplier-discovery-matching-policy-guide.md)
- [action_sap_ariba_discovery_match](/tools/action-sap-ariba-discovery-match.md)

## Runs in

- [multi_source_discovery_filtering](/workflow/multi-source-discovery-filtering.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-discovery-matching-end-to-end.md)

# Citations

- [Supplier Discovery & Matching Procurement Policy Guide](/documents/supplier-discovery-matching-policy-guide.md)
