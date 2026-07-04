---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Join NICE Actimize fraud_alerts alert_status and transaction_risk_scores against confirmed-fraud dispositions using query_nice_actimize_fraud_alerts to establish the ground truth for each rule cohort.](/queries/alert-to-outcome-reconciliation.md)
- [Score each rule's precision, recall, and amount_at_risk coverage by comparing fraud_alerts outcomes against BigQuery analytics_events and historical_metrics baselines via query_bigquery_analytics_events.](/queries/rule-precision-recall-dollar-coverage-scoring.md)
- [Simulate threshold shifts against transaction_risk_scores score_band, velocity_rule_triggered, and mule_account_indicator flags to project alert-volume and detection-rate impact, flagging decayed rules as retirement candidates.](/queries/threshold-simulation-retirement-screening.md)
- [Cite the Fraud Rule Tuning Analyzer Banking Compliance Policy and the Fraud Detection Model Risk & Backtesting Standard via lookup_fraud_rule_tuning_analyzer_compliance_policy, and pull Looker dashboards via query_looker_dashboards to visualize backtest trends for the governance packet.](/queries/governance-evidence-packaging.md)
- [Draft the rule-change proposal with backtest evidence, then execute approved threshold and retirement changes in NICE Actimize via action_nice_actimize_recommend with a full audit trail, escalating exceptions to the Fraud Strategy Manager.](/queries/rule-change-proposal-actimize-deployment.md)
