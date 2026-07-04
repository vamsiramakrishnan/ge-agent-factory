---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the live record from Genesys Cloud CX customer_interactions (cpni_authenticated, account_number, channel, intent) via query_genesys_cloud_cx_customer_interactions and assemble the unified billing/device/order context before the Care Team Lead's agent says hello.](/queries/contact-authentication-context-assembly.md)
- [Compare current queue_metrics (fcr, aht_seconds, abandon_rate_pct, csat_score) against BigQuery analytics_events and historical_metrics via query_bigquery_analytics_events to flag queues trending below the 81% first-call-resolution target.](/queries/queue-baseline-health-check.md)
- [Cross-reference Zendesk tickets, macros, and satisfaction_scores for the same account_number via query_zendesk_tickets to detect open P1/P2 tickets, low satisfaction_scores, and repeat-contact spirals before suggesting a next-best troubleshooting step.](/queries/repeat-contact-known-issue-correlation.md)
- [Cite the Care Call Resolution Copilot Agent Service Assurance Runbook and the CPNI Verification & Retention Offer Authorization Policy via lookup_care_call_resolution_copilot_agent_assurance_runbook before any recommendation, and check proposed retention offers against the $40/month recurring and $200 device-credit governance caps.](/queries/governing-document-offer-cap-gate.md)
- [Execute action_genesys_cloud_cx_draft to log the structured wrap-up note, disposition code, and audit_record_id in Genesys Cloud CX, or route the case to retention_supervisor, resolution_desk, or executive_relations per the escalation rules.](/queries/disposition-draft-escalation-routing.md)
