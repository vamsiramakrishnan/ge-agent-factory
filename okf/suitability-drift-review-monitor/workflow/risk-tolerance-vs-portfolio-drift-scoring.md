---
type: Workflow Stage
title: "Risk-Tolerance vs. Portfolio Drift Scoring"
description: "Score each household's documented risk_tolerance and investment_objective against financial_accounts composition (registration_type, market_value, margin_enabled, discretionary_managed) using query_bigquery_analytics_events and historical_metrics baselines to quantify drift."
source_id: risk_tolerance_vs_portfolio_drift_scoring
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Risk-Tolerance vs. Portfolio Drift Scoring

Score each household's documented risk_tolerance and investment_objective against financial_accounts composition (registration_type, market_value, margin_enabled, discretionary_managed) using query_bigquery_analytics_events and historical_metrics baselines to quantify drift.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_salesforce_financial_services_cloud_client_households](/tools/query-salesforce-financial-services-cloud-client-households.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_suitability_drift_review_monitor_compliance_policy](/tools/lookup-suitability-drift-review-monitor-compliance-policy.md)
- [action_salesforce_financial_services_cloud_draft](/tools/action-salesforce-financial-services-cloud-draft.md)

Next: [Reg BI / Suitability Policy Citation Check](/workflow/reg-bi-suitability-policy-citation-check.md)
