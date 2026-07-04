---
type: Policy
title: Escalation policy 7
description: "When A single linked_entity_name (e.g., a body shop or medical provider) recurs across claims_sharing_this_entity of 10 or more open claims with at least one prior_siu_substantiated_hits; action: escalate_to_human; handoff: SIU Manager"
source_id: "escalation-7"
tags:
  - insurance
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
| A single linked_entity_name (e.g., a body shop or medical provider) recurs across claims_sharing_this_entity of 10 or more open claims with at least one prior_siu_substantiated_hits | escalate_to_human | SIU Manager | Recurrence at this scale indicates an established provider- or shop-level ring rather than an isolated link, requiring case consolidation and investigator reassignment decisions beyond a single-claim referral. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
