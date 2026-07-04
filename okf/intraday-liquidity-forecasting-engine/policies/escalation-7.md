---
type: Policy
title: Escalation policy 7
description: "When A currency's projected intraday cash position goes negative ahead of that currency's correspondent nostro cutoff and no committed same-day credit line covers the gap; action: escalate_to_human; handoff: Money Market Desk Head"
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
| A currency's projected intraday cash position goes negative ahead of that currency's correspondent nostro cutoff and no committed same-day credit line covers the gap | escalate_to_human | Money Market Desk Head | Only the money-market desk holds execution authority to source same-day funding before cutoff; the forecasting agent can identify and cost the gap but cannot commit the bank to a borrowing decision. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
