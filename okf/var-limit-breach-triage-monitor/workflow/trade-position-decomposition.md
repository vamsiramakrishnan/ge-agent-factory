---
type: Workflow Stage
title: "Trade & Position Decomposition"
description: "Pull Murex MX.3 trades and positions for the breaching desk to isolate the specific trade_id, cusip, and book_designation entries driving the excess notional_amount and market_value."
source_id: trade_position_decomposition
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Trade & Position Decomposition

Pull Murex MX.3 trades and positions for the breaching desk to isolate the specific trade_id, cusip, and book_designation entries driving the excess notional_amount and market_value.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_var_limit_breach_triage_monitor_compliance_policy](/tools/lookup-var-limit-breach-triage-monitor-compliance-policy.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

Next: [Baseline & Backtest Comparison](/workflow/baseline-backtest-comparison.md)
