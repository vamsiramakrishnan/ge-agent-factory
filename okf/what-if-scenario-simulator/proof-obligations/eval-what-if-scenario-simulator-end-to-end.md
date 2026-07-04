---
type: Proof Obligation
title: "Golden eval obligation — Run the What-If Scenario Simulator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-what-if-scenario-simulator-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the What-If Scenario Simulator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [what-if-scenario-simulator-end-to-end](/tests/what-if-scenario-simulator-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_procurement_2_procurement_2_records](/tools/query-procurement-2-procurement-2-records.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_what_if_scenario_simulator_policy_guide](/tools/lookup-what-if-scenario-simulator-policy-guide.md)
- [action_procurement_2_recommend](/tools/action-procurement-2-recommend.md)

## Entities that must be referenced

- analytics_events
- procurement_2_records
- procurement_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [what-if-scenario-simulator-policy-guide](/documents/what-if-scenario-simulator-policy-guide.md)
