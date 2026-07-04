---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull trades, positions, and risk_measures from Murex MX.3 and roll them up by counterparty and netting set into an intraday potential future exposure (PFE) and collateral-coverage view.](/queries/exposure-collateral-aggregation.md)
- [Compare BigQuery analytics_events (CDS spread moves, ratings actions) against historical_metrics baselines to flag counterparties whose credit profile is deteriorating faster than their exposure is being reduced.](/queries/market-signal-wrong-way-risk-screening.md)
- [Reconcile open margin-call valuation breaks using Looker explore_queries and dashboards against Murex MX.3 positions, and draft a dispute summary with both sides' valuations for the collateral team.](/queries/margin-call-dispute-reconciliation.md)
- [Cross-check desk-level VaR, limit_utilization_pct, and backtest_exceptions_250d in risk_measures, plus CSA and LCR thresholds, against the Counterparty Credit Exposure Monitor Banking Compliance Policy before any recommendation is finalized.](/queries/limit-threshold-validation.md)
- [Execute action_murex_mx_3_file to record the resolution or limit action in Murex MX.3 with a full audit trail, or route the case to the Counterparty Risk Manager, market risk committee, ALCO chair, or counterparty credit risk officer per the escalation rules.](/queries/file-escalate.md)
