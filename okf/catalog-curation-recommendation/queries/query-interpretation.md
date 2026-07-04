---
type: Query Capability
title: "Parse natural-language search queries that do not match catalog taxonomy — 's..."
description: "Parse natural-language search queries that do not match catalog taxonomy — 'something to organize cables under my standing desk' mapped to cable management products. Intent classification routes between catalog search, spec-match, and alternative suggestion."
source_id: "query-interpretation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse natural-language search queries that do not match catalog taxonomy — 'something to organize cables under my standing desk' mapped to cable management products. Intent classification routes between catalog search, spec-match, and alternative suggestion.

## Tools used

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [lookup_catalog_curation_recommendation_policy_guide](/tools/lookup-catalog-curation-recommendation-policy-guide.md)
- [action_coupa_catalog_recommend](/tools/action-coupa-catalog-recommend.md)

## Runs in

- [query_interpretation](/workflow/query-interpretation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/catalog-curation-recommendation-end-to-end.md)

# Citations

- [Catalog Curation & Recommendation Procurement Policy Guide](/documents/catalog-curation-recommendation-policy-guide.md)
