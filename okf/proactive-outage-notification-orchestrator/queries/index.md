---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the triggering record from ServiceNow incidents (priority, category, status, created_at) and check for an overlapping ServiceNow change_requests maintenance window on the same category/timeframe, so a scheduled change is never mistaken for an unplanned outage before any customer-facing step runs.](/queries/incident-confirmation-scope-binding.md)
- [Correlate the confirmed incidents record against Genesys Cloud CX customer_interactions (intent='network_complaint') and queue_metrics (offered_contacts, abandon_rate_pct) by queue_name, cross-checked with agent_schedules coverage, to size the exact affected customer base and contact-center exposure.](/queries/customer-queue-impact-mapping.md)
- [Score the mapped impact against BigQuery historical_metrics baselines and cached_aggregates/analytics_events variance to set the notification tier (channel, cadence, and ETA confidence), gating every tier decision against the Proactive Outage Notification Orchestrator Service Assurance Runbook.](/queries/severity-notification-tier-scoring.md)
- [Draft the customer-facing cause, ETA, and restoration-progress narrative for the bound incidents record, citing the assurance runbook's customer-communication section via lookup_proactive_outage_notification_orchestrator_assurance_runbook and the Network Outage Regulatory & Customer Notification Policy's notification-sla and messaging-consistency anchors before release.](/queries/cause-eta-narrative-drafting-policy-citation.md)
- [Execute action_genesys_cloud_cx_publish to push the one consistent message to customer notifications, IVR, and agent desktops with a generated_audit_trail, then re-query customer_interactions and queue_metrics after the incidents record closes to confirm restoration with impacted customers.](/queries/publish-channel-sync-restoration-confirmation.md)
