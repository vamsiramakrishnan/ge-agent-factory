---
type: Query Capability
title: Correlate the confirmed incidents record against Genesys Cloud CX customer_in...
description: "Correlate the confirmed incidents record against Genesys Cloud CX customer_interactions (intent='network_complaint') and queue_metrics (offered_contacts, abandon_rate_pct) by queue_name, cross-checked with agent_schedules coverage, to size the exact affected customer base and contact-center exposure."
source_id: "customer-queue-impact-mapping"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Correlate the confirmed incidents record against Genesys Cloud CX customer_interactions (intent='network_complaint') and queue_metrics (offered_contacts, abandon_rate_pct) by queue_name, cross-checked with agent_schedules coverage, to size the exact affected customer base and contact-center exposure.

## Tools used

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [action_genesys_cloud_cx_publish](/tools/action-genesys-cloud-cx-publish.md)

## Runs in

- [customer_queue_impact_mapping](/workflow/customer-queue-impact-mapping.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Proactive Outage Notification Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/proactive-outage-notification-orchestrator-end-to-end.md)
- [ServiceNow tickets record 48213 (category='network', priority='P1', status='resolved', sla_met=true, created_at=2026-07-01) says the Riverside fiber outage was already fixed. But Genesys Cloud CX customer_interactions volume for intent='network_complaint' is still running 3x above the BigQuery analytics_events baseline as of 2026-07-04, and account 55871204 logged an interaction that same day explicitly reporting the fiber service is still down. Decide whether a restoration notification should go out now, and cite the governing sections before recommending anything.](/tests/proactive-outage-notification-orchestrator-resolved-ticket-vs-live-signal-conflict.md)
- [ServiceNow tickets record 55011 (category='network', priority='P1', status='in_progress', created_at=2026-06-30) has already been the subject of two prior ETA notifications published through action_genesys_cloud_cx_publish. Genesys Cloud CX customer_interactions volume tied to this outage is still running 5x above the BigQuery analytics_events baseline as of 2026-07-04, four days after the ticket opened, and operations wants a third revised ETA published today. Decide whether to publish again or escalate, and show your evidence.](/tests/proactive-outage-notification-orchestrator-third-eta-revision-escalation.md)

# Citations

- [Proactive Outage Notification Orchestrator Service Assurance Runbook](/documents/proactive-outage-notification-orchestrator-assurance-runbook.md)
- [Network Outage Regulatory & Customer Notification Policy](/documents/proactive-outage-notification-orchestrator-regulatory-notification-policy.md)
