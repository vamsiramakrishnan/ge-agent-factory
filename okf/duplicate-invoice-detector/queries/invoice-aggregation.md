---
type: Query Capability
title: Aggregate pending invoices from SAP and Coupa across all entities. Expand the...
description: Aggregate pending invoices from SAP and Coupa across all entities. Expand the time window to catch duplicates submitted weeks apart.
source_id: "invoice-aggregation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate pending invoices from SAP and Coupa across all entities. Expand the time window to catch duplicates submitted weeks apart.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_duplicate_invoice_detector_controls_playbook](/tools/lookup-duplicate-invoice-detector-controls-playbook.md)
- [action_sap_s_4hana_fi_block](/tools/action-sap-s-4hana-fi-block.md)

## Runs in

- [invoice_aggregation](/workflow/invoice-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Duplicate Invoice Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/duplicate-invoice-detector-end-to-end.md)

# Citations

- [Duplicate Invoice Detector Controls Playbook](/documents/duplicate-invoice-detector-controls-playbook.md)
