---
type: Eval Scenario
title: "Run the AR Aging & DSO Analyzer workflow for the current period. Cite the rel..."
description: "Run the AR Aging & DSO Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "ar-aging-dso-analyzer-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the AR Aging & DSO Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ar-data-extraction](/queries/ar-data-extraction.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ar_aging_dso_analyzer_controls_playbook](/tools/lookup-ar-aging-dso-analyzer-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA FI, with audit-trail entry and AR Manager notified of outcomes.

# Citations

- [AR Aging & DSO Analyzer Controls Playbook](/documents/ar-aging-dso-analyzer-controls-playbook.md)
