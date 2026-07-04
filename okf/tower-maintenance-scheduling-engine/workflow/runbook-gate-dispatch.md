---
type: Workflow Stage
title: "Runbook Gate & Dispatch"
description: "Validate every proposed schedule change or priority work order against the Tower Maintenance Scheduling Engine Service Assurance Runbook, then execute action_oracle_field_service_notify in Oracle Field Service with a full audit trail, escalating exceptions to the Infrastructure Maintenance Planner."
source_id: runbook_gate_dispatch
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Runbook Gate & Dispatch

Validate every proposed schedule change or priority work order against the Tower Maintenance Scheduling Engine Service Assurance Runbook, then execute action_oracle_field_service_notify in Oracle Field Service with a full audit trail, escalating exceptions to the Infrastructure Maintenance Planner.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)
- [action_oracle_field_service_notify](/tools/action-oracle-field-service-notify.md)
