---
type: Eval Scenario
title: Run the B2B Quote Configuration Agent workflow for the current period. Cite t...
description: "Run the B2B Quote Configuration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "b2b-quote-configuration-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the B2B Quote Configuration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_b2b_quote_configuration_agent_assurance_runbook](/tools/lookup-b2b-quote-configuration-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

## Success rubric

Action route executed against Salesforce Communications Cloud, with audit-trail entry and B2B Sales Engineer notified of outcomes.

# Citations

- [B2B Quote Configuration Agent Service Assurance Runbook](/documents/b2b-quote-configuration-agent-assurance-runbook.md)
