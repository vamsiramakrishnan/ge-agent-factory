---
type: Query Capability
title: "Pull historical auction data from Ariba and Coupa — bid patterns, price decli..."
description: "Pull historical auction data from Ariba and Coupa — bid patterns, price decline curves, round dynamics, participation rates. Aggregate into BigQuery for analysis."
source_id: "historical-data-assembly"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull historical auction data from Ariba and Coupa — bid patterns, price decline curves, round dynamics, participation rates. Aggregate into BigQuery for analysis.

## Tools used

- [query_sap_ariba_e_auction_suppliers](/tools/query-sap-ariba-e-auction-suppliers.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_auction_strategy_advisor_policy_guide](/tools/lookup-auction-strategy-advisor-policy-guide.md)
- [action_sap_ariba_e_auction_generate](/tools/action-sap-ariba-e-auction-generate.md)

## Runs in

- [historical_data_assembly](/workflow/historical-data-assembly.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Auction Strategy Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/auction-strategy-advisor-end-to-end.md)

# Citations

- [Auction Strategy Advisor Procurement Policy Guide](/documents/auction-strategy-advisor-policy-guide.md)
