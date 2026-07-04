---
type: Policy
title: Escalation policy 8
description: "When The cardholder disputes the same merchant transaction a second time after a prior pre-arbitration loss on that reason code; action: escalate_to_human; handoff: Card Network Arbitration Specialist"
source_id: "escalation-8"
tags:
  - banking
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
| The cardholder disputes the same merchant transaction a second time after a prior pre-arbitration loss on that reason code | escalate_to_human | Card Network Arbitration Specialist | Repeat filings on an already-lost reason code risk network pre-arbitration fees and require a specialist's judgment on whether new compelling evidence actually changes the outcome. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
