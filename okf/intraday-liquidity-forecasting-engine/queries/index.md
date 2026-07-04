---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull today's trades and positions from Murex MX.3 (query_murex_mx_3_trades, query_murex_mx_3_positions) and lay trade_date, settlement_status, and notional_amount out into a per-currency intraday settlement ladder alongside book_designation and market_value from positions.](/queries/settlement-ladder-position-build.md)
- [Compare today's settlement ladder against BigQuery historical_metrics, cached_aggregates, and analytics_events (query_bigquery_historical_metrics, query_bigquery_cached_aggregates, query_bigquery_analytics_events) to separate a genuine cash-out spike from routine seasonal variance before sizing the funding gap.](/queries/historical-payment-pattern-reconciliation.md)
- [Cross-check the emerging forecast against Murex MX.3 risk_measures (query_murex_mx_3_risk_measures) — limit_utilization_pct, lcr_ratio, and nsfr_ratio readings — to confirm the recommended money-market action does not itself push a desk over its approved_limit_value or the LCR floor.](/queries/risk-limit-liquidity-buffer-cross-check.md)
- [Cite the Intraday Liquidity Forecasting Engine Banking Compliance Policy and the Nostro Correspondent Cutoff Times & Contingency Funding Plan (lookup_intraday_liquidity_forecasting_engine_compliance_policy) for SR 11-7 model-validation status, escalation gates, and correspondent cutoff timing before any recommendation is issued.](/queries/compliance-model-governance-validation.md)
- [Publish the hourly funding plan through action_murex_mx_3_publish with ranked money-market actions and costs per currency, refresh Looker dashboards and metric_definitions (query_looker_dashboards, query_looker_metric_definitions) for the Treasury Manager's queue, and escalate any projected shortfall ahead of the relevant currency's correspondent cutoff.](/queries/funding-plan-publish-cutoff-escalation.md)
