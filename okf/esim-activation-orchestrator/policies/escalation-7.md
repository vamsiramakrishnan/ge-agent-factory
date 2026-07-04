---
type: Policy
title: Escalation policy 7
description: "When capacity_utilization_pct on the target network_inventory_items element exceeds 95% while provisioning_tasks queued against that ne_id keep growing during a bulk device-launch weekend; action: escalate_to_human; handoff: Network Capacity Engineering On-Call"
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
| capacity_utilization_pct on the target network_inventory_items element exceeds 95% while provisioning_tasks queued against that ne_id keep growing during a bulk device-launch weekend | escalate_to_human | Network Capacity Engineering On-Call | Congestion-driven fallout needs a capacity decision the orchestrator isn't authorized to make; queuing more retries against a saturated element only compounds the backlog. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
