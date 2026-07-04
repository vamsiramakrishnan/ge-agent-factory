---
type: Eval Scenario
title: "Run the Accruals & Deferrals Engine workflow for the current period. Cite the..."
description: "Run the Accruals & Deferrals Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "accruals-deferrals-engine-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Accruals & Deferrals Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [posting-auto-reversal](/queries/posting-auto-reversal.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_accruals_deferrals_engine_controls_playbook](/tools/lookup-accruals-deferrals-engine-controls-playbook.md)

## Success rubric

GL Accountant receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Accruals & Deferrals Engine Controls Playbook](/documents/accruals-deferrals-engine-controls-playbook.md)
