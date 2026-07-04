---
type: Query Capability
title: "Compliant product recommendations presented with price comparisons, product s..."
description: "Compliant product recommendations presented with price comparisons, product summaries, and contracted-supplier prioritization. Higher-value items include generated comparison narratives."
source_id: "result-presentation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compliant product recommendations presented with price comparisons, product summaries, and contracted-supplier prioritization. Higher-value items include generated comparison narratives.

## Tools used

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [lookup_catalog_curation_recommendation_policy_guide](/tools/lookup-catalog-curation-recommendation-policy-guide.md)
- [action_coupa_catalog_recommend](/tools/action-coupa-catalog-recommend.md)

## Runs in

- [result_presentation](/workflow/result-presentation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/catalog-curation-recommendation-end-to-end.md)

# Citations

- [Catalog Curation & Recommendation Procurement Policy Guide](/documents/catalog-curation-recommendation-policy-guide.md)
