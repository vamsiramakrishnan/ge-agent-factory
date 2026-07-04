---
type: Workflow Stage
title: Retrieve Records
description: Query customer interactions and queue metrics from Genesys Cloud CX for the Churn Save Desk Agent workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query customer interactions and queue metrics from Genesys Cloud CX for the Churn Save Desk Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_churn_save_desk_agent_assurance_runbook](/tools/lookup-churn-save-desk-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_approve](/tools/action-genesys-cloud-cx-approve.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
