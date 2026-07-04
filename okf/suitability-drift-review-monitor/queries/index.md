---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the full client_households and financial_accounts population from Salesforce Financial Services Cloud for the monthly sweep, replacing the old quarterly sample so every household enters the drift review.](/queries/monthly-household-account-roster-pull.md)
- [Score each household's documented risk_tolerance and investment_objective against financial_accounts composition (registration_type, market_value, margin_enabled, discretionary_managed) using query_bigquery_analytics_events and historical_metrics baselines to quantify drift.](/queries/risk-tolerance-vs-portfolio-drift-scoring.md)
- [Run every flagged household through lookup_suitability_drift_review_monitor_compliance_policy to pull the governing Reg BI, concentration, and staleness sections before any finding is allowed to progress.](/queries/reg-bi-suitability-policy-citation-check.md)
- [Open or update ServiceNow tickets (category=policy) for material mismatches surfaced in client_households and advisory_referrals, attaching the cited policy sections and routing by severity.](/queries/service-now-review-case-triage-assignment.md)
- [Execute action_salesforce_financial_services_cloud_draft to prepare advisor re-profiling outreach for stale or contradicted client_households records, emitting a generated_audit_trail entry and notifying the Wealth Compliance Officer.](/queries/advisor-re-profiling-outreach-draft-audit-log.md)
