---
type: Policy
title: Escalation policy 8
description: "When shift_schedules shows published_flag=true and the task marked complete, but store_shift_summaries transaction_count for that business_date is zero and pos_transactions shows no matching register activity; action: request_more_info; handoff: store_manager"
source_id: "escalation-8"
tags:
  - retail
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
| shift_schedules shows published_flag=true and the task marked complete, but store_shift_summaries transaction_count for that business_date is zero and pos_transactions shows no matching register activity | request_more_info | store_manager | A conflict between self-reported completion and POS evidence must be confirmed by the store manager before the district scorecard reflects the task as done. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
