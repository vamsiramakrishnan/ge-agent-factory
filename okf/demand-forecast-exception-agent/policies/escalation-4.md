---
type: Policy
title: Escalation policy 4
description: "When Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery.; action: escalate_to_human; handoff: replenishment_manager"
source_id: "escalation-4"
tags:
  - retail
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
| Out-of-stock rate on A-velocity items exceeds 5% during an active promo window, or projected store on-hand falls below presentation minimum before the next scheduled delivery. | escalate_to_human | replenishment_manager | Promo OOS on A-items burns ad credibility and vendor co-op commitments; recovery needs expedited allocation decisions the agent should not make unilaterally. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
