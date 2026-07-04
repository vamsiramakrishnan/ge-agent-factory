---
type: Policy
title: Escalation policy 8
description: "When Any reserve_lines record has over_authority_referral = true while authority_level_used is below claims_manager_250k; action: escalate_to_human; handoff: Claims manager / actuarial reserving committee"
source_id: "escalation-8"
tags:
  - insurance
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
| Any reserve_lines record has over_authority_referral = true while authority_level_used is below claims_manager_250k | escalate_to_human | Claims manager / actuarial reserving committee | A referral flag paired with a sub-manager authority level indicates a control breakdown in the authority workflow that must be resolved jointly before the transaction is trusted as evidence. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
