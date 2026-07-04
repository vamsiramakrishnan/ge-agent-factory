---
type: Eval Scenario
title: Run the Supplier Development Planner workflow for the current period. Cite th...
description: "Run the Supplier Development Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-development-planner-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Supplier Development Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [threshold-detection-data-pull](/queries/threshold-detection-data-pull.md)

## Mechanisms to call

- [query_scorecard_data_scorecard_data_records](/tools/query-scorecard-data-scorecard-data-records.md)
- [query_capability_assessments_capability_assessments_records](/tools/query-capability-assessments-capability-assessments-records.md)
- [query_industry_benchmarks_industry_benchmarks_records](/tools/query-industry-benchmarks-industry-benchmarks-records.md)
- [lookup_supplier_development_planner_policy_guide](/tools/lookup-supplier-development-planner-policy-guide.md)
- [action_scorecard_data_recommend](/tools/action-scorecard-data-recommend.md)

## Success rubric

Action recommend executed against Scorecard Data, with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [Supplier Development Planner Procurement Policy Guide](/documents/supplier-development-planner-policy-guide.md)
