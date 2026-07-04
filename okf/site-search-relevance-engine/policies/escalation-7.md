---
type: Policy
title: Escalation policy 7
description: "When A drafted synonym or redirect rule set would reroute more than 5% of total site search query volume in a single deploy; action: request_more_info; handoff: site_merchandising_lead"
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
| A drafted synonym or redirect rule set would reroute more than 5% of total site search query volume in a single deploy | request_more_info | site_merchandising_lead | Rule sets of that reach can silently reshape category traffic and PDP mix; they need a merchandising-lead review of assortment and revenue impact before going live. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
