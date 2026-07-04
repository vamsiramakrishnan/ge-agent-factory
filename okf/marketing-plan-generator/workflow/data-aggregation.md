---
type: Workflow Stage
title: Data Aggregation
description: "Pull pipeline data from Salesforce, campaign performance from HubSpot, and revenue targets from finance. Aggregate in BigQuery with historical context."
source_id: data_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Aggregation

Pull pipeline data from Salesforce, campaign performance from HubSpot, and revenue targets from finance. Aggregate in BigQuery with historical context.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_marketing_plan_generator_playbook](/tools/lookup-marketing-plan-generator-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

Next: [Channel Mix Optimization](/workflow/channel-mix-optimization.md)
