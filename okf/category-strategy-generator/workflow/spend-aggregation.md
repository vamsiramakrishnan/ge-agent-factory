---
type: Workflow Stage
title: Spend Aggregation
description: Pull 3 years of category spend from Ariba and Coupa. Enrich with UNSPSC classification and supplier entity resolution from BigQuery spend cube.
source_id: spend_aggregation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Spend Aggregation

Pull 3 years of category spend from Ariba and Coupa. Enrich with UNSPSC classification and supplier entity resolution from BigQuery spend cube.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_ariba_category_mgmt_suppliers](/tools/query-sap-ariba-category-mgmt-suppliers.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_category_strategy_generator_policy_guide](/tools/lookup-category-strategy-generator-policy-guide.md)
- [action_sap_ariba_category_mgmt_generate](/tools/action-sap-ariba-category-mgmt-generate.md)

Next: [Strategy Narrative Generation](/workflow/strategy-narrative-generation.md)
