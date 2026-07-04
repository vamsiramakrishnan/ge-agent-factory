---
type: Query Capability
title: "Pull pipeline data from Salesforce, campaign performance from HubSpot, and re..."
description: "Pull pipeline data from Salesforce, campaign performance from HubSpot, and revenue targets from finance. Aggregate in BigQuery with historical context."
source_id: "data-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull pipeline data from Salesforce, campaign performance from HubSpot, and revenue targets from finance. Aggregate in BigQuery with historical context.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_marketing_plan_generator_playbook](/tools/lookup-marketing-plan-generator-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Runs in

- [data_aggregation](/workflow/data-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Marketing Plan Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/marketing-plan-generator-end-to-end.md)

# Citations

- [Marketing Plan Generator Playbook](/documents/marketing-plan-generator-playbook.md)
