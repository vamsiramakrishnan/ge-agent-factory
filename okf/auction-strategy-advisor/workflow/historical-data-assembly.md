---
type: Workflow Stage
title: Historical Data Assembly
description: "Pull historical auction data from Ariba and Coupa — bid patterns, price decline curves, round dynamics, participation rates. Aggregate into BigQuery for analysis."
source_id: historical_data_assembly
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Historical Data Assembly

Pull historical auction data from Ariba and Coupa — bid patterns, price decline curves, round dynamics, participation rates. Aggregate into BigQuery for analysis.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_ariba_e_auction_suppliers](/tools/query-sap-ariba-e-auction-suppliers.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_auction_strategy_advisor_policy_guide](/tools/lookup-auction-strategy-advisor-policy-guide.md)
- [action_sap_ariba_e_auction_generate](/tools/action-sap-ariba-e-auction-generate.md)

Next: [Game Theory & Optimization](/workflow/game-theory-optimization.md)
