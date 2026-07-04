---
type: Proof Obligation
title: "Golden eval obligation — Run the Capital Expenditure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-capital-expenditure-analyzer-end-to-end"
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

# Golden eval obligation — Run the Capital Expenditure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [capital-expenditure-analyzer-end-to-end](/tests/capital-expenditure-analyzer-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_capital_expenditure_analyzer_controls_playbook](/tools/lookup-capital-expenditure-analyzer-controls-playbook.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Entities that must be referenced

- transactions
- budget_lines
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [capital-expenditure-analyzer-controls-playbook](/documents/capital-expenditure-analyzer-controls-playbook.md)
