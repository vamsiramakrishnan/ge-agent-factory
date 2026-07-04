---
type: Policy
title: Escalation policy 7
description: "When Ticket priority is P1 or P2 in Zendesk and the linked policy's underwriting_submissions record shows submission_status of with_underwriter or blocked_ofac_review; action: escalate_to_human; handoff: Underwriting service center lead"
source_id: "escalation-7"
tags:
  - insurance
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
| Ticket priority is P1 or P2 in Zendesk and the linked policy's underwriting_submissions record shows submission_status of with_underwriter or blocked_ofac_review | escalate_to_human | Underwriting service center lead | A high-priority endorsement request touching a policy still under active underwriting review or OFAC hold cannot be processed straight-through; the underwriter of record must clear the hold first. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
