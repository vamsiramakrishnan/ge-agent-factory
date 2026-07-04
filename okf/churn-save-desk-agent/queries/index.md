---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Authenticate the caller against customer_interactions.cpni_authenticated in Genesys Cloud CX via query_genesys_cloud_cx_customer_interactions before any account detail, churn driver, or offer is discussed on the connected call.](/queries/cpni-authentication-call-intercept.md)
- [Cross-reference the account's queue_metrics and agent_schedules signals from Genesys Cloud CX against analytics_events and historical_metrics in BigQuery (query_bigquery_analytics_events) and the Looker dashboards (query_looker_dashboards) to separate a coverage-driven churn driver from a price-driven one and size the customer's lifetime value.](/queries/churn-driver-clv-triangulation.md)
- [Rank plan right-sizing, device-credit, and service-fix offers by predicted acceptance, checking each against the Retention Offer Rate Card and the Churn Save Desk Agent Service Assurance Runbook via lookup_churn_save_desk_agent_assurance_runbook, and gate any offer against the $40/month discount or $200 device-credit governance cap.](/queries/save-offer-ranking-against-rate-card-governance-cap.md)
- [Execute action_genesys_cloud_cx_approve in Genesys Cloud CX for in-guardrail offers, writing an audit_record_id and action_id, and escalate any offer above cap or backed by single-system evidence to the Retention Marketing Manager or retention_supervisor.](/queries/offer-approval-audit-trail.md)
- [Book a follow-up explore_queries task in Looker to verify the promised device, plan, or service fix actually landed before the account's next contact, closing the loop on the save.](/queries/fix-verification-follow-up.md)
