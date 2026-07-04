---
type: Query Capability
title: "UNSPSC L1-L4 taxonomy classification on structured fields. Supplier entity re..."
description: "UNSPSC L1-L4 taxonomy classification on structured fields. Supplier entity resolution via clustering algorithms to merge name variants. Data quality scoring flags low-confidence records for LLM enrichment."
source_id: "ml-classification-entity-resolution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# UNSPSC L1-L4 taxonomy classification on structured fields. Supplier entity resolution via clustering algorithms to merge name variants. Data quality scoring flags low-confidence records for LLM enrichment.

## Tools used

- [query_ariba_ariba_records](/tools/query-ariba-ariba-records.md)
- [query_spendhq_spendhq_records](/tools/query-spendhq-spendhq-records.md)
- [lookup_spend_cube_builder_enrichment_policy_guide](/tools/lookup-spend-cube-builder-enrichment-policy-guide.md)
- [action_sap_s_4hana_enrich](/tools/action-sap-s-4hana-enrich.md)

## Runs in

- [ml_classification_entity_resolution](/workflow/ml-classification-entity-resolution.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Spend Cube Builder & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spend-cube-builder-enrichment-end-to-end.md)

# Citations

- [Spend Cube Builder & Enrichment Procurement Policy Guide](/documents/spend-cube-builder-enrichment-policy-guide.md)
