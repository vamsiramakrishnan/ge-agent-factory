---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the new subscriber_accounts, service_quotes, and order_captures records from Salesforce Communications Cloud and verify serviceability_confirmed and credit_check_status before any scoring begins.](/queries/lead-intake-serviceability-check.md)
- [Score the lead on service_type, rate_plan and product_bundle fit, tenure_months, and churn_risk_score signals, reconciling against any existing subscriber_accounts footprint for the same subscriber_key.](/queries/firmographic-usage-intent-scoring.md)
- [Compare the lead's response-time and conversion signals against BigQuery analytics_events and historical_metrics, and pull Looker dashboards to confirm the lead qualifies against current-quarter MQL-to-SQL baselines.](/queries/historical-benchmark-conversion-analytics.md)
- [Cite the Lead Qualification Scoring Engine Service Assurance Runbook and the Rate Card & Discount Delegation-of-Authority Matrix to validate discount_pct, contract_term, and credit_check_status before any quote or route action is authorized.](/queries/policy-discount-gate.md)
- [Execute action_salesforce_communications_cloud_route to assign the hot lead to the correct territory rep in Salesforce Communications Cloud, attach the suggested opening talk track, and log the audit trail.](/queries/territory-routing-talk-track-handoff.md)
