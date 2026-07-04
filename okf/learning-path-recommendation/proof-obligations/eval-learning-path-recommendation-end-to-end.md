---
type: Proof Obligation
title: "Golden eval obligation — Run the Learning Path Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-learning-path-recommendation-end-to-end"
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

# Golden eval obligation — Run the Learning Path Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [learning-path-recommendation-end-to-end](/tests/learning-path-recommendation-end-to-end.md)


## Mechanisms

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_udemy_udemy_records](/tools/query-udemy-udemy-records.md)
- [query_coursera_coursera_records](/tools/query-coursera-coursera-records.md)
- [lookup_learning_path_recommendation_policy_handbook](/tools/lookup-learning-path-recommendation-policy-handbook.md)
- [action_lms_recommend](/tools/action-lms-recommend.md)

## Entities that must be referenced

- lms_records
- employees
- udemy_records
- coursera_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [learning-path-recommendation-policy-handbook](/documents/learning-path-recommendation-policy-handbook.md)
