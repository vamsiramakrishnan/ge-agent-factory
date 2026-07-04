---
type: Policy
title: Escalation policy 7
description: "When A flagged claim's loss_date is within 60 days of its jurisdiction_state statute-of-limitations deadline and no ClaimCenter referral has been created yet; action: escalate_to_human; handoff: Subrogation Specialist"
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
| A flagged claim's loss_date is within 60 days of its jurisdiction_state statute-of-limitations deadline and no ClaimCenter referral has been created yet | escalate_to_human | Subrogation Specialist | Once the limitations period runs the recovery right is extinguished, so near-deadline claims cannot wait for the next nightly scoring cycle. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
