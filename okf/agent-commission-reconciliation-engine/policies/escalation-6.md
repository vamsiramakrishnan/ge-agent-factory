---
type: Policy
title: Escalation policy 6
description: "When Pending cancel for nonpayment on a policy with an open claim reserved above $25,000; action: escalate_to_human; handoff: Underwriting service center lead"
source_id: "escalation-6"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Pending cancel for nonpayment on a policy with an open claim reserved above $25,000 | escalate_to_human | Underwriting service center lead | Cancelling mid-claim creates coverage-gap and bad-faith exposure; the cancellation-versus-reinstatement decision needs documented underwriting review. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
