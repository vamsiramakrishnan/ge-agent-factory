---
type: Query Capability
title: "Execute the publish step in Genesys Cloud CX with a full audit trail, and esc..."
description: "Execute the publish step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Customer Experience Manager."
source_id: "act-audit"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Customer Experience Manager.

## Tools used

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [action_genesys_cloud_cx_publish](/tools/action-genesys-cloud-cx-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Proactive Outage Notification Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/proactive-outage-notification-orchestrator-end-to-end.md)

# Citations

- [Proactive Outage Notification Orchestrator Service Assurance Runbook](/documents/proactive-outage-notification-orchestrator-assurance-runbook.md)
