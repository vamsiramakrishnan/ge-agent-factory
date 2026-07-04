---
type: Policy
title: Escalation policy 8
description: "When A suspense item has aged past 45 days with no candidate match above the review-tier confidence threshold; action: escalate_to_human; handoff: Cash Applications Team Lead"
source_id: "escalation-8"
tags:
  - insurance
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
| A suspense item has aged past 45 days with no candidate match above the review-tier confidence threshold | escalate_to_human | Cash Applications Team Lead | Long-aged unmatched cash risks missing statutory unclaimed-property reporting deadlines and needs a supervisory write-off or escheatment decision rather than further automated matching attempts. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
