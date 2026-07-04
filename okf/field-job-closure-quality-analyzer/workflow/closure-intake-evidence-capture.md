---
type: Workflow Stage
title: "Closure Intake & Evidence Capture"
description: "Pull every field_work_orders record moved to wo_status=completed from Oracle Field Service via query_oracle_field_service_field_work_orders, along with the linked service_appointments record, and check that the completion photo set, GPS-stamped light-level readings, and test results were actually attached at closure."
source_id: closure_intake_evidence_capture
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Closure Intake & Evidence Capture

Pull every field_work_orders record moved to wo_status=completed from Oracle Field Service via query_oracle_field_service_field_work_orders, along with the linked service_appointments record, and check that the completion photo set, GPS-stamped light-level readings, and test results were actually attached at closure.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)
- [action_oracle_field_service_recommend](/tools/action-oracle-field-service-recommend.md)

Next: [Workmanship Standards Check](/workflow/workmanship-standards-check.md)
