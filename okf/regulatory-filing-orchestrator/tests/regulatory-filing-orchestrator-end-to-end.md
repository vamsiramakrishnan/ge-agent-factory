---
type: Eval Scenario
title: Run the Regulatory Filing Orchestrator workflow for the current period. Cite ...
description: "Run the Regulatory Filing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "regulatory-filing-orchestrator-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Regulatory Filing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [filing-calendar-data-collection](/queries/filing-calendar-data-collection.md)

## Mechanisms to call

- [query_workiva_workiva_records](/tools/query-workiva-workiva-records.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_sec_edgar_sec_edgar_records](/tools/query-sec-edgar-sec-edgar-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_filing_orchestrator_controls_playbook](/tools/lookup-regulatory-filing-orchestrator-controls-playbook.md)

## Success rubric

Controller receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Regulatory Filing Orchestrator Controls Playbook](/documents/regulatory-filing-orchestrator-controls-playbook.md)
