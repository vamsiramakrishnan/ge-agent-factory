---
type: Workflow Stage
title: "Response Assembly & Submission Audit"
description: "Assemble the final RFP response citing the Service Assurance Runbook and Bid Pricing Manual sections via lookup_enterprise_rfp_response_agent_assurance_runbook, then execute action_salesforce_communications_cloud_route to submit through Salesforce Communications Cloud with a full audit trail for the Bid Manager."
source_id: response_assembly_submission_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Response Assembly & Submission Audit

Assemble the final RFP response citing the Service Assurance Runbook and Bid Pricing Manual sections via lookup_enterprise_rfp_response_agent_assurance_runbook, then execute action_salesforce_communications_cloud_route to submit through Salesforce Communications Cloud with a full audit trail for the Bid Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_enterprise_rfp_response_agent_assurance_runbook](/tools/lookup-enterprise-rfp-response-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)
