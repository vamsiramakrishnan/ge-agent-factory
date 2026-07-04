---
type: Workflow Stage
title: Validate Evidence
description: "Cross-check every finding against the Field Job Closure Quality Analyzer Service Assurance Runbook and cite the governing sections before any recommendation is issued."
source_id: validate_evidence
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Validate Evidence

Cross-check every finding against the Field Job Closure Quality Analyzer Service Assurance Runbook and cite the governing sections before any recommendation is issued.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)
- [action_oracle_field_service_recommend](/tools/action-oracle-field-service-recommend.md)

Next: [Act & Audit](/workflow/act-audit.md)
