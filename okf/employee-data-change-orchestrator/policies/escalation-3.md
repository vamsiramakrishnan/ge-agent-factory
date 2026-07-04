---
type: Policy
title: Escalation policy 3
description: "When Proposed update action lacks supporting evidence from at least two systems; action: refuse"
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
| Proposed update action lacks supporting evidence from at least two systems | refuse |  | Single-system evidence is insufficient to authorize external state changes without manual review. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
