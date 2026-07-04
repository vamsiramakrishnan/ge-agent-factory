---
type: Policy
title: Escalation policy 1
description: "When Pricing overcharge >$50K discovered in monthly audit; action: escalate_to_human; handoff: Contract Manager + Category Lead"
source_id: "escalation-1"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.0
generation_status: generated
ge_status: generated
---

# Escalation policy 1

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.0

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Pricing overcharge >$50K discovered in monthly audit | escalate_to_human | Contract Manager + Category Lead | High-value overcharges require immediate senior review and vendor negotiation authority. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
