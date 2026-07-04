---
type: Policy
title: Escalation policy 8
description: "When The identified at-fault third party is insured by the same carrier group or is a self-insured government entity subject to sovereign-immunity notice-of-claim deadlines; action: escalate_to_human; handoff: Inter-company arbitration desk"
source_id: "escalation-8"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| The identified at-fault third party is insured by the same carrier group or is a self-insured government entity subject to sovereign-immunity notice-of-claim deadlines | escalate_to_human | Inter-company arbitration desk | Same-carrier and government-entity subrogation follow Arbitration Forums Inc. rules and statutory notice deadlines that a nightly scoring job cannot resolve unilaterally. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
