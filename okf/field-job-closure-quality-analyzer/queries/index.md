---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull every field_work_orders record moved to wo_status=completed from Oracle Field Service via query_oracle_field_service_field_work_orders, along with the linked service_appointments record, and check that the completion photo set, GPS-stamped light-level readings, and test results were actually attached at closure.](/queries/closure-intake-evidence-capture.md)
- [Cross-check each closure's work_type, truck_rolls, and materials_cost_usd against the pass/fail thresholds in the Closure Evidence & As-Built Documentation Playbook and the Field Job Closure Quality Analyzer Service Assurance Runbook via lookup_field_job_closure_quality_analyzer_assurance_runbook before any score is finalized.](/queries/workmanship-standards-check.md)
- [Compare repeat_within_30d flags and technician_schedules assignments against historical_metrics and analytics_events baselines in BigQuery via query_bigquery_analytics_events to score technician and crew closure-quality trends and prioritize the Field Quality Auditor's queue.](/queries/repeat-dispatch-technician-trend-scoring.md)
- [Reconcile as-built submissions tied to field_work_orders against Looker dashboards and prior visit history to detect network-inventory-of-record conflicts, flagging premises where as-built data disagrees between visits.](/queries/as-built-reconciliation.md)
- [Execute action_oracle_field_service_recommend to route targeted coaching to supervisors, open inventory correction tasks, and escalate high repeat-dispatch-risk jobs to the Field Quality Auditor with a full audit trail.](/queries/coaching-correction-audit.md)
