---
type: Eval Scenario
title: Run the AP Aging Analyzer workflow for the current period. Cite the relevant ...
description: "Run the AP Aging Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "ap-aging-analyzer-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the AP Aging Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ap-data-extraction](/queries/ap-data-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ap_aging_analyzer_controls_playbook](/tools/lookup-ap-aging-analyzer-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA FI, with audit-trail entry and AP Manager notified of outcomes.

# Citations

- [AP Aging Analyzer Controls Playbook](/documents/ap-aging-analyzer-controls-playbook.md)
