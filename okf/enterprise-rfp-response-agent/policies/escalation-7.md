---
type: Policy
title: Escalation policy 7
description: "When A mandatory RFP requirement maps to a product_bundle or contract_term the standard catalog in service_quotes has never fulfilled at the requested scale or site count; action: escalate_to_human; handoff: Solutions Engineering SME"
source_id: "escalation-7"
tags:
  - telco
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
| A mandatory RFP requirement maps to a product_bundle or contract_term the standard catalog in service_quotes has never fulfilled at the requested scale or site count | escalate_to_human | Solutions Engineering SME | Only a solutions engineer can confirm whether a non-standard build is technically feasible before the compliance matrix commits the company to it in writing. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
