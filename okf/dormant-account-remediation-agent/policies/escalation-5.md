---
type: Policy
title: Escalation policy 5
description: "When Dormant account (no customer-initiated activity for 12+ months) is reactivated and an outbound transfer or new payee is requested in the same session; action: escalate_to_human; handoff: fraud_operations_elder_abuse_desk"
source_id: "escalation-5"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Dormant account (no customer-initiated activity for 12+ months) is reactivated and an outbound transfer or new payee is requested in the same session | escalate_to_human | fraud_operations_elder_abuse_desk | Dormancy-plus-immediate-disbursement is a leading indicator of account takeover and elder financial exploitation; many states and FINRA-parallel bank policies require a disbursement pause and welfare check. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
