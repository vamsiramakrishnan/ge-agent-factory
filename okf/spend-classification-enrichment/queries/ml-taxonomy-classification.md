---
type: Query Capability
title: "UNSPSC/eClass L1-L4 classification on structured fields — vendor name, materi..."
description: "UNSPSC/eClass L1-L4 classification on structured fields — vendor name, material group, cost center. Confidence scoring determines which records route to LLM for disambiguation."
source_id: "ml-taxonomy-classification"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# UNSPSC/eClass L1-L4 classification on structured fields — vendor name, material group, cost center. Confidence scoring determines which records route to LLM for disambiguation.

## Tools used

- [query_spendhq_spendhq_records](/tools/query-spendhq-spendhq-records.md)
- [query_sievo_sievo_records](/tools/query-sievo-sievo-records.md)
- [lookup_spend_classification_enrichment_policy_guide](/tools/lookup-spend-classification-enrichment-policy-guide.md)

## Runs in

- [ml_taxonomy_classification](/workflow/ml-taxonomy-classification.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Spend Classification & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spend-classification-enrichment-end-to-end.md)

# Citations

- [Spend Classification & Enrichment Procurement Policy Guide](/documents/spend-classification-enrichment-policy-guide.md)
