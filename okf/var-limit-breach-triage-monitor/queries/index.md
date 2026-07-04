---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Poll Murex MX.3 risk_measures for limit_breach_flag and limit_utilization_pct crossings as each risk run lands, keyed by desk and measure_type (var_99_1day, stressed_var, dv01, cs01).](/queries/risk-run-breach-detection.md)
- [Pull Murex MX.3 trades and positions for the breaching desk to isolate the specific trade_id, cusip, and book_designation entries driving the excess notional_amount and market_value.](/queries/trade-position-decomposition.md)
- [Compare measure_value against BigQuery historical_metrics and analytics_events, and check backtest_exceptions_250d to determine whether the breach is a one-off market move or a clustering pattern.](/queries/baseline-backtest-comparison.md)
- [Score breach severity against the VaR Limit Breach Triage Monitor Banking Compliance Policy and the VaR and Sensitivity Limit Framework & Delegation of Authority thresholds, citing the governing sections before any recommendation is issued.](/queries/policy-gated-severity-scoring.md)
- [Draft the breach notification memo with root-cause narrative and open a ServiceNow ticket for desk-head acknowledgment, tracking sla_met against the same-business-day notification requirement.](/queries/memo-drafting-acknowledgment-routing.md)
- [Call action_murex_mx_3_escalate to push unresolved excesses up the delegation chain to market_risk_committee, alco_chair, or counterparty_credit_risk_officer as triggers dictate, recording the audit_record_id in Murex MX.3.](/queries/escalation-audit-trail.md)
