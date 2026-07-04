---
type: Workflow Stage
title: "ML Classification & Entity Resolution"
description: "UNSPSC L1-L4 taxonomy classification on structured fields. Supplier entity resolution via clustering algorithms to merge name variants. Data quality scoring flags low-confidence records for LLM enrichment."
source_id: ml_classification_entity_resolution
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ML Classification & Entity Resolution

UNSPSC L1-L4 taxonomy classification on structured fields. Supplier entity resolution via clustering algorithms to merge name variants. Data quality scoring flags low-confidence records for LLM enrichment.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_ariba_ariba_records](/tools/query-ariba-ariba-records.md)
- [query_spendhq_spendhq_records](/tools/query-spendhq-spendhq-records.md)
- [lookup_spend_cube_builder_enrichment_policy_guide](/tools/lookup-spend-cube-builder-enrichment-policy-guide.md)
- [action_sap_s_4hana_enrich](/tools/action-sap-s-4hana-enrich.md)

Next: [LLM Enrichment](/workflow/llm-enrichment.md)
