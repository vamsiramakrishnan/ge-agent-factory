---
type: Proof Obligation
title: "Golden eval obligation — Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-supplier-discovery-matching-end-to-end"
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

# Golden eval obligation — Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [supplier-discovery-matching-end-to-end](/tests/supplier-discovery-matching-end-to-end.md)


## Mechanisms

- [query_sap_ariba_discovery_suppliers](/tools/query-sap-ariba-discovery-suppliers.md)
- [query_thomasnet_thomasnet_records](/tools/query-thomasnet-thomasnet-records.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [query_google_search_api_google_search_api_records](/tools/query-google-search-api-google-search-api-records.md)
- [lookup_supplier_discovery_matching_policy_guide](/tools/lookup-supplier-discovery-matching-policy-guide.md)
- [action_sap_ariba_discovery_match](/tools/action-sap-ariba-discovery-match.md)

## Entities that must be referenced

- suppliers
- thomasnet_records
- d_b_records
- google_search_api_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute match without two-system evidence

# Citations

- [supplier-discovery-matching-policy-guide](/documents/supplier-discovery-matching-policy-guide.md)
