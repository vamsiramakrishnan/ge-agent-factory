---
type: Workflow Stage
title: Data Aggregation
description: "Pull contact and account data from CRM, behavioral data from HubSpot, intent data from 6sense. Aggregate in BigQuery with entity resolution across sources."
source_id: data_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Aggregation

Pull contact and account data from CRM, behavioral data from HubSpot, intent data from 6sense. Aggregate in BigQuery with entity resolution across sources.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_audience_segmentation_engine_playbook](/tools/lookup-audience-segmentation-engine-playbook.md)
- [action_salesforce_crm_create](/tools/action-salesforce-crm-create.md)

Next: [Clustering & Scoring](/workflow/clustering-scoring.md)
