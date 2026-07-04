---
type: Policy
title: Escalation policy 7
description: "When material_stagings shows shortage_flag true with staging_status 'shorted' for a material_number tied to the ECO's affected items, and staged_qty is less than 50% of required_qty; action: escalate_to_human; handoff: materials_planner"
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
| material_stagings shows shortage_flag true with staging_status 'shorted' for a material_number tied to the ECO's affected items, and staged_qty is less than 50% of required_qty | escalate_to_human | materials_planner | Shortage severity beyond half of requirement changes the effectivity trade-off math and needs planner confirmation of expedite options before the agent recommends a date. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
