---
type: Policy
title: Escalation policy 4
description: "When Required input (employee_id, plan_id, or coverage_tier) is missing or ambiguous; action: request_more_info"
source_id: "escalation-4"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Required input (employee_id, plan_id, or coverage_tier) is missing or ambiguous | request_more_info |  | Never guess identifiers; the agent must ask for the specific missing field. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
