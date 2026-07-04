---
type: Policy
title: Escalation policy 7
description: "When Industry or product-type concentration (e.g., CRE, sponsor/leveraged lending) reaches 80% or more of its board-approved sector limit even though no single obligor is individually in breach; action: escalate_to_human; handoff: Chief Credit Officer"
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
| Industry or product-type concentration (e.g., CRE, sponsor/leveraged lending) reaches 80% or more of its board-approved sector limit even though no single obligor is individually in breach | escalate_to_human | Chief Credit Officer | Sector-level concentration approaching the board limit is a portfolio risk-appetite decision, not a single-deal underwriting call, and requires Chief Credit Officer review before further bookings in that sector. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
