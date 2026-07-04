---
type: Policy
title: Escalation policy 7
description: "When The clustering pass detects a duplicate rate above 15% of the open engineering_change_orders backlog for a given review cycle; action: escalate_to_human; handoff: change_analyst"
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
| The clustering pass detects a duplicate rate above 15% of the open engineering_change_orders backlog for a given review cycle | escalate_to_human | change_analyst | A duplicate rate materially above the 11%-to-2% KPI trend may indicate a taxonomy or matching-key defect that needs analyst review before the agenda is trusted. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
