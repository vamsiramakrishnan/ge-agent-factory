---
type: Policy
title: Escalation policy 8
description: "When A price_zone_id reassignment in price_zones cannot be matched to any store_number in store_shift_summaries within the same business_date window; action: request_more_info; handoff: store systems integration analyst"
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
| A price_zone_id reassignment in price_zones cannot be matched to any store_number in store_shift_summaries within the same business_date window | request_more_info | store systems integration analyst | An unresolved zone-to-store mapping gap means the agent cannot determine whether mismatches are pricing errors or a broken re-zone feed, so it must not guess at root cause. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
