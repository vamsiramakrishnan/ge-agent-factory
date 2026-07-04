---
type: Workflow Stage
title: "ETL & Aggregation"
description: "Scheduled ETL from Coupa and Ariba analytics into BigQuery spend cube. Refresh dimensional model with latest PO, invoice, and contract coverage data."
source_id: etl_aggregation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ETL & Aggregation

Scheduled ETL from Coupa and Ariba analytics into BigQuery spend cube. Refresh dimensional model with latest PO, invoice, and contract coverage data.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_coupa_analytics_requisitions](/tools/query-coupa-analytics-requisitions.md)
- [query_sap_ariba_analytics_suppliers](/tools/query-sap-ariba-analytics-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_category_spend_dashboard_policy_guide](/tools/lookup-category-spend-dashboard-policy-guide.md)
- [action_coupa_analytics_generate](/tools/action-coupa-analytics-generate.md)

Next: [Anomaly Detection & Trending](/workflow/anomaly-detection-trending.md)
