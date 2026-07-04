---
type: Eval Scenario
title: Run the Tax Audit Prep Agent workflow for the current period. Cite the releva...
description: "Run the Tax Audit Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "tax-audit-prep-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Tax Audit Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [response-defense-drafting](/queries/response-defense-drafting.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_tax_audit_prep_agent_controls_playbook](/tools/lookup-tax-audit-prep-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_draft](/tools/action-sap-s-4hana-fi-draft.md)

## Success rubric

Action draft executed against SAP S/4HANA FI, with audit-trail entry and Tax Director notified of outcomes.

# Citations

- [Tax Audit Prep Agent Controls Playbook](/documents/tax-audit-prep-agent-controls-playbook.md)
