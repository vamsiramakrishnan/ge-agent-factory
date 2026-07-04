---
type: Proof Obligation
title: "Golden eval obligation — Run the Proactive Outage Notification Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-proactive-outage-notification-orchestrator-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Proactive Outage Notification Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [proactive-outage-notification-orchestrator-end-to-end](/tests/proactive-outage-notification-orchestrator-end-to-end.md)


## Mechanisms

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_proactive_outage_notification_orchestrator_assurance_runbook](/tools/lookup-proactive-outage-notification-orchestrator-assurance-runbook.md)
- [action_genesys_cloud_cx_publish](/tools/action-genesys-cloud-cx-publish.md)

## Entities that must be referenced

- customer_interactions
- analytics_events
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [proactive-outage-notification-orchestrator-assurance-runbook](/documents/proactive-outage-notification-orchestrator-assurance-runbook.md)
