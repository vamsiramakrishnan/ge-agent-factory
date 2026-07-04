---
type: Policy
title: Escalation policy 3
description: "When Quantity or amount field is ambiguous (e.g., 'approx 500', 'TBD', range like '100-150'); action: escalate_to_human; handoff: AP Manager"
source_id: "escalation-3"
tags:
  - procurement
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
| Quantity or amount field is ambiguous (e.g., 'approx 500', 'TBD', range like '100-150') | escalate_to_human | AP Manager | Ambiguous quantities cannot be reliably interpreted even by LLM; manual review required for accuracy. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
