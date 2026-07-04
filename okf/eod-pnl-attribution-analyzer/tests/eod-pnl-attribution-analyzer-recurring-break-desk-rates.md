---
type: Eval Scenario
title: "Desk 'rates' is showing an unexplained P&L break against trade_id 412873650 (..."
description: "Desk 'rates' is showing an unexplained P&L break against trade_id 412873650 (cusip 912828XG4) for the third straight business day (2026-07-01 through 2026-07-03), and the corresponding analytics_events variance_pct hasn't moved across those runs. Investigate whether this is a genuine market move or a booking-model issue, and tell me whether we can sign off by 10am today (2026-07-04)."
source_id: "eod-pnl-attribution-analyzer-recurring-break-desk-rates"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Desk 'rates' is showing an unexplained P&L break against trade_id 412873650 (cusip 912828XG4) for the third straight business day (2026-07-01 through 2026-07-03), and the corresponding analytics_events variance_pct hasn't moved across those runs. Investigate whether this is a genuine market move or a booking-model issue, and tell me whether we can sign off by 10am today (2026-07-04).

## Validates

- [flash-to-final-p-l-capture](/queries/flash-to-final-p-l-capture.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_eod_pnl_attribution_analyzer_compliance_policy](/tools/lookup-eod-pnl-attribution-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [End-of-Day P&L Attribution Analyzer Banking Compliance Policy](/documents/eod-pnl-attribution-analyzer-compliance-policy.md)
- [Daily P&L Substantiation and Break Escalation Runbook](/documents/eod-pnl-attribution-analyzer-substantiation-runbook.md)
