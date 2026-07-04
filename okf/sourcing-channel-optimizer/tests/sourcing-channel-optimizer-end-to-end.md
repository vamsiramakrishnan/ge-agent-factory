---
type: Eval Scenario
title: Run the Sourcing Channel Optimizer workflow for the current period. Cite the ...
description: "Run the Sourcing Channel Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sourcing-channel-optimizer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Sourcing Channel Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [transaction-data-assembly](/queries/transaction-data-assembly.md)

## Mechanisms to call

- [query_coupa_catalog_catalog_items](/tools/query-coupa-catalog-catalog-items.md)
- [query_amazon_business_amazon_business_records](/tools/query-amazon-business-amazon-business-records.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sourcing_channel_optimizer_policy_guide](/tools/lookup-sourcing-channel-optimizer-policy-guide.md)
- [action_coupa_catalog_generate](/tools/action-coupa-catalog-generate.md)

## Success rubric

Action generate executed against Coupa catalog, with audit-trail entry and Indirect Procurement Lead notified of outcomes.

# Citations

- [Sourcing Channel Optimizer Procurement Policy Guide](/documents/sourcing-channel-optimizer-policy-guide.md)
