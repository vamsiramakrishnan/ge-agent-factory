---
type: Policy
title: Escalation policy 8
description: "When The weekly retention worklist recommends the same competitor-rate-matching offer to more than 15% of a segment in a single run; action: request_more_info; handoff: Retail Deposits Product Manager"
source_id: "escalation-8"
tags:
  - banking
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
| The weekly retention worklist recommends the same competitor-rate-matching offer to more than 15% of a segment in a single run | request_more_info | Retail Deposits Product Manager | A concentrated blanket-offer pattern more often signals a scoring or rate-spread data error than genuine individual flight risk, and must be reviewed before publish to avoid mispriced retention spend. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
