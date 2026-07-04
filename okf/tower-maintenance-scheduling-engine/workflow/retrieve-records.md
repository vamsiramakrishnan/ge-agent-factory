---
type: Workflow Stage
title: Retrieve Records
description: Query field work orders and technician schedules from Oracle Field Service and correlate with Splunk for the Tower Maintenance Scheduling Engine workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query field work orders and technician schedules from Oracle Field Service and correlate with Splunk for the Tower Maintenance Scheduling Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)
- [action_oracle_field_service_notify](/tools/action-oracle-field-service-notify.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
