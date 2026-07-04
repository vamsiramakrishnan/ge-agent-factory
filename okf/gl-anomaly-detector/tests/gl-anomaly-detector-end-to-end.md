---
type: Eval Scenario
title: Run the GL Anomaly Detector workflow for the current period. Cite the relevan...
description: "Run the GL Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "gl-anomaly-detector-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the GL Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [statistical-anomaly-detection](/queries/statistical-anomaly-detection.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_gl_anomaly_detector_controls_playbook](/tools/lookup-gl-anomaly-detector-controls-playbook.md)
- [action_sap_s_4hana_fi_post](/tools/action-sap-s-4hana-fi-post.md)

## Success rubric

Action post executed against SAP S/4HANA FI, with audit-trail entry and Controller / Internal Audit notified of outcomes.

# Citations

- [GL Anomaly Detector Controls Playbook](/documents/gl-anomaly-detector-controls-playbook.md)
