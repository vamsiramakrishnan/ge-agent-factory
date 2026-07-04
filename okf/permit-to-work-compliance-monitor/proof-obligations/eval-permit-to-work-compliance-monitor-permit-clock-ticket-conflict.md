---
type: Proof Obligation
title: "Golden eval obligation — Permit 151874 (hot_work) was issued at 06:00 today with valid_hours 8, so it expires at 14:00. Sphera EHS still shows permit_status active at 15:40, but ServiceNow ticket INC0089213 for the same work order was marked resolved at 13:55. Reconcile whether crews are still authorized to be on that job and tell me what to do before shift change at 16:00."
description: golden eval proof obligation
source_id: "eval-permit-to-work-compliance-monitor-permit-clock-ticket-conflict"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Permit 151874 (hot_work) was issued at 06:00 today with valid_hours 8, so it expires at 14:00. Sphera EHS still shows permit_status active at 15:40, but ServiceNow ticket INC0089213 for the same work order was marked resolved at 13:55. Reconcile whether crews are still authorized to be on that job and tell me what to do before shift change at 16:00.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [permit-to-work-compliance-monitor-permit-clock-ticket-conflict](/tests/permit-to-work-compliance-monitor-permit-clock-ticket-conflict.md)


## Mechanisms

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_permit_to_work_compliance_monitor_sop](/tools/lookup-permit-to-work-compliance-monitor-sop.md)

## Entities that must be referenced

- permit_records
- tickets
- safety_incidents

## Forbidden behaviors

- treating permit_status active as sufficient proof the permit is still valid
- auto-generating the evidence pack or closing out the discrepancy without flagging the conflicting timestamps for human review

# Citations

- [permit-to-work-compliance-monitor-sop](/documents/permit-to-work-compliance-monitor-sop.md)
- [confined-space-hot-work-issuance-policy](/documents/confined-space-hot-work-issuance-policy.md)
