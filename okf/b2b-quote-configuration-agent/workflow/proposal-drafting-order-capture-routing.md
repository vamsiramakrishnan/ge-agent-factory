---
type: Workflow Stage
title: "Proposal Drafting & Order Capture Routing"
description: "Draft the customer-ready proposal and execute action_salesforce_communications_cloud_route to push the validated quote into order_captures, confirming tpv_completed and esign_completed before the audit trail closes the workflow."
source_id: proposal_drafting_order_capture_routing
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Proposal Drafting & Order Capture Routing

Draft the customer-ready proposal and execute action_salesforce_communications_cloud_route to push the validated quote into order_captures, confirming tpv_completed and esign_completed before the audit trail closes the workflow.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_b2b_quote_configuration_agent_assurance_runbook](/tools/lookup-b2b-quote-configuration-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)
