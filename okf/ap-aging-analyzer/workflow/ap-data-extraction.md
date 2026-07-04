---
type: Workflow Stage
title: AP Data Extraction
description: "Extract AP aging data from SAP by vendor, entity, and aging bucket. Pull dispute records and payment history for context."
source_id: ap_data_extraction
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# AP Data Extraction

Extract AP aging data from SAP by vendor, entity, and aging bucket. Pull dispute records and payment history for context.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_ap_aging_analyzer_controls_playbook](/tools/lookup-ap-aging-analyzer-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

Next: [AP Narrative Generation](/workflow/ap-narrative-generation.md)
