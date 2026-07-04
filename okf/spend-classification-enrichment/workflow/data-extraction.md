---
type: Workflow Stage
title: Data Extraction
description: Extract PO and invoice line items from SAP S/4HANA and Coupa. Normalize fields across source systems into a common schema for classification.
source_id: data_extraction
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Extraction

Extract PO and invoice line items from SAP S/4HANA and Coupa. Normalize fields across source systems into a common schema for classification.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_fi_mm_gl_entries](/tools/query-sap-s-4hana-fi-mm-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_spend_classification_enrichment_policy_guide](/tools/lookup-spend-classification-enrichment-policy-guide.md)
- [action_sap_s_4hana_fi_mm_enrich](/tools/action-sap-s-4hana-fi-mm-enrich.md)

Next: [ML Taxonomy Classification](/workflow/ml-taxonomy-classification.md)
