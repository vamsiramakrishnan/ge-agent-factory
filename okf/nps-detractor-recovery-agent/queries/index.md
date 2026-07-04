---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the new satisfaction_scores response and its linked tickets from Zendesk, then match the verbatim against the account's customer_interactions record in Genesys Cloud CX to confirm the interaction that drove the score.](/queries/detractor-verbatim-triage.md)
- [Correlate queue_metrics and agent_schedules from Genesys Cloud CX with analytics_events and historical_metrics baselines in BigQuery to determine whether the account was let down by an isolated agent interaction or a systemic queue-level gap.](/queries/service-history-correlation.md)
- [Validate the proposed remedy and any discount or credit against the NPS Detractor Recovery Agent Service Assurance Runbook and the Retention Save-Offer Authorization Matrix before it can be offered.](/queries/remedy-offer-governance-check.md)
- [Draft the personalized recovery outreach using Zendesk macros, attach the concrete remedy, and assign the case owner in Genesys Cloud CX with a response-time SLA.](/queries/recovery-outreach-drafting-routing.md)
- [Track the tickets case to closure and invoke action_genesys_cloud_cx_escalate to route accounts showing churn-risk signals to the retention team with the full evidence and audit trail.](/queries/case-closure-churn-risk-escalation.md)
