---
type: Policy
title: Escalation policy 6
description: "When Enterprise quote above $5,000 MRR or any 36-month term with early-termination-fee waivers attached; action: escalate_to_human; handoff: enterprise_deal_desk"
source_id: "escalation-6"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Enterprise quote above $5,000 MRR or any 36-month term with early-termination-fee waivers attached | escalate_to_human | enterprise_deal_desk | Large multi-year commitments carry revenue-recognition and special-construction cost implications that require contract and finance review before the quote is released. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
