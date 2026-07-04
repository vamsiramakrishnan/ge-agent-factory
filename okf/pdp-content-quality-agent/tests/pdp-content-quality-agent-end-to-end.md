---
type: Eval Scenario
title: Run the PDP Content Quality Agent workflow for the current period. Cite the r...
description: "Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "pdp-content-quality-agent-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the PDP Content Quality Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_pdp_content_quality_agent_execution_playbook](/tools/lookup-pdp-content-quality-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_publish](/tools/action-salesforce-commerce-cloud-publish.md)

## Success rubric

Action publish executed against Salesforce Commerce Cloud, with audit-trail entry and E-Commerce Merchandiser notified of outcomes.

# Citations

- [PDP Content Quality Agent Retail Execution Playbook](/documents/pdp-content-quality-agent-execution-playbook.md)
