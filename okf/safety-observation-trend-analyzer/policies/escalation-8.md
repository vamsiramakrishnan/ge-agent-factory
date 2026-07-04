---
type: Policy
title: Escalation policy 8
description: "When A recordable or DART-classified safety_incidents entry still has root_cause_complete = false more than 30 days after incident_date; action: request_more_info; handoff: Plant Safety Coordinator"
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
| A recordable or DART-classified safety_incidents entry still has root_cause_complete = false more than 30 days after incident_date | request_more_info | Plant Safety Coordinator | An open root cause means the leading-indicator model would be correlating against an unverified cause code; the trend cannot be published as validated until closure or a documented interim cause is on file. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
