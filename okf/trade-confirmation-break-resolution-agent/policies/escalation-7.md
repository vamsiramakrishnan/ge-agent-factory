---
type: Policy
title: Escalation policy 7
description: "When An unconfirmed trade remains unmatched more than 30 days past its trade_date with notional_amount exceeding $10,000,000; action: escalate_to_human; handoff: Treasury Operations Manager"
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
| An unconfirmed trade remains unmatched more than 30 days past its trade_date with notional_amount exceeding $10,000,000 | escalate_to_human | Treasury Operations Manager | Aged, large-notional unconfirmed derivatives carry escalating settlement and legal risk under ISDA timeliness standards and must be reviewed by a manager rather than left in automated chaser cycles. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
