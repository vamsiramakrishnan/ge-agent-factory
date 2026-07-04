---
type: Workflow Stage
title: Workmanship Standards Check
description: "Cross-check each closure's work_type, truck_rolls, and materials_cost_usd against the pass/fail thresholds in the Closure Evidence & As-Built Documentation Playbook and the Field Job Closure Quality Analyzer Service Assurance Runbook via lookup_field_job_closure_quality_analyzer_assurance_runbook before any score is finalized."
source_id: workmanship_standards_check
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Workmanship Standards Check

Cross-check each closure's work_type, truck_rolls, and materials_cost_usd against the pass/fail thresholds in the Closure Evidence & As-Built Documentation Playbook and the Field Job Closure Quality Analyzer Service Assurance Runbook via lookup_field_job_closure_quality_analyzer_assurance_runbook before any score is finalized.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)
- [action_oracle_field_service_recommend](/tools/action-oracle-field-service-recommend.md)

Next: [Repeat-Dispatch & Technician Trend Scoring](/workflow/repeat-dispatch-technician-trend-scoring.md)
