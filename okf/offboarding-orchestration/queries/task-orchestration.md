---
type: Query Capability
title: "Auto-create tasks across IT, security, facilities, and finance via ServiceNow..."
description: "Auto-create tasks across IT, security, facilities, and finance via ServiceNow. Sequence tasks based on dependencies and compliance deadlines."
source_id: "task-orchestration"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-create tasks across IT, security, facilities, and finance via ServiceNow. Sequence tasks based on dependencies and compliance deadlines.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_offboarding_orchestration_policy_handbook](/tools/lookup-offboarding-orchestration-policy-handbook.md)

## Runs in

- [task_orchestration](/workflow/task-orchestration.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offboarding-orchestration-end-to-end.md)

# Citations

- [Offboarding Orchestration Policy Handbook](/documents/offboarding-orchestration-policy-handbook.md)
