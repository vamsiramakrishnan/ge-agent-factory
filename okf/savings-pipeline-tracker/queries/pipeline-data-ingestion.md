---
type: Query Capability
title: Pull savings pipeline data from Coupa and Ariba sourcing modules. Match contr...
description: Pull savings pipeline data from Coupa and Ariba sourcing modules. Match contracted prices against actual PO prices in ERP. Feed matched data into BigQuery and Looker dashboards.
source_id: "pipeline-data-ingestion"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull savings pipeline data from Coupa and Ariba sourcing modules. Match contracted prices against actual PO prices in ERP. Feed matched data into BigQuery and Looker dashboards.

## Tools used

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_savings_pipeline_tracker_policy_guide](/tools/lookup-savings-pipeline-tracker-policy-guide.md)
- [action_coupa_generate](/tools/action-coupa-generate.md)

## Runs in

- [pipeline_data_ingestion](/workflow/pipeline-data-ingestion.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Savings Pipeline Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/savings-pipeline-tracker-end-to-end.md)

# Citations

- [Savings Pipeline Tracker Procurement Policy Guide](/documents/savings-pipeline-tracker-policy-guide.md)
