---
type: Eval Scenario
title: Run the Audience Segmentation Engine workflow for the current period. Cite th...
description: "Run the Audience Segmentation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "audience-segmentation-engine-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Audience Segmentation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-aggregation](/queries/data-aggregation.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_audience_segmentation_engine_playbook](/tools/lookup-audience-segmentation-engine-playbook.md)
- [action_salesforce_crm_create](/tools/action-salesforce-crm-create.md)

## Success rubric

Action create executed against Salesforce CRM, with audit-trail entry and Demand Gen Manager notified of outcomes.

# Citations

- [Audience Segmentation Engine Playbook](/documents/audience-segmentation-engine-playbook.md)
