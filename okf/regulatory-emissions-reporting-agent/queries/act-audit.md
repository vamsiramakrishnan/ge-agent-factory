---
type: Query Capability
title: "Execute the draft step in Sphera EHS with a full audit trail, and escalate ex..."
description: "Execute the draft step in Sphera EHS with a full audit trail, and escalate exceptions to the Environmental Compliance Specialist."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the draft step in Sphera EHS with a full audit trail, and escalate exceptions to the Environmental Compliance Specialist.

## Tools used

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [action_sphera_ehs_draft](/tools/action-sphera-ehs-draft.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Regulatory Emissions Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-emissions-reporting-agent-end-to-end.md)

# Citations

- [Regulatory Emissions Reporting Agent Standard Operating Procedure](/documents/regulatory-emissions-reporting-agent-sop.md)
