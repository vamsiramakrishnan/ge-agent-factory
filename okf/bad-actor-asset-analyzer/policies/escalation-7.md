---
type: Policy
title: Escalation policy 7
description: "When The combined bad-actor index ranks an asset newly into the top-10 that has fewer than 3 maintenance_work_orders and no failure_codes history in the analysis window; action: request_more_info; handoff: Reliability Engineer"
source_id: "escalation-7"
tags:
  - manufacturing
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
| The combined bad-actor index ranks an asset newly into the top-10 that has fewer than 3 maintenance_work_orders and no failure_codes history in the analysis window | request_more_info | Reliability Engineer | A high index score built on thin work-order history is likely a single expensive event rather than a genuine chronic bad actor, and needs manual review before it displaces an established offender in the defect-elimination queue. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
