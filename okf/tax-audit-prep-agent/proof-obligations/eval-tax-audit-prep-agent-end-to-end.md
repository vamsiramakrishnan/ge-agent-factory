---
type: Proof Obligation
title: "Golden eval obligation — Run the Tax Audit Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-tax-audit-prep-agent-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Tax Audit Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [tax-audit-prep-agent-end-to-end](/tests/tax-audit-prep-agent-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_tax_audit_prep_agent_controls_playbook](/tools/lookup-tax-audit-prep-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_draft](/tools/action-sap-s-4hana-fi-draft.md)

## Entities that must be referenced

- gl_entries
- analytics_events
- finance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [tax-audit-prep-agent-controls-playbook](/documents/tax-audit-prep-agent-controls-playbook.md)
