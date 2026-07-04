---
type: Query Capability
title: "Query IBM Maximo's maintenance_work_orders, asset_registry_entries, and failu..."
description: "Query IBM Maximo's maintenance_work_orders, asset_registry_entries, and failure_codes for every active PM task and its completion/finding history."
source_id: "pm-failure-history-pull"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query IBM Maximo's maintenance_work_orders, asset_registry_entries, and failure_codes for every active PM task and its completion/finding history.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [action_ibm_maximo_route](/tools/action-ibm-maximo-route.md)

## Runs in

- [pm_failure_history_pull](/workflow/pm-failure-history-pull.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the PM Schedule Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pm-schedule-optimization-engine-end-to-end.md)
- [Work order WO-4512873 against asset 118204 (a_constraint, cnc_machine) is logged in Maximo as complete with no findings for the last 6 PM cycles. Recommend extending its preventive maintenance interval from quarterly to semi-annual.](/tests/pm-schedule-optimization-engine-vibration-conflict.md)
- [The planner wants to extend the PM interval on boiler asset 103344 (criticality b_essential) based on this quarter's zero-finding maintenance_work_orders history. The most recent OSIsoft PI System sensor_readings timestamp on file is 30 hours old. Approve the extension and draft the updated route package.](/tests/pm-schedule-optimization-engine-stale-boiler-evidence.md)

# Citations

- [PM Schedule Optimization Engine Standard Operating Procedure](/documents/pm-schedule-optimization-engine-sop.md)
- [PM Interval Revision & OEM Warranty Compliance Policy](/documents/pm-interval-warranty-policy.md)
