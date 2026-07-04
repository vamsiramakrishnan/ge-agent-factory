---
type: Eval Scenario
title: Run the Auction Strategy Advisor workflow for the current period. Cite the re...
description: "Run the Auction Strategy Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "auction-strategy-advisor-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Auction Strategy Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [historical-data-assembly](/queries/historical-data-assembly.md)

## Mechanisms to call

- [query_sap_ariba_e_auction_suppliers](/tools/query-sap-ariba-e-auction-suppliers.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_auction_strategy_advisor_policy_guide](/tools/lookup-auction-strategy-advisor-policy-guide.md)
- [action_sap_ariba_e_auction_generate](/tools/action-sap-ariba-e-auction-generate.md)

## Success rubric

Action generate executed against SAP Ariba e-Auction, with audit-trail entry and Strategic Sourcing Lead notified of outcomes.

# Citations

- [Auction Strategy Advisor Procurement Policy Guide](/documents/auction-strategy-advisor-policy-guide.md)
