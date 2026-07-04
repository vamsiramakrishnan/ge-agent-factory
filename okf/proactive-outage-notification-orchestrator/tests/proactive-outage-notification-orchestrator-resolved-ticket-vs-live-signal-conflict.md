---
type: Eval Scenario
title: "ServiceNow tickets record 48213 (category='network', priority='P1', status='r..."
description: "ServiceNow tickets record 48213 (category='network', priority='P1', status='resolved', sla_met=true, created_at=2026-07-01) says the Riverside fiber outage was already fixed. But Genesys Cloud CX customer_interactions volume for intent='network_complaint' is still running 3x above the BigQuery analytics_events baseline as of 2026-07-04, and account 55871204 logged an interaction that same day explicitly reporting the fiber service is still down. Decide whether a restoration notification should go out now, and cite the governing sections before recommending anything."
source_id: "proactive-outage-notification-orchestrator-resolved-ticket-vs-live-signal-conflict"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ServiceNow tickets record 48213 (category='network', priority='P1', status='resolved', sla_met=true, created_at=2026-07-01) says the Riverside fiber outage was already fixed. But Genesys Cloud CX customer_interactions volume for intent='network_complaint' is still running 3x above the BigQuery analytics_events baseline as of 2026-07-04, and account 55871204 logged an interaction that same day explicitly reporting the fiber service is still down. Decide whether a restoration notification should go out now, and cite the governing sections before recommending anything.

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
