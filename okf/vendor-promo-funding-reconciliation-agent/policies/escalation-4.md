---
type: Policy
title: Escalation policy 4
description: "When Recommended markdown depth exceeds 40%, or the cumulative margin impact of a price action exceeds $250k at the class level.; action: escalate_to_human; handoff: divisional_merchandise_manager"
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
| Recommended markdown depth exceeds 40%, or the cumulative margin impact of a price action exceeds $250k at the class level. | escalate_to_human | divisional_merchandise_manager | Markdown and margin exposure at that depth is an open-to-buy and P&L event requiring DMM approval, not an automated clearance-cadence step. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
