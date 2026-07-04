---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Match the incoming return claim to its online_orders and product_catalog_entries records in Salesforce Commerce Cloud, and pull the originating cart_events session to establish add-to-cart-to-return timing.](/queries/claim-intake-order-match.md)
- [Join Zendesk tickets, macros, and satisfaction_scores against the customer's return history to build the per-customer cross-channel behavior graph spanning web orders, store returns, and care tickets.](/queries/cross-channel-behavior-graph.md)
- [Score the claim against BigQuery analytics_events, historical_metrics, and cached_aggregates baselines to detect wardrobing/bracketing velocity and prioritize the Fraud Analyst's queue.](/queries/baseline-deviation-risk-scoring.md)
- [Cross-check the score against the Returns Abuse Analyzer Retail Execution Playbook and the Return Policy Disclosure & Chargeback Rights Compliance Bulletin, citing governing sections before recommending a tier action (receipt check, store-credit-only, or account flag).](/queries/evidence-gated-tiering.md)
- [Execute action_salesforce_commerce_cloud_file to record the disposition on the account with a full audit trail, and escalate exceptions to the Fraud Analyst per the escalation rules.](/queries/disposition-file-audit.md)
