---
type: Workflow Stage
title: "Exception Routing & SME Sign-off"
description: "Route flagged technical exceptions and non-standard pricing concessions to the correct ServiceNow change_requests owner, or to sales_pricing_desk / enterprise_deal_desk per the Enterprise RFP Response Agent Bid Pricing & Delegation-of-Authority Manual, and track sign-off status before the response leaves draft."
source_id: exception_routing_sme_sign_off
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exception Routing & SME Sign-off

Route flagged technical exceptions and non-standard pricing concessions to the correct ServiceNow change_requests owner, or to sales_pricing_desk / enterprise_deal_desk per the Enterprise RFP Response Agent Bid Pricing & Delegation-of-Authority Manual, and track sign-off status before the response leaves draft.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_enterprise_rfp_response_agent_assurance_runbook](/tools/lookup-enterprise-rfp-response-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

Next: [Response Assembly & Submission Audit](/workflow/response-assembly-submission-audit.md)
