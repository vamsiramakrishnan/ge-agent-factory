---
type: Policy
title: Escalation policy 7
description: "When The same desk and instrument_type combination shows an unexplained residual break for a third consecutive business day without a logged booking-model fix; action: escalate_to_human; handoff: head_of_product_control"
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
| The same desk and instrument_type combination shows an unexplained residual break for a third consecutive business day without a logged booking-model fix | escalate_to_human | head_of_product_control | Recurrence past three business days indicates a systemic booking-model defect rather than a daily market-driven fluctuation, and requires root-cause remediation instead of another manual sign-off of the same explanation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
