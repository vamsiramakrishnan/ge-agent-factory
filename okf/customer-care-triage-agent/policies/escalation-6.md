---
type: Policy
title: Escalation policy 6
description: "When A campaign audience definition would include known minors, or the offer's projected point liability exceeds $100k without a booked accrual.; action: refuse; handoff: crm_campaign_manager"
source_id: "escalation-6"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A campaign audience definition would include known minors, or the offer's projected point liability exceeds $100k without a booked accrual. | refuse | crm_campaign_manager | Marketing to minors and unbooked liability both create obligations that cannot be unwound after send; the campaign must be rebuilt, not patched. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
