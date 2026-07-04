---
type: Policy
title: Escalation policy 7
description: "When A published scenario run's projected_inventory_value_usd differs from the BigQuery historical_metrics baseline for the same period by more than 25%; action: request_more_info; handoff: finance_business_partner"
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
| A published scenario run's projected_inventory_value_usd differs from the BigQuery historical_metrics baseline for the same period by more than 25% | request_more_info | finance_business_partner | Large unexplained swings in projected inventory valuation must be reconciled with finance before the figure appears in the executive S&OP deck, since it directly feeds the working-capital forecast. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
