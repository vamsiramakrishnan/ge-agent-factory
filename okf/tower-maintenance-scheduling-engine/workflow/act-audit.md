---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the notify step in Oracle Field Service with a full audit trail, and escalate exceptions to the Infrastructure Maintenance Planner."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the notify step in Oracle Field Service with a full audit trail, and escalate exceptions to the Infrastructure Maintenance Planner.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)
- [action_oracle_field_service_notify](/tools/action-oracle-field-service-notify.md)
