---
type: Policy
title: Escalation policy 7
description: "When Forecasted next-day cash demand for a branch or ATM implies vault cash on hand will fall below forecasted demand within the next 48 hours; action: escalate_to_human; handoff: Regional Operations Manager"
source_id: "escalation-7"
tags:
  - banking
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
| Forecasted next-day cash demand for a branch or ATM implies vault cash on hand will fall below forecasted demand within the next 48 hours | escalate_to_human | Regional Operations Manager | Predicted cash-out risk must reach regional operations 48 hours in advance with a recommended inter-branch transfer plan before it becomes an emergency armored-carrier shipment. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
