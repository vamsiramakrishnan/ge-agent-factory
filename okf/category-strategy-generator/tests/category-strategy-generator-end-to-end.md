---
type: Eval Scenario
title: Run the Category Strategy Generator workflow for the current period. Cite the...
description: "Run the Category Strategy Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "category-strategy-generator-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Category Strategy Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [spend-aggregation](/queries/spend-aggregation.md)

## Mechanisms to call

- [query_sap_ariba_category_mgmt_suppliers](/tools/query-sap-ariba-category-mgmt-suppliers.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_category_strategy_generator_policy_guide](/tools/lookup-category-strategy-generator-policy-guide.md)
- [action_sap_ariba_category_mgmt_generate](/tools/action-sap-ariba-category-mgmt-generate.md)

## Success rubric

Action generate executed against SAP Ariba Category Mgmt, with audit-trail entry and Category Director notified of outcomes.

# Citations

- [Category Strategy Generator Procurement Policy Guide](/documents/category-strategy-generator-policy-guide.md)
