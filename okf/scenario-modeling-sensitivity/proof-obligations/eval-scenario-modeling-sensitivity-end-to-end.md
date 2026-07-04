---
type: Proof Obligation
title: "Golden eval obligation — Run the Scenario Modeling & Sensitivity workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-scenario-modeling-sensitivity-end-to-end"
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

# Golden eval obligation — Run the Scenario Modeling & Sensitivity workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [scenario-modeling-sensitivity-end-to-end](/tests/scenario-modeling-sensitivity-end-to-end.md)


## Mechanisms

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_scenario_modeling_sensitivity_controls_playbook](/tools/lookup-scenario-modeling-sensitivity-controls-playbook.md)
- [action_anaplan_recommend](/tools/action-anaplan-recommend.md)

## Entities that must be referenced

- budget_lines
- analytics_events
- finance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [scenario-modeling-sensitivity-controls-playbook](/documents/scenario-modeling-sensitivity-controls-playbook.md)
