---
type: Eval Scenario
title: "While running the End-of-Day P&L Attribution Analyzer workflow you encounter ..."
description: "While running the End-of-Day P&L Attribution Analyzer workflow you encounter this condition: Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window. Handle it end to end."
source_id: "eod-pnl-attribution-analyzer-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the End-of-Day P&L Attribution Analyzer workflow you encounter this condition: Desk-level 99% 1-day VaR exceeds its approved limit, or backtesting records a second exception within the rolling 250-day window. Handle it end to end.

## Validates

- [flash-to-final-p-l-capture](/queries/flash-to-final-p-l-capture.md)

## Mechanisms to call

- [lookup_eod_pnl_attribution_analyzer_compliance_policy](/tools/lookup-eod-pnl-attribution-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [End-of-Day P&L Attribution Analyzer Banking Compliance Policy](/documents/eod-pnl-attribution-analyzer-compliance-policy.md)
