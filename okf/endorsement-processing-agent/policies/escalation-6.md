---
type: Policy
title: Escalation policy 6
description: "When Insured requests reinstatement more than the state-permitted lapse window (e.g., 30 days) after cancellation effective date; action: request_more_info; handoff: Underwriting service center lead"
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
| Insured requests reinstatement more than the state-permitted lapse window (e.g., 30 days) after cancellation effective date | request_more_info | Underwriting service center lead | Reinstatement after an extended lapse requires a no-loss statement and underwriter approval because coverage cannot be restored over an unreported loss. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
