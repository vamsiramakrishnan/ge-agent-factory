---
type: Policy
title: Escalation policy 7
description: "When credibility_factor for a flagged state/class/tier cell is below 0.20 while analytics_events variance_pct exceeds 15% for two consecutive periods; action: request_more_info; handoff: Senior actuarial analyst"
source_id: "escalation-7"
tags:
  - insurance
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
| credibility_factor for a flagged state/class/tier cell is below 0.20 while analytics_events variance_pct exceeds 15% for two consecutive periods | request_more_info | Senior actuarial analyst | Low-credibility cells can show large variance_pct purely from thin volume; an additional period or a credibility-weighted blend must confirm the signal before it is treated as deterioration. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
