---
type: Policy
title: Escalation policy 5
description: "When Scrap quantity on a single production order exceeds 5% of planned quantity; action: escalate_to_human; handoff: process_engineer"
source_id: "escalation-5"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Scrap quantity on a single production order exceeds 5% of planned quantity | escalate_to_human | process_engineer | Order-level scrap at this rate usually indicates a process shift or tooling degradation that needs first-piece re-qualification before continuing the run. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
