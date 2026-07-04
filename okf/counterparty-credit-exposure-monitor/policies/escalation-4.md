---
type: Policy
title: Escalation policy 4
description: "When Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window; action: escalate_to_human; handoff: market_risk_committee"
source_id: "escalation-4"
tags:
  - banking
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
| Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window | escalate_to_human | market_risk_committee | A limit excess requires a documented cure-or-approve decision, and clustered backtest exceptions can migrate the desk into a higher regulatory multiplier band under the market risk capital rule. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
