---
type: Eval Scenario
title: Run the Field Job Closure Quality Analyzer workflow for the current period. C...
description: "Run the Field Job Closure Quality Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "field-job-closure-quality-analyzer-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Field Job Closure Quality Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [repeat-dispatch-technician-trend-scoring](/queries/repeat-dispatch-technician-trend-scoring.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)
- [action_oracle_field_service_recommend](/tools/action-oracle-field-service-recommend.md)

## Success rubric

Action recommend executed against Oracle Field Service, with audit-trail entry and Field Quality Auditor notified of outcomes.

# Citations

- [Field Job Closure Quality Analyzer Service Assurance Runbook](/documents/field-job-closure-quality-analyzer-assurance-runbook.md)
