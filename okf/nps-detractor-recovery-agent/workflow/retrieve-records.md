---
type: Workflow Stage
title: Retrieve Records
description: Query customer interactions and queue metrics from Genesys Cloud CX and correlate with Zendesk for the NPS Detractor Recovery Agent workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query customer interactions and queue metrics from Genesys Cloud CX and correlate with Zendesk for the NPS Detractor Recovery Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_nps_detractor_recovery_agent_assurance_runbook](/tools/lookup-nps-detractor-recovery-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_escalate](/tools/action-genesys-cloud-cx-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
