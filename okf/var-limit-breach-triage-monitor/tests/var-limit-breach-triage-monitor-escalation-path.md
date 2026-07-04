---
type: Eval Scenario
title: While running the VaR Limit Breach Triage Monitor workflow you encounter this...
description: "While running the VaR Limit Breach Triage Monitor workflow you encounter this condition: Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window. Handle it end to end."
source_id: "var-limit-breach-triage-monitor-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the VaR Limit Breach Triage Monitor workflow you encounter this condition: Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window. Handle it end to end.

## Validates

- [risk-run-breach-detection](/queries/risk-run-breach-detection.md)

## Mechanisms to call

- [lookup_var_limit_breach_triage_monitor_compliance_policy](/tools/lookup-var-limit-breach-triage-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [VaR Limit Breach Triage Monitor Banking Compliance Policy](/documents/var-limit-breach-triage-monitor-compliance-policy.md)
