---
type: Policy
title: Escalation policy 8
description: "When asset_tag_hierarchies.functional_location_active is false for the alerting tag_id while its sensor_readings are still streaming in_alarm=true; action: escalate_to_human; handoff: Reliability Engineer"
source_id: "escalation-8"
tags:
  - manufacturing
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
| asset_tag_hierarchies.functional_location_active is false for the alerting tag_id while its sensor_readings are still streaming in_alarm=true | escalate_to_human | Reliability Engineer | An alarm against a tag marked inactive in the hierarchy usually means the PI tag mapping is stale after an equipment swap or decommission; auto-generating a work order against the wrong physical asset wastes technician time and corrupts the failure history for both assets. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
