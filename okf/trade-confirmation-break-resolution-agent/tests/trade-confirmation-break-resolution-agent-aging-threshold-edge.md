---
type: Eval Scenario
title: "Trade 431987650 (fx_forward, CUSIP 178452963, notional $10,050,000 with Harbo..."
description: "Trade 431987650 (fx_forward, CUSIP 178452963, notional $10,050,000 with Harborview Municipal Trust) has sat pending_match for 31 days past its trade_date. Historical baselines in BigQuery for this counterparty show typical resolution inside 10 days. Decide whether to auto-escalate this or keep working it in the normal queue."
source_id: "trade-confirmation-break-resolution-agent-aging-threshold-edge"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Trade 431987650 (fx_forward, CUSIP 178452963, notional $10,050,000 with Harborview Municipal Trust) has sat pending_match for 31 days past its trade_date. Historical baselines in BigQuery for this counterparty show typical resolution inside 10 days. Decide whether to auto-escalate this or keep working it in the normal queue.

## Validates

- [confirmation-booking-intake](/queries/confirmation-booking-intake.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_trade_confirmation_break_resolution_agent_compliance_policy](/tools/lookup-trade-confirmation-break-resolution-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Trade Confirmation Break Resolution Agent Banking Compliance Policy](/documents/trade-confirmation-break-resolution-agent-compliance-policy.md)
- [Trade Confirmation Matching & Affirmation SLA Schedule](/documents/trade-confirmation-matching-sla-schedule.md)
