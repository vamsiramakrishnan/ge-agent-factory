---
type: Eval Scenario
title: Run the NPS Detractor Recovery Agent workflow for the current period. Cite th...
description: "Run the NPS Detractor Recovery Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "nps-detractor-recovery-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the NPS Detractor Recovery Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [detractor-verbatim-triage](/queries/detractor-verbatim-triage.md)

## Mechanisms to call

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_nps_detractor_recovery_agent_assurance_runbook](/tools/lookup-nps-detractor-recovery-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_escalate](/tools/action-genesys-cloud-cx-escalate.md)

## Success rubric

Action escalate executed against Genesys Cloud CX, with audit-trail entry and Customer Experience Manager notified of outcomes.

# Citations

- [NPS Detractor Recovery Agent Service Assurance Runbook](/documents/nps-detractor-recovery-agent-assurance-runbook.md)
