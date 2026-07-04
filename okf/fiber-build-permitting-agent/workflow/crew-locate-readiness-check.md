---
type: Workflow Stage
title: "Crew & Locate Readiness Check"
description: "Confirm technician_schedules primary_skill and tower_climb_certified status against the job's traffic-control and elevated-work requirements, and validate that an 811 one-call locate ticket is in a valid window relative to service_appointments arrival_window and dispatch_date."
source_id: crew_locate_readiness_check
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Crew & Locate Readiness Check

Confirm technician_schedules primary_skill and tower_climb_certified status against the job's traffic-control and elevated-work requirements, and validate that an 811 one-call locate ticket is in a valid window relative to service_appointments arrival_window and dispatch_date.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [action_oracle_field_service_escalate](/tools/action-oracle-field-service-escalate.md)

Next: [Jurisdiction SLA Aging & Baseline Comparison](/workflow/jurisdiction-sla-aging-baseline-comparison.md)
