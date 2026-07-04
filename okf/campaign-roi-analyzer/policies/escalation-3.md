---
type: Policy
title: Escalation policy 3
description: "When UTM tracking data missing on >30% of lead touchpoints; action: escalate_to_human; handoff: Marketing Operations lead"
source_id: "escalation-3"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.2
generation_status: generated
ge_status: generated
---

# Escalation policy 3

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.2

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| UTM tracking data missing on >30% of lead touchpoints | escalate_to_human | Marketing Operations lead | UTM gaps prevent accurate multi-touch attribution; MarTech ops must remediate tracking or validate alternative attribution method. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
