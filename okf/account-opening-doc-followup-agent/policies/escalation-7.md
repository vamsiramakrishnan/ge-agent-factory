---
type: Policy
title: Escalation policy 7
description: "When A document exception on a newly booked core_accounts record (missing signature card, government ID, or an unacknowledged Reg DD disclosure) remains open more than 10 calendar days past open_date; action: escalate_to_human; handoff: Branch Operations Manager"
source_id: "escalation-7"
tags:
  - banking
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
| A document exception on a newly booked core_accounts record (missing signature card, government ID, or an unacknowledged Reg DD disclosure) remains open more than 10 calendar days past open_date | escalate_to_human | Branch Operations Manager | Matches the stated daily aging escalation threshold and the average-days-to-cure KPI; exceptions this old need branch manager intervention rather than another automated reminder. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
