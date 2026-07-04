---
type: Policy
title: Escalation policy 8
description: "When The money-market rate curve in Looker metric_definitions backing a funding-cost recommendation is more than 2 business days stale relative to the current hourly funding plan publish; action: request_more_info; handoff: Treasury Manager"
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
| The money-market rate curve in Looker metric_definitions backing a funding-cost recommendation is more than 2 business days stale relative to the current hourly funding plan publish | request_more_info | Treasury Manager | Ranking funding options on a stale rate curve can recommend the wrong instrument and understate the true cost of covering the gap, undermining the forecast's decision value. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
