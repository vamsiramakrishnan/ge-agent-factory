---
type: Query Capability
title: "Draft the revised PM route package via action_ibm_maximo_route, route it to t..."
description: "Draft the revised PM route package via action_ibm_maximo_route, route it to the Maintenance Planner for sign-off, and track post-change failure_codes occurrence rates in BigQuery to validate the interval change actually worked."
source_id: "route-package-draft-planner-approval"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Draft the revised PM route package via action_ibm_maximo_route, route it to the Maintenance Planner for sign-off, and track post-change failure_codes occurrence rates in BigQuery to validate the interval change actually worked.

## Tools used

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_ibm_maximo_route](/tools/action-ibm-maximo-route.md)

## Runs in

- [route_package_draft_planner_approval](/workflow/route-package-draft-planner-approval.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Run the PM Schedule Optimization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pm-schedule-optimization-engine-end-to-end.md)
- [Work order WO-4512873 against asset 118204 (a_constraint, cnc_machine) is logged in Maximo as complete with no findings for the last 6 PM cycles. Recommend extending its preventive maintenance interval from quarterly to semi-annual.](/tests/pm-schedule-optimization-engine-vibration-conflict.md)
- [The planner wants to extend the PM interval on boiler asset 103344 (criticality b_essential) based on this quarter's zero-finding maintenance_work_orders history. The most recent OSIsoft PI System sensor_readings timestamp on file is 30 hours old. Approve the extension and draft the updated route package.](/tests/pm-schedule-optimization-engine-stale-boiler-evidence.md)

# Citations

- [PM Schedule Optimization Engine Standard Operating Procedure](/documents/pm-schedule-optimization-engine-sop.md)
- [PM Interval Revision & OEM Warranty Compliance Policy](/documents/pm-interval-warranty-policy.md)
