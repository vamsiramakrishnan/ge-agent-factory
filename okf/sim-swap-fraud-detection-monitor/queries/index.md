---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the triggering swap from Amdocs CES Billing billing_accounts and usage_records, then correlate the subscriber_key against Splunk log_events and search_jobs to reconstruct the authentication trail (credential resets, channel used, prior failed attempts) around the swap timestamp.](/queries/sim-swap-event-intake-correlation.md)
- [Compare the swap and surrounding usage_records against BigQuery analytics_events and historical_metrics dormancy, recency, and channel-anomaly baselines in cached_aggregates to produce a risk score for the Fraud Operations Analyst queue.](/queries/behavioral-baseline-risk-scoring.md)
- [For swaps clearing the risk threshold, place a step-up-verification hold on the billing_accounts record and a temporary block on premium and international routing referenced in rated_events, pending independent subscriber verification.](/queries/step-up-hold-routing-block.md)
- [Cross-check the swap, the log_events/search_jobs authentication trail, and the alert_actions priority against the SIM Swap Fraud Detection Monitor Service Assurance Runbook via lookup_sim_swap_fraud_detection_monitor_assurance_runbook, citing the governing sections before any hold, block, or escalation is finalized.](/queries/runbook-gated-evidence-validation.md)
- [Execute action_amdocs_ces_billing_escalate to hand confirmed fraud patterns to the Fraud Operations Analyst with a complete alert_actions timeline and audit trail, and notify the affected customer through a verified channel outside the compromised one.](/queries/fraud-escalation-customer-notification.md)
