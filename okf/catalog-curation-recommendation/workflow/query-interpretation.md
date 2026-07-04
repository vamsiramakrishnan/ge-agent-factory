---
type: Workflow Stage
title: Query Interpretation
description: "Parse natural-language search queries that do not match catalog taxonomy — 'something to organize cables under my standing desk' mapped to cable management products. Intent classification routes between catalog search, spec-match, and alternative suggestion."
source_id: query_interpretation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Interpretation

Parse natural-language search queries that do not match catalog taxonomy — 'something to organize cables under my standing desk' mapped to cable management products. Intent classification routes between catalog search, spec-match, and alternative suggestion.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [lookup_catalog_curation_recommendation_policy_guide](/tools/lookup-catalog-curation-recommendation-policy-guide.md)
- [action_coupa_catalog_recommend](/tools/action-coupa-catalog-recommend.md)

Next: [Result Presentation](/workflow/result-presentation.md)
