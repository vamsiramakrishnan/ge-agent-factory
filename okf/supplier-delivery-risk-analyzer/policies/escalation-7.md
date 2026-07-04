---
type: Policy
title: Escalation policy 7
description: "When Aggregate open purchase_orders exposure to a single vendor exceeds 15% of that vendor's annual_spend while vendors.risk_score is high; action: escalate_to_human; handoff: Procurement Category Manager"
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
| Aggregate open purchase_orders exposure to a single vendor exceeds 15% of that vendor's annual_spend while vendors.risk_score is high | escalate_to_human | Procurement Category Manager | Concentration risk at a high-risk vendor requires sourcing-diversification authority beyond what a dashboard-level chase-list recommendation carries. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
