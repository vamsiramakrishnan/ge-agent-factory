---
type: Proof Obligation
title: "Golden eval obligation — Run the Procurement Maturity Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-procurement-maturity-assessor-end-to-end"
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

# Golden eval obligation — Run the Procurement Maturity Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [procurement-maturity-assessor-end-to-end](/tests/procurement-maturity-assessor-end-to-end.md)


## Mechanisms

- [query_survey_tools_survey_tools_records](/tools/query-survey-tools-survey-tools-records.md)
- [query_internal_process_metrics_internal_process_metrics_records](/tools/query-internal-process-metrics-internal-process-metrics-records.md)
- [query_benchmark_databases_benchmark_databases_records](/tools/query-benchmark-databases-benchmark-databases-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_procurement_maturity_assessor_policy_guide](/tools/lookup-procurement-maturity-assessor-policy-guide.md)

## Entities that must be referenced

- survey_tools_records
- internal_process_metrics_records
- benchmark_databases_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [procurement-maturity-assessor-policy-guide](/documents/procurement-maturity-assessor-policy-guide.md)
