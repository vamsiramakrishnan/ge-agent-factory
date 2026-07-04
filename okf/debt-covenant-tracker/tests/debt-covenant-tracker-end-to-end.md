---
type: Eval Scenario
title: Run the Debt Covenant Tracker workflow for the current period. Cite the relev...
description: "Run the Debt Covenant Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "debt-covenant-tracker-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Debt Covenant Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [continuous-covenant-monitoring-with-2-quarter-forward-projection](/queries/continuous-covenant-monitoring-with-2-quarter-forward-projection.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_debt_covenant_tracker_controls_playbook](/tools/lookup-debt-covenant-tracker-controls-playbook.md)

## Success rubric

Treasurer receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Debt Covenant Tracker Controls Playbook](/documents/debt-covenant-tracker-controls-playbook.md)
