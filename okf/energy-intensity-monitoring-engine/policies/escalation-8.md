---
type: Policy
title: Escalation policy 8
description: "When The sensor_readings record feeding the anomaly calculation carries quality_flag='bad' or is more than 24 hours stale; action: request_more_info; handoff: OSIsoft PI System Administrator"
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
| The sensor_readings record feeding the anomaly calculation carries quality_flag='bad' or is more than 24 hours stale | request_more_info | OSIsoft PI System Administrator | Publishing an intensity finding off a bad or stale meter tag misattributes waste and erodes trust in the daily anomaly feed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
