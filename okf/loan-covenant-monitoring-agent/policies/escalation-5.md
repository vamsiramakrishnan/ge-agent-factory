---
type: Policy
title: Escalation policy 5
description: "When Application carries 3 or more policy exceptions, or a CRE mortgage exceeds 80% LTV without an approved mitigant (additional collateral, guaranty, or amortization step-down); action: escalate_to_human; handoff: senior_credit_officer"
source_id: "escalation-5"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Application carries 3 or more policy exceptions, or a CRE mortgage exceeds 80% LTV without an approved mitigant (additional collateral, guaranty, or amortization step-down) | escalate_to_human | senior_credit_officer | Interagency CRE guidance ties supervisory LTV limits to board-level exception tracking; stacked exceptions must be individually approved and reported in aggregate to the board. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
