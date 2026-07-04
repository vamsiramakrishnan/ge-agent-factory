---
type: Query Capability
title: "Execute the route step in IBM Maximo with a full audit trail, and escalate ex..."
description: "Execute the route step in IBM Maximo with a full audit trail, and escalate exceptions to the Maintenance Planner."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the route step in IBM Maximo with a full audit trail, and escalate exceptions to the Maintenance Planner.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_route](/tools/action-ibm-maximo-route.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the PM Schedule Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pm-schedule-optimization-engine-end-to-end.md)

# Citations

- [PM Schedule Optimization Engine Standard Operating Procedure](/documents/pm-schedule-optimization-engine-sop.md)
