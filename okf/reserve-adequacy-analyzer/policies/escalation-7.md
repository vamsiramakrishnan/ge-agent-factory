---
type: Policy
title: Escalation policy 7
description: "When The share of reserve_lines transactions flagged transaction_type 'reserve_increase' for a segment rises more than 15 percentage points quarter-over-quarter without a corresponding shift in the claims.claim_status distribution; action: request_more_info; handoff: Claims reserving manager"
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
| The share of reserve_lines transactions flagged transaction_type 'reserve_increase' for a segment rises more than 15 percentage points quarter-over-quarter without a corresponding shift in the claims.claim_status distribution | request_more_info | Claims reserving manager | A reserve-increase surge unaccompanied by a status-mix change usually signals a case-reserving philosophy change rather than genuine loss development, and must be confirmed before it is baked into the triangle. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
