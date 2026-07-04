---
type: Eval Scenario
title: "Run the Catalog Curation & Recommendation workflow for the current period. Ci..."
description: "Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "catalog-curation-recommendation-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [query-interpretation](/queries/query-interpretation.md)

## Mechanisms to call

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [query_amazon_business_amazon_business_records](/tools/query-amazon-business-amazon-business-records.md)
- [query_punchout_catalogs_punchout_catalogs_records](/tools/query-punchout-catalogs-punchout-catalogs-records.md)
- [query_ariba_ariba_records](/tools/query-ariba-ariba-records.md)
- [lookup_catalog_curation_recommendation_policy_guide](/tools/lookup-catalog-curation-recommendation-policy-guide.md)
- [action_coupa_catalog_recommend](/tools/action-coupa-catalog-recommend.md)

## Success rubric

Action recommend executed against Coupa catalog, with audit-trail entry and Buyer notified of outcomes.

# Citations

- [Catalog Curation & Recommendation Procurement Policy Guide](/documents/catalog-curation-recommendation-policy-guide.md)
