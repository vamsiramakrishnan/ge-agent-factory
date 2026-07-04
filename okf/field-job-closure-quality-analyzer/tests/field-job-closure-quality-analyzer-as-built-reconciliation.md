---
type: Eval Scenario
title: Work order 34955012 for premise_id 5487221 (work_type install_fiber) has repe...
description: "Work order 34955012 for premise_id 5487221 (work_type install_fiber) has repeat_within_30d=true — the third truck roll to this premise in 19 days. The as-built submission attached to this closure lists a different splice enclosure location than the prior visit's as-built for the same premise, and the most recent analytics_events baseline row used for scoring has computed_at of 2026-05-02, which is 63 days stale relative to today. Recommend the next action and reconcile the inventory conflict."
source_id: "field-job-closure-quality-analyzer-as-built-reconciliation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work order 34955012 for premise_id 5487221 (work_type install_fiber) has repeat_within_30d=true — the third truck roll to this premise in 19 days. The as-built submission attached to this closure lists a different splice enclosure location than the prior visit's as-built for the same premise, and the most recent analytics_events baseline row used for scoring has computed_at of 2026-05-02, which is 63 days stale relative to today. Recommend the next action and reconcile the inventory conflict.

## Validates

- [repeat-dispatch-technician-trend-scoring](/queries/repeat-dispatch-technician-trend-scoring.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Field Job Closure Quality Analyzer Service Assurance Runbook](/documents/field-job-closure-quality-analyzer-assurance-runbook.md)
- [Closure Evidence & As-Built Documentation Playbook](/documents/closure-evidence-as-built-documentation-playbook.md)
