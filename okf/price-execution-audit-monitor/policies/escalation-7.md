---
type: Policy
title: Escalation policy 7
description: "When A store_number's overcharge rate (pos_transactions ringing above the price_recommendations price of record) exceeds the statutory scan-accuracy tolerance for two consecutive audit cycles at the same store; action: escalate_to_human; handoff: district loss prevention manager"
source_id: "escalation-7"
tags:
  - retail
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
| A store_number's overcharge rate (pos_transactions ringing above the price_recommendations price of record) exceeds the statutory scan-accuracy tolerance for two consecutive audit cycles at the same store | escalate_to_human | district loss prevention manager | Repeat statutory-tolerance breaches at one store carry weights-and-measures inspection and regulatory-fine exposure that requires a human remediation plan, not another automated fix-it task. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
