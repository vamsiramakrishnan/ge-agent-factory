---
type: Eval Scenario
title: While running the Counterparty Credit Exposure Monitor workflow you encounter...
description: "While running the Counterparty Credit Exposure Monitor workflow you encounter this condition: Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window. Handle it end to end."
source_id: "counterparty-credit-exposure-monitor-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Counterparty Credit Exposure Monitor workflow you encounter this condition: Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window. Handle it end to end.

## Validates

- [exposure-collateral-aggregation](/queries/exposure-collateral-aggregation.md)

## Mechanisms to call

- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Counterparty Credit Exposure Monitor Banking Compliance Policy](/documents/counterparty-credit-exposure-monitor-compliance-policy.md)
