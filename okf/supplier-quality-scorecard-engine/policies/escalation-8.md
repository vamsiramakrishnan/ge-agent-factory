---
type: Policy
title: Escalation policy 8
description: "When A supplier's trailing-quarter accepted_with_deviation rate across inspection_lots exceeds 15%; action: request_more_info; handoff: Supplier Quality Engineer"
source_id: "escalation-8"
tags:
  - manufacturing
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
| A supplier's trailing-quarter accepted_with_deviation rate across inspection_lots exceeds 15% | request_more_info | Supplier Quality Engineer | A high concession rate can mask a real quality escape behind engineering waivers; the scorecard must not finalize a green rating until concession justifications are pulled from nonconformance_records. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
