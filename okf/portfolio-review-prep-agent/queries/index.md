---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Scan client_households.last_annual_review_date in Salesforce Financial Services Cloud against the 12-month Reg BI review cadence to build the advisor's weekly queue of households coming due for their annual review.](/queries/book-due-date-household-triage.md)
- [Pull financial_accounts (market_value, cash_balance, registration_type) and advisory_referrals for each queued household_id from Salesforce Financial Services Cloud via query_salesforce_financial_services_cloud_financial_accounts and query_salesforce_financial_services_cloud_advisory_referrals.](/queries/account-holdings-retrieval.md)
- [Join BigQuery analytics_events against historical_metrics and cached_aggregates to compute performance-versus-benchmark, allocation drift, fee summary, and cash-flow variance_pct for each account.](/queries/performance-drift-fee-analysis.md)
- [Cross-check risk_tolerance, investment_objective, and advisory_referrals.suitability_status against the Portfolio Review Preparation Agent Banking Compliance Policy and the Annual Review Cadence & Concentration Limits Playbook before any rebalancing or tax-loss-harvesting topic is drafted.](/queries/suitability-concentration-compliance-check.md)
- [Render the Looker dashboards and metric_definitions into a personalized agenda, then execute action_salesforce_financial_services_cloud_recommend with an audit trail and notify the Financial Advisor of due reviews and flagged exceptions.](/queries/agenda-assembly-advisor-handoff.md)
