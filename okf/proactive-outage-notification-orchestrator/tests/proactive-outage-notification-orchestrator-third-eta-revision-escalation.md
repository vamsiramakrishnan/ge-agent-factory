---
type: Eval Scenario
title: "ServiceNow tickets record 55011 (category='network', priority='P1', status='i..."
description: "ServiceNow tickets record 55011 (category='network', priority='P1', status='in_progress', created_at=2026-06-30) has already been the subject of two prior ETA notifications published through action_genesys_cloud_cx_publish. Genesys Cloud CX customer_interactions volume tied to this outage is still running 5x above the BigQuery analytics_events baseline as of 2026-07-04, four days after the ticket opened, and operations wants a third revised ETA published today. Decide whether to publish again or escalate, and show your evidence."
source_id: "proactive-outage-notification-orchestrator-third-eta-revision-escalation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ServiceNow tickets record 55011 (category='network', priority='P1', status='in_progress', created_at=2026-06-30) has already been the subject of two prior ETA notifications published through action_genesys_cloud_cx_publish. Genesys Cloud CX customer_interactions volume tied to this outage is still running 5x above the BigQuery analytics_events baseline as of 2026-07-04, four days after the ticket opened, and operations wants a third revised ETA published today. Decide whether to publish again or escalate, and show your evidence.

## Validates

- [incident-confirmation-scope-binding](/queries/incident-confirmation-scope-binding.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_proactive_outage_notification_orchestrator_assurance_runbook](/tools/lookup-proactive-outage-notification-orchestrator-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Proactive Outage Notification Orchestrator Service Assurance Runbook](/documents/proactive-outage-notification-orchestrator-assurance-runbook.md)
- [Network Outage Regulatory & Customer Notification Policy](/documents/proactive-outage-notification-orchestrator-regulatory-notification-policy.md)
