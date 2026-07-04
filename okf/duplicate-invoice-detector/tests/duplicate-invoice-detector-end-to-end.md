---
type: Eval Scenario
title: Run the Duplicate Invoice Detector workflow for the current period. Cite the ...
description: "Run the Duplicate Invoice Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "duplicate-invoice-detector-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Duplicate Invoice Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [invoice-aggregation](/queries/invoice-aggregation.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_duplicate_invoice_detector_controls_playbook](/tools/lookup-duplicate-invoice-detector-controls-playbook.md)
- [action_sap_s_4hana_fi_block](/tools/action-sap-s-4hana-fi-block.md)

## Success rubric

Action block executed against SAP S/4HANA FI, with audit-trail entry and AP Manager notified of outcomes.

# Citations

- [Duplicate Invoice Detector Controls Playbook](/documents/duplicate-invoice-detector-controls-playbook.md)
