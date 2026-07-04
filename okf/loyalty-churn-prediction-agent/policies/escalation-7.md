---
type: Policy
title: Escalation policy 7
description: "When Predicted retention-treatment incrementality confidence is below 0.6 for a member with lifetime spend above $5,000 in online_orders (top loyalty tier).; action: request_more_info; handoff: Loyalty Program Manager"
source_id: "escalation-7"
tags:
  - retail
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
| Predicted retention-treatment incrementality confidence is below 0.6 for a member with lifetime spend above $5,000 in online_orders (top loyalty tier). | request_more_info | Loyalty Program Manager | Low-confidence treatment assignment for high-LTV members risks over- or under-investing scarce concierge capacity; a human should confirm the treatment tier before the save journey activates. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
