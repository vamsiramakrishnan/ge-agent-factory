---
type: Proof Obligation
title: "Golden eval obligation — Run the Budget Builder & Consolidation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-budget-builder-consolidation-end-to-end"
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

# Golden eval obligation — Run the Budget Builder & Consolidation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [budget-builder-consolidation-end-to-end](/tests/budget-builder-consolidation-end-to-end.md)


## Mechanisms

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [query_workday_adaptive_employees](/tools/query-workday-adaptive-employees.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_budget_builder_consolidation_controls_playbook](/tools/lookup-budget-builder-consolidation-controls-playbook.md)

## Entities that must be referenced

- budget_lines
- budget_lines
- employees
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [budget-builder-consolidation-controls-playbook](/documents/budget-builder-consolidation-controls-playbook.md)
