---
type: Policy
title: Escalation policy 7
description: "When quality_flag is 'bad' or 'uncertain' on more than 10% of the sensor_readings samples in the scoring window for an asset with criticality_ranking a_constraint or b_essential; action: request_more_info; handoff: Reliability Engineer"
source_id: "escalation-7"
tags:
  - manufacturing
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
| quality_flag is 'bad' or 'uncertain' on more than 10% of the sensor_readings samples in the scoring window for an asset with criticality_ranking a_constraint or b_essential | request_more_info | Reliability Engineer | Scoring a constraint or essential asset's degradation signature on unreliable sensor quality risks both false alarms that erode trust in the program and missed real degradation; the instrument needs verification before the RUL estimate is trusted. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
