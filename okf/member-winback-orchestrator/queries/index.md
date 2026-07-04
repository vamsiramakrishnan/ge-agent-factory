---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query pos_transactions from Oracle Xstore POS for loyalty_id recency gaps past the 90-day lapse threshold, then cross-reference Segment segment_records and segment_events for store-proximity and browse signals (query_segment_segment_records) to infer whether each lapse looks like moved, channel-switched, or price-churned.](/queries/lapse-detection-reason-inference.md)
- [Score each lapsed loyalty_id's predicted reactivation value against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) and test offer depth per inferred lapse reason to converge on the minimal viable incentive.](/queries/reactivation-value-offer-depth-scoring.md)
- [Validate the proposed lapse reason, offer depth, and eligibility window against the Lapsed Member Win-Back Orchestrator Retail Execution Playbook and the Loyalty Program Terms doc (lookup_member_winback_orchestrator_execution_playbook), checking Salesforce Marketing Cloud accounts for do-not-contact, cool-down, and points-expiration flags.](/queries/playbook-loyalty-terms-guardrail-gating.md)
- [Draft and route the gated win-back journey through Salesforce Marketing Cloud accounts, opportunities, and campaign_influence records (query_salesforce_marketing_cloud_accounts) so send timing and creative match the scored segment.](/queries/marketing-cloud-journey-dispatch.md)
- [Execute action_oracle_xstore_pos_generate to launch the post-reactivation nurture sequence with a full audit trail, confirm the return visit against fresh pos_transactions/tender_records, and escalate exceptions to the Retention Marketing Manager.](/queries/reactivation-confirmation-nurture-audit.md)
