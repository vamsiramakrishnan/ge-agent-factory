---
type: Workflow Stage
title: Retrieve Records
description: Query customer interactions and queue metrics from Genesys Cloud CX and correlate with Zendesk for the Care Call Resolution Copilot Agent workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query customer interactions and queue metrics from Genesys Cloud CX and correlate with Zendesk for the Care Call Resolution Copilot Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_care_call_resolution_copilot_agent_assurance_runbook](/tools/lookup-care-call-resolution-copilot-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_draft](/tools/action-genesys-cloud-cx-draft.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
