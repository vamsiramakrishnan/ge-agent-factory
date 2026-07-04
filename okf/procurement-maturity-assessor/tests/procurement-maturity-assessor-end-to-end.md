---
type: Eval Scenario
title: Run the Procurement Maturity Assessor workflow for the current period. Cite t...
description: "Run the Procurement Maturity Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "procurement-maturity-assessor-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Procurement Maturity Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [survey-metrics-collection](/queries/survey-metrics-collection.md)

## Mechanisms to call

- [query_survey_tools_survey_tools_records](/tools/query-survey-tools-survey-tools-records.md)
- [query_internal_process_metrics_internal_process_metrics_records](/tools/query-internal-process-metrics-internal-process-metrics-records.md)
- [query_benchmark_databases_benchmark_databases_records](/tools/query-benchmark-databases-benchmark-databases-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_procurement_maturity_assessor_policy_guide](/tools/lookup-procurement-maturity-assessor-policy-guide.md)

## Success rubric

CPO receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Procurement Maturity Assessor Procurement Policy Guide](/documents/procurement-maturity-assessor-policy-guide.md)
