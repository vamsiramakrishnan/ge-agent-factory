---
type: Proof Obligation
title: "Golden eval obligation — Run the Intercompany Reconciliation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-intercompany-reconciliation-end-to-end"
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

# Golden eval obligation — Run the Intercompany Reconciliation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [intercompany-reconciliation-end-to-end](/tests/intercompany-reconciliation-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_blackline_reconciliations](/tools/query-blackline-reconciliations.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_intercompany_reconciliation_controls_playbook](/tools/lookup-intercompany-reconciliation-controls-playbook.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)

## Entities that must be referenced

- gl_entries
- reconciliations
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [intercompany-reconciliation-controls-playbook](/documents/intercompany-reconciliation-controls-playbook.md)
