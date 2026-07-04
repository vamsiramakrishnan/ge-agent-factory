---
type: Eval Scenario
title: Run the Care Call Resolution Copilot Agent workflow for the current period. C...
description: "Run the Care Call Resolution Copilot Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "care-call-resolution-copilot-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Care Call Resolution Copilot Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_care_call_resolution_copilot_agent_assurance_runbook](/tools/lookup-care-call-resolution-copilot-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_draft](/tools/action-genesys-cloud-cx-draft.md)

## Success rubric

Action draft executed against Genesys Cloud CX, with audit-trail entry and Care Team Lead notified of outcomes.

# Citations

- [Care Call Resolution Copilot Agent Service Assurance Runbook](/documents/care-call-resolution-copilot-agent-assurance-runbook.md)
