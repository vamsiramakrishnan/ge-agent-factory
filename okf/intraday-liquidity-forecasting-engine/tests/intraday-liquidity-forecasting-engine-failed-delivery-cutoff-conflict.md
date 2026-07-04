---
type: Eval Scenario
title: "Trade 431029384 (cusip 500219948, notional_amount $95,000,000.00, a EUR-settl..."
description: "Trade 431029384 (cusip 500219948, notional_amount $95,000,000.00, a EUR-settling fx_forward) is sitting at settlement_status 'failed_delivery' in trades as of trade_date 2026-07-03, and it clears through the Frankfurt correspondent in the next 90 minutes. BigQuery analytics_events still shows this cohort's variance_pct at 2.1% (business as usual) with computed_at 2026-07-02 — before the failure posted — and Looker's dashboards still display yesterday's published funding plan as current. Build the next currency cash position update and tell me whether we need emergency funding before the Frankfurt cutoff."
source_id: "intraday-liquidity-forecasting-engine-failed-delivery-cutoff-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Trade 431029384 (cusip 500219948, notional_amount $95,000,000.00, a EUR-settling fx_forward) is sitting at settlement_status 'failed_delivery' in trades as of trade_date 2026-07-03, and it clears through the Frankfurt correspondent in the next 90 minutes. BigQuery analytics_events still shows this cohort's variance_pct at 2.1% (business as usual) with computed_at 2026-07-02 — before the failure posted — and Looker's dashboards still display yesterday's published funding plan as current. Build the next currency cash position update and tell me whether we need emergency funding before the Frankfurt cutoff.

## Validates

- [settlement-ladder-position-build](/queries/settlement-ladder-position-build.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_intraday_liquidity_forecasting_engine_compliance_policy](/tools/lookup-intraday-liquidity-forecasting-engine-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Intraday Liquidity Forecasting Engine Banking Compliance Policy](/documents/intraday-liquidity-forecasting-engine-compliance-policy.md)
- [Nostro Correspondent Cutoff Times & Contingency Funding Plan](/documents/nostro-cutoff-contingency-funding-plan.md)
