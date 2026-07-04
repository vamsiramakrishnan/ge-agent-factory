---
type: Policy
title: Escalation policy 5
description: "When Effectivity conflict detected: open production orders in process against a revision the ECO supersedes with immediate effectivity; action: request_more_info; handoff: change_analyst"
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
| Effectivity conflict detected: open production orders in process against a revision the ECO supersedes with immediate effectivity | request_more_info | change_analyst | Cut-in decisions (use-up, rework in place, or scrap WIP) depend on inventory position and customer commitments the ECO record alone does not show. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
