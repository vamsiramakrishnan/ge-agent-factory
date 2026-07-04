---
type: Proof Obligation
title: "Golden eval obligation — Run the Workforce Scenario Modeling workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-workforce-scenario-modeling-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Workforce Scenario Modeling workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [workforce-scenario-modeling-end-to-end](/tests/workforce-scenario-modeling-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_workforce_scenario_modeling_policy_handbook](/tools/lookup-workforce-scenario-modeling-policy-handbook.md)

## Entities that must be referenced

- employees
- budget_lines
- budget_lines
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [workforce-scenario-modeling-policy-handbook](/documents/workforce-scenario-modeling-policy-handbook.md)
