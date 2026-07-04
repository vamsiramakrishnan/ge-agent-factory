---
type: Policy
title: Escalation policy 4
description: "When Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true; action: escalate_to_human; handoff: plant_manager"
source_id: "escalation-4"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
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
| Unplanned downtime exceeding 4 hours on an asset flagged constraint_asset=true | escalate_to_human | plant_manager | Constraint-asset downtime consumes irreplaceable throughput at the bottleneck; recovery sequencing and customer-impact calls belong to plant leadership, not an automated scheduler. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
