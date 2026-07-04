---
type: Policy
title: Escalation policy 5
description: "When DC fill rate drops below 95% for two consecutive waves, or cut cases exceed 10% of ordered cases on any store order.; action: escalate_to_human; handoff: dc_operations_lead"
source_id: "escalation-5"
tags:
  - retail
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
| DC fill rate drops below 95% for two consecutive waves, or cut cases exceed 10% of ordered cases on any store order. | escalate_to_human | dc_operations_lead | Sustained cuts indicate slotting, labor, or inventory-record problems upstream; continuing to wave orders against bad inventory compounds store-level distortion. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
