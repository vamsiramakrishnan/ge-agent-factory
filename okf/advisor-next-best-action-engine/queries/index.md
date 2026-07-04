---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Poll BigQuery analytics_events and historical_metrics for large cash deposits, maturing CDs, and rollover-eligible 401k balances that outpace the household's cached_aggregates baseline.](/queries/money-in-motion-signal-scan.md)
- [Pull the matched client_households and financial_accounts records from Salesforce Financial Services Cloud to establish total_aum, risk_tolerance, registration_type, and cash_balance context for the signal.](/queries/household-account-context-pull.md)
- [Cross-check the open advisory_referrals suitability_status, product_interest, and estimated_investable_assets against financial_accounts.market_value and household total_aum to catch single-issuer or alternative-investment concentration ahead of any recommendation.](/queries/suitability-concentration-screen.md)
- [Rank households by attrition risk and opportunity size using BigQuery analytics_events and historical_metrics variance_pct, prioritizing the Relationship Manager's queue toward the top-decile clients.](/queries/next-best-action-scoring.md)
- [Call lookup_advisor_next_best_action_engine_compliance_policy against the Advisor Next Best Action Engine Banking Compliance Policy and the Reg BI Rollover Suitability & Concentration Playbook before any talking point is finalized.](/queries/evidence-policy-citation-gate.md)
- [Execute action_salesforce_financial_services_cloud_recommend to create the prioritized Salesforce Financial Services Cloud task, log the audit_record_id, and route BANKING 3 exception records to the Relationship Manager or supervision_principal when an escalation gate fires.](/queries/task-creation-escalation-audit.md)
