---
type: Policy
title: Escalation policy 7
description: "When A PO's projected ship_date slips to within 2 days of its dock appointment (the pre-agent detection baseline) while fill_rate_pct on that warehouse_orders record is below 90% and cut_code is inventory_short or slot_unavailable; action: escalate_to_human; handoff: Inventory Control Analyst"
source_id: "escalation-7"
tags:
  - retail
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
| A PO's projected ship_date slips to within 2 days of its dock appointment (the pre-agent detection baseline) while fill_rate_pct on that warehouse_orders record is below 90% and cut_code is inventory_short or slot_unavailable | escalate_to_human | Inventory Control Analyst | Regression to the pre-agent 2-day detection window signals the ETA-prediction model or upstream ASN feed itself has failed and needs human review before any dock rebalancing recommendation is trusted. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
