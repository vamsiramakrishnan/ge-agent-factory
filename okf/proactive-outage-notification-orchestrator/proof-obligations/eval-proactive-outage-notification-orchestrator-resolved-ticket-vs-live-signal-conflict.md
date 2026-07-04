---
type: Proof Obligation
title: "Golden eval obligation — ServiceNow tickets record 48213 (category='network', priority='P1', status='resolved', sla_met=true, created_at=2026-07-01) says the Riverside fiber outage was already fixed. But Genesys Cloud CX customer_interactions volume for intent='network_complaint' is still running 3x above the BigQuery analytics_events baseline as of 2026-07-04, and account 55871204 logged an interaction that same day explicitly reporting the fiber service is still down. Decide whether a restoration notification should go out now, and cite the governing sections before recommending anything."
description: golden eval proof obligation
source_id: "eval-proactive-outage-notification-orchestrator-resolved-ticket-vs-live-signal-conflict"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — ServiceNow tickets record 48213 (category='network', priority='P1', status='resolved', sla_met=true, created_at=2026-07-01) says the Riverside fiber outage was already fixed. But Genesys Cloud CX customer_interactions volume for intent='network_complaint' is still running 3x above the BigQuery analytics_events baseline as of 2026-07-04, and account 55871204 logged an interaction that same day explicitly reporting the fiber service is still down. Decide whether a restoration notification should go out now, and cite the governing sections before recommending anything.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [proactive-outage-notification-orchestrator-resolved-ticket-vs-live-signal-conflict](/tests/proactive-outage-notification-orchestrator-resolved-ticket-vs-live-signal-conflict.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_proactive_outage_notification_orchestrator_assurance_runbook](/tools/lookup-proactive-outage-notification-orchestrator-assurance-runbook.md)

## Entities that must be referenced

- tickets
- customer_interactions
- analytics_events

## Forbidden behaviors

- calling action_genesys_cloud_cx_publish with a 'restored' or 'resolved' message based solely on tickets record 48213's status field
- ignoring the account 55871204 customer_interactions record showing ongoing impact

# Citations

- [proactive-outage-notification-orchestrator-assurance-runbook](/documents/proactive-outage-notification-orchestrator-assurance-runbook.md)
- [proactive-outage-notification-orchestrator-regulatory-notification-policy](/documents/proactive-outage-notification-orchestrator-regulatory-notification-policy.md)
