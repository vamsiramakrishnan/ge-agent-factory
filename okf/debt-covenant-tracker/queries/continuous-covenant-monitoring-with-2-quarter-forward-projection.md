---
type: Query Capability
title: "Continuous covenant monitoring with 2-quarter forward projections replaces qu..."
description: "Continuous covenant monitoring with 2-quarter forward projections replaces quarterly surprise discoveries"
source_id: "continuous-covenant-monitoring-with-2-quarter-forward-projection"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuous covenant monitoring with 2-quarter forward projections replaces quarterly surprise discoveries

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_debt_covenant_tracker_controls_playbook](/tools/lookup-debt-covenant-tracker-controls-playbook.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Debt Covenant Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/debt-covenant-tracker-end-to-end.md)

# Citations

- [Debt Covenant Tracker Controls Playbook](/documents/debt-covenant-tracker-controls-playbook.md)
