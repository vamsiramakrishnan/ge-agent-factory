---
type: Proof Obligation
title: "Golden eval obligation — Run the Supplier Development Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-supplier-development-planner-end-to-end"
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

# Golden eval obligation — Run the Supplier Development Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [supplier-development-planner-end-to-end](/tests/supplier-development-planner-end-to-end.md)


## Mechanisms

- [query_scorecard_data_scorecard_data_records](/tools/query-scorecard-data-scorecard-data-records.md)
- [query_capability_assessments_capability_assessments_records](/tools/query-capability-assessments-capability-assessments-records.md)
- [query_industry_benchmarks_industry_benchmarks_records](/tools/query-industry-benchmarks-industry-benchmarks-records.md)
- [lookup_supplier_development_planner_policy_guide](/tools/lookup-supplier-development-planner-policy-guide.md)
- [action_scorecard_data_recommend](/tools/action-scorecard-data-recommend.md)

## Entities that must be referenced

- scorecard_data_records
- capability_assessments_records
- industry_benchmarks_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [supplier-development-planner-policy-guide](/documents/supplier-development-planner-policy-guide.md)
