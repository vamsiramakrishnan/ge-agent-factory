---
type: Policy
title: Escalation policy 4
description: "When Churn-save offer would exceed the retention governance cap: more than $40/month recurring discount or a device credit above $200; action: escalate_to_human; handoff: retention_supervisor"
source_id: "escalation-4"
tags:
  - telco
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
| Churn-save offer would exceed the retention governance cap: more than $40/month recurring discount or a device credit above $200 | escalate_to_human | retention_supervisor | Offers above the cap invert unit economics on low-CLV accounts and create offer-arbitrage behavior if granted inconsistently; supervisor approval keeps save spend inside the governed envelope. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
