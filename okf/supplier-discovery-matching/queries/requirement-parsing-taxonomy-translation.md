---
type: Query Capability
title: "Interpret natural-language sourcing requirement ('nickel-based superalloy inv..."
description: "Interpret natural-language sourcing requirement ('nickel-based superalloy investment casting with NADCAP, North America, 5K units/year') and translate into search queries across Ariba, ThomasNet, and D&B taxonomies simultaneously."
source_id: "requirement-parsing-taxonomy-translation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Interpret natural-language sourcing requirement ('nickel-based superalloy investment casting with NADCAP, North America, 5K units/year') and translate into search queries across Ariba, ThomasNet, and D&B taxonomies simultaneously.

## Tools used

- [query_sap_ariba_discovery_suppliers](/tools/query-sap-ariba-discovery-suppliers.md)
- [query_thomasnet_thomasnet_records](/tools/query-thomasnet-thomasnet-records.md)
- [query_google_search_api_google_search_api_records](/tools/query-google-search-api-google-search-api-records.md)
- [lookup_supplier_discovery_matching_policy_guide](/tools/lookup-supplier-discovery-matching-policy-guide.md)
- [action_sap_ariba_discovery_match](/tools/action-sap-ariba-discovery-match.md)

## Runs in

- [requirement_parsing_taxonomy_translation](/workflow/requirement-parsing-taxonomy-translation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-discovery-matching-end-to-end.md)

# Citations

- [Supplier Discovery & Matching Procurement Policy Guide](/documents/supplier-discovery-matching-policy-guide.md)
