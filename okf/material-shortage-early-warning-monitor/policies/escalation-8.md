---
type: Policy
title: Escalation policy 8
description: "When Cumulative premium freight recommended across open shortages this week exceeds the spend-authority tier defined in the Expedite & Allocation Authority Matrix; action: escalate_to_human; handoff: supply_chain_finance_lead"
source_id: "escalation-8"
tags:
  - manufacturing
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
| Cumulative premium freight recommended across open shortages this week exceeds the spend-authority tier defined in the Expedite & Allocation Authority Matrix | escalate_to_human | supply_chain_finance_lead | Aggregate expedite spend crossing the authority tier is a budget-control decision, not a per-shortage recommendation the agent can clear on its own. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
