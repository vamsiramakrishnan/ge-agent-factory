---
type: Eval Scenario
title: Run the Enterprise RFP Response Agent workflow for the current period. Cite t...
description: "Run the Enterprise RFP Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "enterprise-rfp-response-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Enterprise RFP Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_enterprise_rfp_response_agent_assurance_runbook](/tools/lookup-enterprise-rfp-response-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

## Success rubric

Action route executed against Salesforce Communications Cloud, with audit-trail entry and Bid Manager notified of outcomes.

# Citations

- [Enterprise RFP Response Agent Service Assurance Runbook](/documents/enterprise-rfp-response-agent-assurance-runbook.md)
