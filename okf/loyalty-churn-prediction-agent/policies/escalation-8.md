---
type: Policy
title: Escalation policy 8
description: "When A member's segment_records status shows 'closed' while cart_events logs 3 or more abandon_cart or begin_checkout events in the trailing 7 days (contradictory membership-status and engagement signals).; action: escalate_to_human; handoff: Loyalty Program Manager"
source_id: "escalation-8"
tags:
  - retail
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
| A member's segment_records status shows 'closed' while cart_events logs 3 or more abandon_cart or begin_checkout events in the trailing 7 days (contradictory membership-status and engagement signals). | escalate_to_human | Loyalty Program Manager | Contradictory engagement and membership-status signals indicate a data-sync gap between Salesforce Commerce Cloud and Segment that must be resolved before the member is scored as lapsed or healthy. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
