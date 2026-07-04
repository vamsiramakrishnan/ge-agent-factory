---
type: Workflow Stage
title: Retrieve Records
description: Query subscriber accounts and service quotes from Salesforce Communications Cloud and correlate with ServiceNow for the Enterprise RFP Response Agent workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query subscriber accounts and service quotes from Salesforce Communications Cloud and correlate with ServiceNow for the Enterprise RFP Response Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_enterprise_rfp_response_agent_assurance_runbook](/tools/lookup-enterprise-rfp-response-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
