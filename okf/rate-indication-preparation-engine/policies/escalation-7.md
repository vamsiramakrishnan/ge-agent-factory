---
type: Policy
title: Escalation policy 7
description: "When Selected loss cost trend factor for a state/line deviates from the Verisk ISO ERC advisory annual_trend_factor by more than 3 percentage points; action: escalate_to_human; handoff: Chief actuary"
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
| Selected loss cost trend factor for a state/line deviates from the Verisk ISO ERC advisory annual_trend_factor by more than 3 percentage points | escalate_to_human | Chief actuary | Trend deviations of this size are the single most common driver of DOI objection letters and require documented actuarial justification before filing. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
