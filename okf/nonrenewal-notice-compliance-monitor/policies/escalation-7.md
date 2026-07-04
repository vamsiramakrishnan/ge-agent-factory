---
type: Policy
title: Escalation policy 7
description: "When A non-renewal candidate's statutory notice deadline falls within 10 calendar days of expiration_date and no notice has been dispatched in Guidewire PolicyCenter; action: escalate_to_human; handoff: Compliance Officer"
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
| A non-renewal candidate's statutory notice deadline falls within 10 calendar days of expiration_date and no notice has been dispatched in Guidewire PolicyCenter | escalate_to_human | Compliance Officer | A missed deadline legally obligates the carrier to renew a risk underwriting wanted off the books, so near-miss deadlines require immediate human sign-off before the notice is force-dispatched. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
