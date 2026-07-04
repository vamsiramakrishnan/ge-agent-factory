---
type: Policy
title: Escalation policy 7
description: "When First allocation has not posted in Oracle Retail MFCS within 48 hours of the confirmed ad-break date for a new item; action: escalate_to_human; handoff: Replenishment Manager"
source_id: "escalation-7"
tags:
  - retail
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
| First allocation has not posted in Oracle Retail MFCS within 48 hours of the confirmed ad-break date for a new item | escalate_to_human | Replenishment Manager | A missed allocation window means the item goes on-ad with empty shelves, defeating the launch and wasting vendor ad funding — store operations needs a manual push, not another automated retry. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
