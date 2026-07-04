---
type: Policy
title: Escalation policy 7
description: "When A repaired payment_instructions record is queued for release within 15 minutes of its clearing_batches cutoff_date and settlement_window with no clerk acknowledgment on record; action: escalate_to_human; handoff: Payments Operations Manager"
source_id: "escalation-7"
tags:
  - banking
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
| A repaired payment_instructions record is queued for release within 15 minutes of its clearing_batches cutoff_date and settlement_window with no clerk acknowledgment on record | escalate_to_human | Payments Operations Manager | Releasing an unacknowledged repair against a closing settlement window risks an unreviewed error becoming final and unrecoverable under rail finality rules. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
