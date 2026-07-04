---
type: Workflow Stage
title: "Coaching, Correction & Audit"
description: "Execute action_oracle_field_service_recommend to route targeted coaching to supervisors, open inventory correction tasks, and escalate high repeat-dispatch-risk jobs to the Field Quality Auditor with a full audit trail."
source_id: coaching_correction_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Coaching, Correction & Audit

Execute action_oracle_field_service_recommend to route targeted coaching to supervisors, open inventory correction tasks, and escalate high repeat-dispatch-risk jobs to the Field Quality Auditor with a full audit trail.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)
- [action_oracle_field_service_recommend](/tools/action-oracle-field-service-recommend.md)
