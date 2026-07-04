---
type: Policy
title: Escalation policy 8
description: "When Endorsement changes the named_insured or adds an additional insured on a policy whose prior_carrier_lapse flag is true; action: request_more_info; handoff: Policy Services Rep team lead"
source_id: "escalation-8"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Endorsement changes the named_insured or adds an additional insured on a policy whose prior_carrier_lapse flag is true | request_more_info | Policy Services Rep team lead | A named-insured change layered on a known prior-carrier coverage lapse increases misrepresentation risk and needs a verified insurable-interest and continuous-coverage check before the transaction is routed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
