---
type: Workflow Stage
title: Invoice Aggregation
description: Aggregate pending invoices from SAP and Coupa across all entities. Expand the time window to catch duplicates submitted weeks apart.
source_id: invoice_aggregation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Invoice Aggregation

Aggregate pending invoices from SAP and Coupa across all entities. Expand the time window to catch duplicates submitted weeks apart.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_duplicate_invoice_detector_controls_playbook](/tools/lookup-duplicate-invoice-detector-controls-playbook.md)
- [action_sap_s_4hana_fi_block](/tools/action-sap-s-4hana-fi-block.md)

Next: [ML Clustering & Fuzzy Matching](/workflow/ml-clustering-fuzzy-matching.md)
