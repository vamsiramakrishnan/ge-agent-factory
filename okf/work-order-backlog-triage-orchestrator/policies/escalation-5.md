---
type: Policy
title: Escalation policy 5
description: "When Same failure code recorded 3 or more times on one asset within 90 days; action: escalate_to_human; handoff: reliability_engineer"
source_id: "escalation-5"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Same failure code recorded 3 or more times on one asset within 90 days | escalate_to_human | reliability_engineer | Repeat failures at that frequency mean the maintenance strategy is treating symptoms; a formal root cause analysis and possible redesign is needed, not another corrective work order. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
