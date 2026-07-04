---
type: Policy
title: Escalation policy 3
description: "When Required panelist is missing from interview_panels query result; action: request_more_info"
source_id: "escalation-3"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.2
generation_status: generated
ge_status: generated
---

# Escalation policy 3

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.2

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Required panelist is missing from interview_panels query result | request_more_info |  | Panel composition is incomplete; agent must ask hiring manager or recruiter to confirm panel. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
