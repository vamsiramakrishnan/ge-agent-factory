---
type: Policy
title: Escalation policy 5
description: "When Out-of-sequence endorsement request whose effective date is on or before a reported loss date on the same policy; action: escalate_to_human; handoff: Underwriting referral desk with claims department notification"
source_id: "escalation-5"
tags:
  - insurance
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
| Out-of-sequence endorsement request whose effective date is on or before a reported loss date on the same policy | escalate_to_human | Underwriting referral desk with claims department notification | Retroactive coverage changes spanning a known loss create fraud and detrimental-reliance exposure and must be reviewed jointly by underwriting and claims. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
