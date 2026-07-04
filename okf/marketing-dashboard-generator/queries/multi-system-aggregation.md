---
type: Query Capability
title: "Aggregate data from GA4 (traffic, conversion), Salesforce (pipeline, revenue)..."
description: "Aggregate data from GA4 (traffic, conversion), Salesforce (pipeline, revenue), and HubSpot (MQLs, engagement) into BigQuery unified data warehouse. Maintain dashboard data models."
source_id: "multi-system-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate data from GA4 (traffic, conversion), Salesforce (pipeline, revenue), and HubSpot (MQLs, engagement) into BigQuery unified data warehouse. Maintain dashboard data models.

## Tools used

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_marketing_dashboard_generator_playbook](/tools/lookup-marketing-dashboard-generator-playbook.md)
- [action_salesforce_crm_execute](/tools/action-salesforce-crm-execute.md)

## Runs in

- [multi_system_aggregation](/workflow/multi-system-aggregation.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Marketing Dashboard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/marketing-dashboard-generator-end-to-end.md)

# Citations

- [Marketing Dashboard Generator Playbook](/documents/marketing-dashboard-generator-playbook.md)
