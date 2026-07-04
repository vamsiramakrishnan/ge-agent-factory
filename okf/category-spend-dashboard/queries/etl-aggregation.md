---
type: Query Capability
title: Scheduled ETL from Coupa and Ariba analytics into BigQuery spend cube. Refres...
description: "Scheduled ETL from Coupa and Ariba analytics into BigQuery spend cube. Refresh dimensional model with latest PO, invoice, and contract coverage data."
source_id: "etl-aggregation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scheduled ETL from Coupa and Ariba analytics into BigQuery spend cube. Refresh dimensional model with latest PO, invoice, and contract coverage data.

## Tools used

- [query_coupa_analytics_requisitions](/tools/query-coupa-analytics-requisitions.md)
- [query_sap_ariba_analytics_suppliers](/tools/query-sap-ariba-analytics-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_category_spend_dashboard_policy_guide](/tools/lookup-category-spend-dashboard-policy-guide.md)
- [action_coupa_analytics_generate](/tools/action-coupa-analytics-generate.md)

## Runs in

- [etl_aggregation](/workflow/etl-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Category Spend Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-spend-dashboard-end-to-end.md)

# Citations

- [Category Spend Dashboard Procurement Policy Guide](/documents/category-spend-dashboard-policy-guide.md)
