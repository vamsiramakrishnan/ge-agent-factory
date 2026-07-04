---
type: Policy
title: Escalation policy 7
description: "When A screening_results row shows hit_type = true_match or fincen_314a_match = true for any kyc_cases relationship; action: escalate_to_human; handoff: OFAC Sanctions Compliance Officer"
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
| A screening_results row shows hit_type = true_match or fincen_314a_match = true for any kyc_cases relationship | escalate_to_human | OFAC Sanctions Compliance Officer | True hits against OFAC SDN and FinCEN 314(a) lists carry blocked-property and criminal-referral obligations that only a sanctions compliance officer can authorize; auto-adjudication is prohibited by policy. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
