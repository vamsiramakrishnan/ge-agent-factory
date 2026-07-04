---
type: Workflow Stage
title: AR Data Extraction
description: "Pull AR aging data from SAP segmented by customer, region, industry, and invoice type. Include payment history and dispute status for each open item."
source_id: ar_data_extraction
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# AR Data Extraction

Pull AR aging data from SAP segmented by customer, region, industry, and invoice type. Include payment history and dispute status for each open item.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_ar_aging_dso_analyzer_controls_playbook](/tools/lookup-ar-aging-dso-analyzer-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

Next: [DSO & Aging Analytics](/workflow/dso-aging-analytics.md)
