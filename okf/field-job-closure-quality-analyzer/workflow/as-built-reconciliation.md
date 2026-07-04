---
type: Workflow Stage
title: "As-Built Reconciliation"
description: "Reconcile as-built submissions tied to field_work_orders against Looker dashboards and prior visit history to detect network-inventory-of-record conflicts, flagging premises where as-built data disagrees between visits."
source_id: as_built_reconciliation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# As-Built Reconciliation

Reconcile as-built submissions tied to field_work_orders against Looker dashboards and prior visit history to detect network-inventory-of-record conflicts, flagging premises where as-built data disagrees between visits.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)
- [action_oracle_field_service_recommend](/tools/action-oracle-field-service-recommend.md)

Next: [Coaching, Correction & Audit](/workflow/coaching-correction-audit.md)
