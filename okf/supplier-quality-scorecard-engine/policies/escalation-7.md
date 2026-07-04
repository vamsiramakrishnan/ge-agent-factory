---
type: Policy
title: Escalation policy 7
description: "When A weighted risk-score recompute would move a vendor from Tier 2 into Tier 1 disqualification-track while that vendor carries active purchase_orders in status approved or paid; action: escalate_to_human; handoff: Sourcing Manager"
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
| A weighted risk-score recompute would move a vendor from Tier 2 into Tier 1 disqualification-track while that vendor carries active purchase_orders in status approved or paid | escalate_to_human | Sourcing Manager | Reclassifying a supplier with open committed spend triggers dual-sourcing and supply-continuity decisions outside the Supplier Quality Engineer's authority. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
