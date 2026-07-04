---
type: Eval Scenario
title: While running the Credit Portfolio Concentration Monitor workflow you encount...
description: "While running the Credit Portfolio Concentration Monitor workflow you encounter this condition: Aggregate committed exposure to the borrower and its obligor group would exceed the house limit of $10,000,000 or any single advance exceeds 15% of unimpaired capital (legal lending limit). Handle it end to end."
source_id: "credit-portfolio-concentration-monitor-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Credit Portfolio Concentration Monitor workflow you encounter this condition: Aggregate committed exposure to the borrower and its obligor group would exceed the house limit of $10,000,000 or any single advance exceeds 15% of unimpaired capital (legal lending limit). Handle it end to end.

## Validates

- [exposure-aggregation](/queries/exposure-aggregation.md)

## Mechanisms to call

- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Credit Portfolio Concentration Monitor Banking Compliance Policy](/documents/credit-portfolio-concentration-monitor-compliance-policy.md)
