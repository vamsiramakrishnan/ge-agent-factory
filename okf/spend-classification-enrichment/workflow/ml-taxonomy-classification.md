---
type: Workflow Stage
title: ML Taxonomy Classification
description: "UNSPSC/eClass L1-L4 classification on structured fields — vendor name, material group, cost center. Confidence scoring determines which records route to LLM for disambiguation."
source_id: ml_taxonomy_classification
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ML Taxonomy Classification

UNSPSC/eClass L1-L4 classification on structured fields — vendor name, material group, cost center. Confidence scoring determines which records route to LLM for disambiguation.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_spendhq_spendhq_records](/tools/query-spendhq-spendhq-records.md)
- [query_sievo_sievo_records](/tools/query-sievo-sievo-records.md)
- [lookup_spend_classification_enrichment_policy_guide](/tools/lookup-spend-classification-enrichment-policy-guide.md)

Next: [Spend Cube Load](/workflow/spend-cube-load.md)
