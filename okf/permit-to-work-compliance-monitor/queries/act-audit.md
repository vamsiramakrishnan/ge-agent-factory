---
type: Query Capability
title: "Execute the generate step in Sphera EHS with a full audit trail, and escalate..."
description: "Execute the generate step in Sphera EHS with a full audit trail, and escalate exceptions to the EHS Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the generate step in Sphera EHS with a full audit trail, and escalate exceptions to the EHS Manager.

## Tools used

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [action_sphera_ehs_generate](/tools/action-sphera-ehs-generate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Permit-to-Work Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/permit-to-work-compliance-monitor-end-to-end.md)

# Citations

- [Permit-to-Work Compliance Monitor Standard Operating Procedure](/documents/permit-to-work-compliance-monitor-sop.md)
