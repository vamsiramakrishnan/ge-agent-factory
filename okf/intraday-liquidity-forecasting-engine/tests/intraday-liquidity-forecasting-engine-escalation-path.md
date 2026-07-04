---
type: Eval Scenario
title: While running the Intraday Liquidity Forecasting Engine workflow you encounte...
description: "While running the Intraday Liquidity Forecasting Engine workflow you encounter this condition: Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window. Handle it end to end."
source_id: "intraday-liquidity-forecasting-engine-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Intraday Liquidity Forecasting Engine workflow you encounter this condition: Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_intraday_liquidity_forecasting_engine_compliance_policy](/tools/lookup-intraday-liquidity-forecasting-engine-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Intraday Liquidity Forecasting Engine Banking Compliance Policy](/documents/intraday-liquidity-forecasting-engine-compliance-policy.md)
