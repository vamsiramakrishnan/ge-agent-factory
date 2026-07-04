---
type: Policy
title: Escalation policy 6
description: "When Confirmed account takeover on the originating account, or a P2P/wire scam claim where the customer was manipulated into authorizing the payment; action: escalate_to_human; handoff: fraud_investigations_unit"
source_id: "escalation-6"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Confirmed account takeover on the originating account, or a P2P/wire scam claim where the customer was manipulated into authorizing the payment | escalate_to_human | fraud_investigations_unit | Authorized-push-payment scams sit in a contested Reg E liability zone; classification as authorized vs unauthorized drives reimbursement and must be made by investigators, not the servicing layer. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
