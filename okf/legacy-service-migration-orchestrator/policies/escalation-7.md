---
type: Policy
title: Escalation policy 7
description: "When A network_inventory_items element selected as a cutover target shows capacity_utilization_pct at or above 90% at sequencing time; action: request_more_info; handoff: network_engineering"
source_id: "escalation-7"
tags:
  - telco
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
| A network_inventory_items element selected as a cutover target shows capacity_utilization_pct at or above 90% at sequencing time | request_more_info | network_engineering | Cutting a migration onto a target already near saturation risks re-creating the same outage the migration was meant to prevent; engineering must confirm headroom before the order is sequenced. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
