---
type: Policy
title: Escalation policy 7
description: "When The cross-channel behavior graph shows the same customer_email filing return claims on 3+ online_orders within a rolling 30-day window with combined order_total above $500 and no corroborating satisfaction_scores or tickets record documenting a product defect.; action: escalate_to_human; handoff: Fraud Analyst"
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
| The cross-channel behavior graph shows the same customer_email filing return claims on 3+ online_orders within a rolling 30-day window with combined order_total above $500 and no corroborating satisfaction_scores or tickets record documenting a product defect. | escalate_to_human | Fraud Analyst | That volume/value pattern is the classic wardrobing/bracketing signature — it needs a human-reviewed case file before any account restriction, not an automated hold. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
