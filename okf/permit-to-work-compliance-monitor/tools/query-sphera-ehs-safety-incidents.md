---
type: Agent Tool
title: query_sphera_ehs_safety_incidents
description: "Retrieve safety incidents from Sphera EHS for the Permit-to-Work Compliance Monitor workflow."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sphera_ehs_safety_incidents

Retrieve safety incidents from Sphera EHS for the Permit-to-Work Compliance Monitor workflow.

- **Kind:** query
- **Source system:** [Sphera EHS](/systems/sphera-ehs.md)

## Inputs

- incident_number
- date_range

## Outputs

- safety_incidents_records
- safety_incidents_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sphera EHS](/systems/sphera-ehs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [active_high_risk_work_permit_cross_check](/workflow/active-high-risk-work-permit-cross-check.md)
- [sop_gated_notification_escalation](/workflow/sop-gated-notification-escalation.md)
- [evidence_pack_generation_audit_trail](/workflow/evidence-pack-generation-audit-trail.md)

## Evals

- [Run the Permit-to-Work Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/permit-to-work-compliance-monitor-end-to-end.md)
- [Permit 151874 (hot_work) was issued at 06:00 today with valid_hours 8, so it expires at 14:00. Sphera EHS still shows permit_status active at 15:40, but ServiceNow ticket INC0089213 for the same work order was marked resolved at 13:55. Reconcile whether crews are still authorized to be on that job and tell me what to do before shift change at 16:00.](/tests/permit-to-work-compliance-monitor-permit-clock-ticket-conflict.md)
- [Confined-space permit 152203 is active in Sphera EHS with atmospheric_test_required true, but the most recent lel_reading_pct on file is from 27 hours ago and attendant_assigned currently reads false. The crew lead insists it's fine to keep going since they're only sealing a hatch. Confirm whether permit 152203 should stay open.](/tests/permit-to-work-compliance-monitor-stale-atmospheric-evidence.md)

## Evidence emitted

- source_system_record

## Required inputs

- incident_number
- date_range

## Produces

- safety_incidents_records
- safety_incidents_summary

# Examples

```
query_sphera_ehs_safety_incidents(incident_number=<incident_number>, date_range=<date_range>)
```

# Citations

- [Sphera EHS](/systems/sphera-ehs.md)
