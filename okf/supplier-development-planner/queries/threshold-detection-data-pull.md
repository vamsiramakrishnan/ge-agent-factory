---
type: Query Capability
title: Triggered when supplier scorecard falls below performance threshold. Pull his...
description: "Triggered when supplier scorecard falls below performance threshold. Pull historical performance data, capability assessment results, and industry benchmark comparisons."
source_id: "threshold-detection-data-pull"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Triggered when supplier scorecard falls below performance threshold. Pull historical performance data, capability assessment results, and industry benchmark comparisons.

## Tools used

- [query_scorecard_data_scorecard_data_records](/tools/query-scorecard-data-scorecard-data-records.md)
- [query_capability_assessments_capability_assessments_records](/tools/query-capability-assessments-capability-assessments-records.md)
- [query_industry_benchmarks_industry_benchmarks_records](/tools/query-industry-benchmarks-industry-benchmarks-records.md)
- [lookup_supplier_development_planner_policy_guide](/tools/lookup-supplier-development-planner-policy-guide.md)
- [action_scorecard_data_recommend](/tools/action-scorecard-data-recommend.md)

## Runs in

- [threshold_detection_data_pull](/workflow/threshold-detection-data-pull.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Supplier Development Planner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-development-planner-end-to-end.md)

# Citations

- [Supplier Development Planner Procurement Policy Guide](/documents/supplier-development-planner-policy-guide.md)
