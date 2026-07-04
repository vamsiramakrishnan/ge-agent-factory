---
type: Policy
title: Escalation policy 8
description: "When A rated_events record reaches rerate_count = 3 (the maximum) while guiding_status is still not 'guided'; action: escalate_to_human; handoff: Revenue Assurance Analyst"
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
| A rated_events record reaches rerate_count = 3 (the maximum) while guiding_status is still not 'guided' | escalate_to_human | Revenue Assurance Analyst | Repeated rerate failures indicate the correction pattern itself is misapplied, not a transient data problem — a fourth automated pass would only manufacture more suspense instead of resolving it. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
