---
type: Query Capability
title: "Pull AR aging data from SAP segmented by customer, region, industry, and invo..."
description: "Pull AR aging data from SAP segmented by customer, region, industry, and invoice type. Include payment history and dispute status for each open item."
source_id: "ar-data-extraction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull AR aging data from SAP segmented by customer, region, industry, and invoice type. Include payment history and dispute status for each open item.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_ar_aging_dso_analyzer_controls_playbook](/tools/lookup-ar-aging-dso-analyzer-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Runs in

- [ar_data_extraction](/workflow/ar-data-extraction.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the AR Aging & DSO Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ar-aging-dso-analyzer-end-to-end.md)

# Citations

- [AR Aging & DSO Analyzer Controls Playbook](/documents/ar-aging-dso-analyzer-controls-playbook.md)
