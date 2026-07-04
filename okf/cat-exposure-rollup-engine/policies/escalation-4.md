---
type: Policy
title: Escalation policy 4
description: "When Indicated rate change for any state/line combination exceeds plus-or-minus 10% versus the currently filed rate level; action: escalate_to_human; handoff: Chief actuary and state filings manager"
source_id: "escalation-4"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Indicated rate change for any state/line combination exceeds plus-or-minus 10% versus the currently filed rate level | escalate_to_human | Chief actuary and state filings manager | Double-digit indications drive prior-approval filings, SERFF objections, and potential public rate hearings that require the credentialed actuary of record. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
