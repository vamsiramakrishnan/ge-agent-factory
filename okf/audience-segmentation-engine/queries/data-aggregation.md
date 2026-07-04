---
type: Query Capability
title: "Pull contact and account data from CRM, behavioral data from HubSpot, intent ..."
description: "Pull contact and account data from CRM, behavioral data from HubSpot, intent data from 6sense. Aggregate in BigQuery with entity resolution across sources."
source_id: "data-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull contact and account data from CRM, behavioral data from HubSpot, intent data from 6sense. Aggregate in BigQuery with entity resolution across sources.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_audience_segmentation_engine_playbook](/tools/lookup-audience-segmentation-engine-playbook.md)
- [action_salesforce_crm_create](/tools/action-salesforce-crm-create.md)

## Runs in

- [data_aggregation](/workflow/data-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Audience Segmentation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audience-segmentation-engine-end-to-end.md)

# Citations

- [Audience Segmentation Engine Playbook](/documents/audience-segmentation-engine-playbook.md)
