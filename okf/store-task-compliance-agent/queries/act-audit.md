---
type: Query Capability
title: "Execute the escalate step in UKG Dimensions with a full audit trail, and esca..."
description: "Execute the escalate step in UKG Dimensions with a full audit trail, and escalate exceptions to the District Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in UKG Dimensions with a full audit trail, and escalate exceptions to the District Manager.

## Tools used

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [action_ukg_dimensions_escalate](/tools/action-ukg-dimensions-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Store Task Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/store-task-compliance-agent-end-to-end.md)

# Citations

- [Store Task Compliance Agent Retail Execution Playbook](/documents/store-task-compliance-agent-execution-playbook.md)
