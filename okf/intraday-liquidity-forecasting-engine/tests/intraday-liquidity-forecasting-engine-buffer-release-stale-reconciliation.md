---
type: Eval Scenario
title: "Treasury wants to release $60,000,000.00 from the excess liquidity buffer tod..."
description: "Treasury wants to release $60,000,000.00 from the excess liquidity buffer today to fund a money-market placement, arguing the Excess liquidity buffer held KPI target of $550M gives headroom. trades shows $2.3B of buy-side ust_note settlements still at settlement_status 'pending_match' for 2026-07-04, and the BigQuery analytics_events cohort linked to today's settlement volume reports variance_pct of 34% against its historical baseline, computed_at 2026-07-03 (over 24 hours stale relative to right now). Evaluate whether to approve the $60M release and publish the funding plan."
source_id: "intraday-liquidity-forecasting-engine-buffer-release-stale-reconciliation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Treasury wants to release $60,000,000.00 from the excess liquidity buffer today to fund a money-market placement, arguing the Excess liquidity buffer held KPI target of $550M gives headroom. trades shows $2.3B of buy-side ust_note settlements still at settlement_status 'pending_match' for 2026-07-04, and the BigQuery analytics_events cohort linked to today's settlement volume reports variance_pct of 34% against its historical baseline, computed_at 2026-07-03 (over 24 hours stale relative to right now). Evaluate whether to approve the $60M release and publish the funding plan.

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
