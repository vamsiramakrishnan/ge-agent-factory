---
type: Proof Obligation
title: "Golden eval obligation — Run the COGS Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-cogs-reconciliation-agent-end-to-end"
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

# Golden eval obligation — Run the COGS Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [cogs-reconciliation-agent-end-to-end](/tests/cogs-reconciliation-agent-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_co_fi_cost_centers](/tools/query-sap-s-4hana-co-fi-cost-centers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_cogs_reconciliation_agent_controls_playbook](/tools/lookup-cogs-reconciliation-agent-controls-playbook.md)
- [action_sap_s_4hana_co_fi_generate](/tools/action-sap-s-4hana-co-fi-generate.md)

## Entities that must be referenced

- cost_centers
- analytics_events
- finance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [cogs-reconciliation-agent-controls-playbook](/documents/cogs-reconciliation-agent-controls-playbook.md)
