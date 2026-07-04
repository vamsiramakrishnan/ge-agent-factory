---
type: Workflow Stage
title: Pipeline Data Ingestion
description: Pull savings pipeline data from Coupa and Ariba sourcing modules. Match contracted prices against actual PO prices in ERP. Feed matched data into BigQuery and Looker dashboards.
source_id: pipeline_data_ingestion
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pipeline Data Ingestion

Pull savings pipeline data from Coupa and Ariba sourcing modules. Match contracted prices against actual PO prices in ERP. Feed matched data into BigQuery and Looker dashboards.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_savings_pipeline_tracker_policy_guide](/tools/lookup-savings-pipeline-tracker-policy-guide.md)
- [action_coupa_generate](/tools/action-coupa-generate.md)

Next: [Savings Classification & Scoring](/workflow/savings-classification-scoring.md)
