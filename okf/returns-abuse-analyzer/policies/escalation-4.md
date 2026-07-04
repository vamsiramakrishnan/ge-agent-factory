---
type: Policy
title: Escalation policy 4
description: "When PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours.; action: escalate_to_human; handoff: digital_operations_oncall"
source_id: "escalation-4"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| PDP conversion rate drops more than 25% week-over-week on any top-100-traffic SKU, or sitewide cart-abandonment rate spikes more than 15 points within 24 hours. | escalate_to_human | digital_operations_oncall | Moves of that size are almost always a checkout defect, payment-gateway degradation, or broken content deploy — a live-site incident, not a merchandising tuning problem. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
