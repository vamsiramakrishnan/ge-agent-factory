---
type: Policy
title: Escalation policy 8
description: "When policies.policy_status shows reinstated or pending_cancellation_nonpay for the same policy_number as an already-staged non-renewal notice; action: request_more_info; handoff: Servicing team lead"
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
| policies.policy_status shows reinstated or pending_cancellation_nonpay for the same policy_number as an already-staged non-renewal notice | request_more_info | Servicing team lead | A status change that conflicts with a staged non-renewal notice means the file's disposition is ambiguous and must be reconciled before any notice is finalized or withdrawn. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
