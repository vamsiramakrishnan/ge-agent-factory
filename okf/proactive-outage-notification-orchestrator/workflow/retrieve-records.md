---
type: Workflow Stage
title: Retrieve Records
description: Query customer interactions and queue metrics from Genesys Cloud CX and correlate with ServiceNow for the Proactive Outage Notification Orchestrator workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query customer interactions and queue metrics from Genesys Cloud CX and correlate with ServiceNow for the Proactive Outage Notification Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_proactive_outage_notification_orchestrator_assurance_runbook](/tools/lookup-proactive-outage-notification-orchestrator-assurance-runbook.md)
- [action_genesys_cloud_cx_publish](/tools/action-genesys-cloud-cx-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
