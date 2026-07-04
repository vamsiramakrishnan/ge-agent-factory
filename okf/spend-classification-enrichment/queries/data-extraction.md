---
type: Query Capability
title: Extract PO and invoice line items from SAP S/4HANA and Coupa. Normalize field...
description: Extract PO and invoice line items from SAP S/4HANA and Coupa. Normalize fields across source systems into a common schema for classification.
source_id: "data-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract PO and invoice line items from SAP S/4HANA and Coupa. Normalize fields across source systems into a common schema for classification.

## Tools used

- [query_sap_s_4hana_fi_mm_gl_entries](/tools/query-sap-s-4hana-fi-mm-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_spend_classification_enrichment_policy_guide](/tools/lookup-spend-classification-enrichment-policy-guide.md)
- [action_sap_s_4hana_fi_mm_enrich](/tools/action-sap-s-4hana-fi-mm-enrich.md)

## Runs in

- [data_extraction](/workflow/data-extraction.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Spend Classification & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spend-classification-enrichment-end-to-end.md)

# Citations

- [Spend Classification & Enrichment Procurement Policy Guide](/documents/spend-classification-enrichment-policy-guide.md)
