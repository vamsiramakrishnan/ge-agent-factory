---
type: Eval Scenario
title: Run the Proactive Outage Notification Orchestrator workflow for the current p...
description: "Run the Proactive Outage Notification Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "proactive-outage-notification-orchestrator-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Proactive Outage Notification Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_proactive_outage_notification_orchestrator_assurance_runbook](/tools/lookup-proactive-outage-notification-orchestrator-assurance-runbook.md)
- [action_genesys_cloud_cx_publish](/tools/action-genesys-cloud-cx-publish.md)

## Success rubric

Action publish executed against Genesys Cloud CX, with audit-trail entry and Customer Experience Manager notified of outcomes.

# Citations

- [Proactive Outage Notification Orchestrator Service Assurance Runbook](/documents/proactive-outage-notification-orchestrator-assurance-runbook.md)
