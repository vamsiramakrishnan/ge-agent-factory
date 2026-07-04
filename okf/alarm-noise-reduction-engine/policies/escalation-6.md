---
type: Policy
title: Escalation policy 6
description: "When Sustained KPI degradation: VoLTE drop rate above 2% or PRB utilization above 90% on the same cells for 3 consecutive busy hours with no active alarm; action: request_more_info; handoff: rf_engineering"
source_id: "escalation-6"
tags:
  - telco
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
| Sustained KPI degradation: VoLTE drop rate above 2% or PRB utilization above 90% on the same cells for 3 consecutive busy hours with no active alarm | request_more_info | rf_engineering | Alarm-free degradation points to interference, parameter drift, or capacity exhaustion — diagnoses that need RF engineering drive-data and neighbor-list review, not NOC ticket recycling. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
