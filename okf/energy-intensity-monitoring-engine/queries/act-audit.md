---
type: Query Capability
title: "Execute the publish step in Sphera EHS with a full audit trail, and escalate ..."
description: "Execute the publish step in Sphera EHS with a full audit trail, and escalate exceptions to the Sustainability Lead."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in Sphera EHS with a full audit trail, and escalate exceptions to the Sustainability Lead.

## Tools used

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Energy Intensity Monitoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/energy-intensity-monitoring-engine-end-to-end.md)

# Citations

- [Energy Intensity Monitoring Engine Standard Operating Procedure](/documents/energy-intensity-monitoring-engine-sop.md)
