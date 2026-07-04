---
type: Proof Obligation
title: "Golden eval obligation — Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-catalog-curation-recommendation-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [catalog-curation-recommendation-end-to-end](/tests/catalog-curation-recommendation-end-to-end.md)


## Mechanisms

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [query_amazon_business_amazon_business_records](/tools/query-amazon-business-amazon-business-records.md)
- [query_punchout_catalogs_punchout_catalogs_records](/tools/query-punchout-catalogs-punchout-catalogs-records.md)
- [query_ariba_ariba_records](/tools/query-ariba-ariba-records.md)
- [lookup_catalog_curation_recommendation_policy_guide](/tools/lookup-catalog-curation-recommendation-policy-guide.md)
- [action_coupa_catalog_recommend](/tools/action-coupa-catalog-recommend.md)

## Entities that must be referenced

- catalog_items
- amazon_business_records
- punchout_catalogs_records
- ariba_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [catalog-curation-recommendation-policy-guide](/documents/catalog-curation-recommendation-policy-guide.md)
