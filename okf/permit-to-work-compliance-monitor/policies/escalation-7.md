---
type: Policy
title: Escalation policy 7
description: "When permit_records shows permit_status active but issue_date plus valid_hours places the permit more than 2 hours past expiration while the linked ServiceNow ticket remains open or in_progress; action: escalate_to_human; handoff: Area Supervisor"
source_id: "escalation-7"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| permit_records shows permit_status active but issue_date plus valid_hours places the permit more than 2 hours past expiration while the linked ServiceNow ticket remains open or in_progress | escalate_to_human | Area Supervisor | Work continuing on a permit past its validity window is exactly the failure mode this agent exists to catch; only the area supervisor can pull the crew off the job and re-authorize before any record is auto-closed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
