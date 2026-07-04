---
type: Query Capability
title: "Execute the escalate step in Sphera EHS with a full audit trail, and escalate..."
description: "Execute the escalate step in Sphera EHS with a full audit trail, and escalate exceptions to the Site Safety Officer."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in Sphera EHS with a full audit trail, and escalate exceptions to the Site Safety Officer.

## Tools used

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [action_sphera_ehs_escalate](/tools/action-sphera-ehs-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Incident and Near-Miss Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/incident-near-miss-triage-agent-end-to-end.md)

# Citations

- [Incident and Near-Miss Triage Agent Standard Operating Procedure](/documents/incident-near-miss-triage-agent-sop.md)
