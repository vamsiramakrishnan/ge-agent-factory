---
type: Workflow Stage
title: "Threshold Detection & Data Pull"
description: "Triggered when supplier scorecard falls below performance threshold. Pull historical performance data, capability assessment results, and industry benchmark comparisons."
source_id: threshold_detection_data_pull
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Threshold Detection & Data Pull

Triggered when supplier scorecard falls below performance threshold. Pull historical performance data, capability assessment results, and industry benchmark comparisons.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_scorecard_data_scorecard_data_records](/tools/query-scorecard-data-scorecard-data-records.md)
- [query_capability_assessments_capability_assessments_records](/tools/query-capability-assessments-capability-assessments-records.md)
- [query_industry_benchmarks_industry_benchmarks_records](/tools/query-industry-benchmarks-industry-benchmarks-records.md)
- [lookup_supplier_development_planner_policy_guide](/tools/lookup-supplier-development-planner-policy-guide.md)
- [action_scorecard_data_recommend](/tools/action-scorecard-data-recommend.md)

Next: [Development Program Design](/workflow/development-program-design.md)
