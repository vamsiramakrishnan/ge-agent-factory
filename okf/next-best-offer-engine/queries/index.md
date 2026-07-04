---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull pos_transactions and tender_records from Oracle Xstore POS and join them with accounts and campaign_influence from Salesforce Marketing Cloud, landing a unified per-loyalty_id interaction history in BigQuery analytics_events.](/queries/member-signal-unification.md)
- [Score each loyalty_id's category propensity and price elasticity by comparing analytics_events against BigQuery historical_metrics and cached_aggregates baselines, weighting recent store_shift_summaries seasonality.](/queries/propensity-price-sensitivity-scoring.md)
- [Rank candidate offers per member per channel against the margin and budget guardrails in the Retail Execution Playbook and the Loyalty Offer Margin & Liability Rate Card, checking opportunities pipeline stage to avoid conflicting with an active Salesforce Marketing Cloud deal.](/queries/offer-selection-under-guardrails.md)
- [Assemble the decisioned send audience, execute action_oracle_xstore_pos_publish to commit the offer set to Oracle Xstore POS, and record the audit_record_id for every published loyalty_id.](/queries/audience-decisioning-publish.md)
- [Compare treatment-group redemption in analytics_events against the historical_metrics holdout cohort, retire offers that fail to beat holdout, and escalate budget, fraud-velocity, or stale-evidence exceptions to the CRM Manager per the Execution Playbook.](/queries/holdout-measurement-escalation.md)
