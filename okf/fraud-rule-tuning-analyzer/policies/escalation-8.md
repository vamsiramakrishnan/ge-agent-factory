---
type: Policy
title: Escalation policy 8
description: "When The backtest sample for a rule contains fewer than 30 confirmed_fraud outcomes in fraud_alerts.alert_status over the defined lookback window; action: request_more_info; handoff: Fraud Strategy Manager"
source_id: "escalation-8"
tags:
  - banking
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
| The backtest sample for a rule contains fewer than 30 confirmed_fraud outcomes in fraud_alerts.alert_status over the defined lookback window | request_more_info | Fraud Strategy Manager | A sample below the statistical significance floor set in the Backtesting Standard cannot reliably support a threshold or retirement recommendation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
