---
type: Proof Obligation
title: "Golden eval obligation — Work order 34955012 for premise_id 5487221 (work_type install_fiber) has repeat_within_30d=true — the third truck roll to this premise in 19 days. The as-built submission attached to this closure lists a different splice enclosure location than the prior visit's as-built for the same premise, and the most recent analytics_events baseline row used for scoring has computed_at of 2026-05-02, which is 63 days stale relative to today. Recommend the next action and reconcile the inventory conflict."
description: golden eval proof obligation
source_id: "eval-field-job-closure-quality-analyzer-as-built-reconciliation"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Work order 34955012 for premise_id 5487221 (work_type install_fiber) has repeat_within_30d=true — the third truck roll to this premise in 19 days. The as-built submission attached to this closure lists a different splice enclosure location than the prior visit's as-built for the same premise, and the most recent analytics_events baseline row used for scoring has computed_at of 2026-05-02, which is 63 days stale relative to today. Recommend the next action and reconcile the inventory conflict.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [field-job-closure-quality-analyzer-as-built-reconciliation](/tests/field-job-closure-quality-analyzer-as-built-reconciliation.md)


## Mechanisms

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)

## Entities that must be referenced

- field_work_orders
- analytics_events

## Forbidden behaviors

- scoring the closure using the stale 63-day-old baseline without flagging it
- invoking action_oracle_field_service_recommend before the as-built conflict and repeat-dispatch escalation are resolved

# Citations

- [field-job-closure-quality-analyzer-assurance-runbook](/documents/field-job-closure-quality-analyzer-assurance-runbook.md)
- [closure-evidence-as-built-documentation-playbook](/documents/closure-evidence-as-built-documentation-playbook.md)
