---
type: Policy
title: Escalation policy 7
description: "When Lienholder payoff amount confirmed via DocuSign differs from the payoff amount recorded in Guidewire ClaimCenter reserve_lines by more than $500; action: request_more_info; handoff: Auto Claims Specialist"
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
| Lienholder payoff amount confirmed via DocuSign differs from the payoff amount recorded in Guidewire ClaimCenter reserve_lines by more than $500 | request_more_info | Auto Claims Specialist | Unresolved payoff discrepancies risk double payment or an incomplete lien release, which blocks clear title transfer to the insured or salvage buyer. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
