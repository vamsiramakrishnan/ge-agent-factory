---
type: Eval Scenario
title: Run the Price Variance Analyzer workflow for the current period. Cite the rel...
description: "Run the Price Variance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "price-variance-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Price Variance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [context-investigation-reporting](/queries/context-investigation-reporting.md)

## Mechanisms to call

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_price_variance_analyzer_policy_guide](/tools/lookup-price-variance-analyzer-policy-guide.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA, with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [Price Variance Analyzer Procurement Policy Guide](/documents/price-variance-analyzer-policy-guide.md)
