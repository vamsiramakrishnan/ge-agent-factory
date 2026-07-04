---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull loan_applications, credit_memos, and covenant_records from nCino Loan Origination and roll up committed and outstanding exposure by industry, geography, and single-obligor group using query_ncino_loan_origination_loan_applications.](/queries/exposure-aggregation.md)
- [Compare aggregated exposure against board concentration limits and historical_metrics/analytics_events baselines in BigQuery via query_bigquery_analytics_events to detect sector, geography, and single-name limit breaches.](/queries/concentration-limit-testing.md)
- [Simulate the incremental concentration impact of pending loan_applications in decision_status submitted, underwriting, or conditional_approval before booking, and flag underwriters when a pending deal would breach a limit.](/queries/pipeline-deal-simulation.md)
- [Cross-reference covenant_records compliance_status and credit_memos policy_exception_count against the Credit Portfolio Concentration Monitor Banking Compliance Policy and the Single-Obligor Aggregation Work Instruction via lookup_credit_portfolio_concentration_monitor_compliance_policy to catch stacked exceptions or uncured breaches feeding concentration risk.](/queries/covenant-exception-cross-check.md)
- [Route limit breaches and covenant exceptions to the credit_committee_secretary, senior_credit_officer, or special_assets_group per escalation rules, publish the concentration dashboard to Looker, and execute action_ncino_loan_origination_publish with a full audit trail.](/queries/escalation-board-reporting.md)
