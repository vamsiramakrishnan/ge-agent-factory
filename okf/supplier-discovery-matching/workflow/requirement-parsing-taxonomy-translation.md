---
type: Workflow Stage
title: "Requirement Parsing & Taxonomy Translation"
description: "Interpret natural-language sourcing requirement ('nickel-based superalloy investment casting with NADCAP, North America, 5K units/year') and translate into search queries across Ariba, ThomasNet, and D&B taxonomies simultaneously."
source_id: requirement_parsing_taxonomy_translation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Requirement Parsing & Taxonomy Translation

Interpret natural-language sourcing requirement ('nickel-based superalloy investment casting with NADCAP, North America, 5K units/year') and translate into search queries across Ariba, ThomasNet, and D&B taxonomies simultaneously.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_ariba_discovery_suppliers](/tools/query-sap-ariba-discovery-suppliers.md)
- [query_thomasnet_thomasnet_records](/tools/query-thomasnet-thomasnet-records.md)
- [query_google_search_api_google_search_api_records](/tools/query-google-search-api-google-search-api-records.md)
- [lookup_supplier_discovery_matching_policy_guide](/tools/lookup-supplier-discovery-matching-policy-guide.md)
- [action_sap_ariba_discovery_match](/tools/action-sap-ariba-discovery-match.md)

Next: [Multi-Source Discovery & Filtering](/workflow/multi-source-discovery-filtering.md)
