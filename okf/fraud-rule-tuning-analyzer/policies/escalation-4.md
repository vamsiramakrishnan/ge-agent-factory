---
type: Policy
title: Escalation policy 4
description: "When Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators); action: escalate_to_human; handoff: payment_operations_supervisor"
source_id: "escalation-4"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators) | escalate_to_human | payment_operations_supervisor | BEC losses concentrate in exactly this pattern; policy requires out-of-band callback verification to a previously documented phone number before release. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
