---
type: Policy
title: Escalation policy 8
description: "When A wholesale partner port-in dispute ticket in Zendesk tickets ages past 5 business days with no losing-carrier response logged; action: escalate_to_human; handoff: wholesale_partner_relations"
source_id: "escalation-8"
tags:
  - telco
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
| A wholesale partner port-in dispute ticket in Zendesk tickets ages past 5 business days with no losing-carrier response logged | escalate_to_human | wholesale_partner_relations | Aged wholesale disputes without a carrier response risk breaching interconnection SLAs and require a named account manager to invoke the formal dispute-resolution clause rather than further automated follow-up. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
