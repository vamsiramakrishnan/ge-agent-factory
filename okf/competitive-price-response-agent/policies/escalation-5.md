---
type: Policy
title: Escalation policy 5
description: "When A proposed change moves the KVI basket price index more than 3% in any zone, or reprices more than 25 known-value items in a single batch.; action: escalate_to_human; handoff: pricing_director"
source_id: "escalation-5"
tags:
  - retail
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
| A proposed change moves the KVI basket price index more than 3% in any zone, or reprices more than 25 known-value items in a single batch. | escalate_to_human | pricing_director | KVI moves reset customer price perception zone-wide and are competitive-response events; they require a deliberate strategy call with market-basket monitoring in place. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
