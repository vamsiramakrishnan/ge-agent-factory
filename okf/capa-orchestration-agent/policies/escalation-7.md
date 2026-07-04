---
type: Policy
title: Escalation policy 7
description: "When A capa_actions record's linked nonconformance_records shows mrb_required=true but disposition is anything other than 'scrap' or 'return_to_vendor' with no MRB sign-off evidence attached; action: escalate_to_human; handoff: Material Review Board chair"
source_id: "escalation-7"
tags:
  - manufacturing
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
| A capa_actions record's linked nonconformance_records shows mrb_required=true but disposition is anything other than 'scrap' or 'return_to_vendor' with no MRB sign-off evidence attached | escalate_to_human | Material Review Board chair | MRB-required dispositions on critical or ambiguous nonconformances need documented board sign-off before the CAPA can proceed toward containment closure. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
