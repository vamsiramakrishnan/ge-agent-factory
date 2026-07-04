---
type: Policy
title: Escalation policy 8
description: "When The ranked root-cause hypothesis has no single failure signature accounting for more than 40% of the correlated sensor_readings and historical_metrics evidence; action: request_more_info; handoff: Reliability Engineer"
source_id: "escalation-8"
tags:
  - manufacturing
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
| The ranked root-cause hypothesis has no single failure signature accounting for more than 40% of the correlated sensor_readings and historical_metrics evidence | request_more_info | Reliability Engineer | Publishing a low-confidence hypothesis as the root cause misdirects maintenance resources and delays the real fix; ambiguous evidence needs a walked physical inspection before the agent commits to a hypothesis. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
