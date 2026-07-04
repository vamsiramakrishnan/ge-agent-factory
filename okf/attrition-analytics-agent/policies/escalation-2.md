---
type: Policy
title: Escalation policy 2
description: "When Sample size for team prediction is < 30 employees; action: request_more_info"
source_id: "escalation-2"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.1
generation_status: generated
ge_status: generated
---

# Escalation policy 2

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.1

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Sample size for team prediction is < 30 employees | request_more_info |  | Small teams lack statistical power for reliable risk scoring; agent must aggregate to business unit level. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
