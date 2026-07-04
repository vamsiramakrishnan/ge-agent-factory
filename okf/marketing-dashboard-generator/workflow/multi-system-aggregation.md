---
type: Workflow Stage
title: "Multi-System Aggregation"
description: "Aggregate data from GA4 (traffic, conversion), Salesforce (pipeline, revenue), and HubSpot (MQLs, engagement) into BigQuery unified data warehouse. Maintain dashboard data models."
source_id: multi_system_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-System Aggregation

Aggregate data from GA4 (traffic, conversion), Salesforce (pipeline, revenue), and HubSpot (MQLs, engagement) into BigQuery unified data warehouse. Maintain dashboard data models.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_marketing_dashboard_generator_playbook](/tools/lookup-marketing-dashboard-generator-playbook.md)
- [action_salesforce_crm_execute](/tools/action-salesforce-crm-execute.md)

Next: [Dashboard & Report Distribution](/workflow/dashboard-report-distribution.md)
