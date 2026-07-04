---
type: Eval Scenario
title: While running the Branch Cash Position Forecast Engine workflow you encounter...
description: "While running the Branch Cash Position Forecast Engine workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end."
source_id: "branch-cash-position-forecast-engine-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Branch Cash Position Forecast Engine workflow you encounter this condition: Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days. Handle it end to end.

## Validates

- [branch-transaction-payroll-calendar-pull](/queries/branch-transaction-payroll-calendar-pull.md)

## Mechanisms to call

- [lookup_branch_cash_position_forecast_engine_compliance_policy](/tools/lookup-branch-cash-position-forecast-engine-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Branch Cash Position Forecast Engine Banking Compliance Policy](/documents/branch-cash-position-forecast-engine-compliance-policy.md)
