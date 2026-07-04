---
type: Proof Obligation
title: "Golden eval obligation — Run the Merit & Promotion Budget Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-merit-promotion-budget-modeler-agent-end-to-end"
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

# Golden eval obligation — Run the Merit & Promotion Budget Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [merit-promotion-budget-modeler-agent-end-to-end](/tests/merit-promotion-budget-modeler-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_merit_promotion_budget_modeler_agent_policy_handbook](/tools/lookup-merit-promotion-budget-modeler-agent-policy-handbook.md)

## Entities that must be referenced

- employees
- budget_lines
- sheets
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [merit-promotion-budget-modeler-agent-policy-handbook](/documents/merit-promotion-budget-modeler-agent-policy-handbook.md)
