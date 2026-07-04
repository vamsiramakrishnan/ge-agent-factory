---
type: Policy
title: Escalation policy 7
description: "When Estimated lateral build distance exceeds 500 feet from the nearest lit fiber route, or the build requires crossing a right-of-way or easement not already on file in TELCO 3; action: escalate_to_human; handoff: network_engineering"
source_id: "escalation-7"
tags:
  - telco
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
| Estimated lateral build distance exceeds 500 feet from the nearest lit fiber route, or the build requires crossing a right-of-way or easement not already on file in TELCO 3 | escalate_to_human | network_engineering | Long-haul laterals and easement crossings carry construction cost and timeline risk that only network engineering can validate before the quote commits to an interval. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
