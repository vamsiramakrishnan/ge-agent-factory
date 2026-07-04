---
type: Policy
title: Escalation policy 8
description: "When Shelf-photo evidence covers less than 100% of a store's planogram sections as of the reset audit-due date; action: request_more_info; handoff: store_operations_manager"
source_id: "escalation-8"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Shelf-photo evidence covers less than 100% of a store's planogram sections as of the reset audit-due date | request_more_info | store_operations_manager | Partial photo coverage cannot support a compliance verdict against the reset audit coverage KPI and would misstate the store's true compliance state. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
