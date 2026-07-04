---
type: Eval Scenario
title: "Permit 151874 (hot_work) was issued at 06:00 today with valid_hours 8, so it ..."
description: "Permit 151874 (hot_work) was issued at 06:00 today with valid_hours 8, so it expires at 14:00. Sphera EHS still shows permit_status active at 15:40, but ServiceNow ticket INC0089213 for the same work order was marked resolved at 13:55. Reconcile whether crews are still authorized to be on that job and tell me what to do before shift change at 16:00."
source_id: "permit-to-work-compliance-monitor-permit-clock-ticket-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Permit 151874 (hot_work) was issued at 06:00 today with valid_hours 8, so it expires at 14:00. Sphera EHS still shows permit_status active at 15:40, but ServiceNow ticket INC0089213 for the same work order was marked resolved at 13:55. Reconcile whether crews are still authorized to be on that job and tell me what to do before shift change at 16:00.

## Validates

- [active-high-risk-work-permit-cross-check](/queries/active-high-risk-work-permit-cross-check.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_permit_to_work_compliance_monitor_sop](/tools/lookup-permit-to-work-compliance-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Permit-to-Work Compliance Monitor Standard Operating Procedure](/documents/permit-to-work-compliance-monitor-sop.md)
- [Confined Space & Hot Work Permit Issuance Policy](/documents/confined-space-hot-work-issuance-policy.md)
