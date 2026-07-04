---
type: Eval Scenario
title: "For the treasury_alm desk, risk_measures record measure_id 512045 shows limit..."
description: "For the treasury_alm desk, risk_measures record measure_id 512045 shows limit_utilization_pct at 103.5% against approved_limit_value, but its as_of_date is 2026-07-02 — two days stale relative to today's run (2026-07-04). Positions record position_id 3041220 (cusip 934567AB1) shows a $6.2M unrealized_gain_loss swing since that snapshot. Attribute the move and publish today's sign-off."
source_id: "eod-pnl-attribution-analyzer-stale-evidence-treasury-alm"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For the treasury_alm desk, risk_measures record measure_id 512045 shows limit_utilization_pct at 103.5% against approved_limit_value, but its as_of_date is 2026-07-02 — two days stale relative to today's run (2026-07-04). Positions record position_id 3041220 (cusip 934567AB1) shows a $6.2M unrealized_gain_loss swing since that snapshot. Attribute the move and publish today's sign-off.

## Validates

- [flash-to-final-p-l-capture](/queries/flash-to-final-p-l-capture.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_eod_pnl_attribution_analyzer_compliance_policy](/tools/lookup-eod-pnl-attribution-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [End-of-Day P&L Attribution Analyzer Banking Compliance Policy](/documents/eod-pnl-attribution-analyzer-compliance-policy.md)
- [Daily P&L Substantiation and Break Escalation Runbook](/documents/eod-pnl-attribution-analyzer-substantiation-runbook.md)
