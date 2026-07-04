---
type: Workflow Stage
title: "Serviceability matrix publish & opportunity handoff"
description: "Execute action_salesforce_communications_cloud_publish to post the color-coded per-site serviceability matrix and recommended access technology back to the Salesforce Communications Cloud opportunity, with a full audit trail, and escalate exceptions to the Sales Solution Consultant or network engineering."
source_id: serviceability_matrix_publish_opportunity_handoff
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Serviceability matrix publish & opportunity handoff

Execute action_salesforce_communications_cloud_publish to post the color-coded per-site serviceability matrix and recommended access technology back to the Salesforce Communications Cloud opportunity, with a full audit trail, and escalate exceptions to the Sales Solution Consultant or network engineering.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_site_serviceability_qualification_agent_assurance_runbook](/tools/lookup-site-serviceability-qualification-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_publish](/tools/action-salesforce-communications-cloud-publish.md)
