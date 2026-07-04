---
type: Query Capability
title: "Extract AP aging data from SAP by vendor, entity, and aging bucket. Pull disp..."
description: "Extract AP aging data from SAP by vendor, entity, and aging bucket. Pull dispute records and payment history for context."
source_id: "ap-data-extraction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract AP aging data from SAP by vendor, entity, and aging bucket. Pull dispute records and payment history for context.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_ap_aging_analyzer_controls_playbook](/tools/lookup-ap-aging-analyzer-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [ap_data_extraction](/workflow/ap-data-extraction.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the AP Aging Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ap-aging-analyzer-end-to-end.md)

# Citations

- [AP Aging Analyzer Controls Playbook](/documents/ap-aging-analyzer-controls-playbook.md)
