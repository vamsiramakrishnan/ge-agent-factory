---
type: Policy
title: Escalation policy 5
description: "When A customer submits a data deletion, access, or correction request (DSAR) through any channel, including free text in a chat or survey.; action: escalate_to_human; handoff: privacy_office"
source_id: "escalation-5"
tags:
  - retail
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
| A customer submits a data deletion, access, or correction request (DSAR) through any channel, including free text in a chat or survey. | escalate_to_human | privacy_office | DSARs start a statutory response clock (45 days under CPRA) and require identity verification and a systems-of-record sweep the agent cannot perform alone. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
