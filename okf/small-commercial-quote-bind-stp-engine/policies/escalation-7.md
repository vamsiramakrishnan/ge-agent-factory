---
type: Policy
title: Escalation policy 7
description: "When A policy_quotes record shows quote_status = bound while underwriting_tier = non_standard or declined; action: request_more_info; handoff: Underwriting Manager"
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
| A policy_quotes record shows quote_status = bound while underwriting_tier = non_standard or declined | request_more_info | Underwriting Manager | A bound non-standard or declined tier indicates a tier override that bypassed authority controls; it must be reconciled before the STP rate KPI counts it as a clean straight-through bind. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
