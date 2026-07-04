---
type: Eval Scenario
title: Run the Intercompany Reconciliation workflow for the current period. Cite the...
description: "Run the Intercompany Reconciliation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "intercompany-reconciliation-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Intercompany Reconciliation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [mismatch-investigation](/queries/mismatch-investigation.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_intercompany_reconciliation_controls_playbook](/tools/lookup-intercompany-reconciliation-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA FI, with audit-trail entry and GL Accountant / Controller notified of outcomes.

# Citations

- [Intercompany Reconciliation Controls Playbook](/documents/intercompany-reconciliation-controls-playbook.md)
