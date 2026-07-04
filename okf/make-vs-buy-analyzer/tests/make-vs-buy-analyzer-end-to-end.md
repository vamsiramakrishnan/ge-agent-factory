---
type: Eval Scenario
title: "Run the Make-vs-Buy Analyzer workflow for the current period. Cite the releva..."
description: "Run the Make-vs-Buy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "make-vs-buy-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Make-vs-Buy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cost-data-gathering](/queries/cost-data-gathering.md)

## Mechanisms to call

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_market_benchmarks_market_benchmarks_records](/tools/query-market-benchmarks-market-benchmarks-records.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_make_vs_buy_analyzer_policy_guide](/tools/lookup-make-vs-buy-analyzer-policy-guide.md)
- [action_sap_s_4hana_recommend](/tools/action-sap-s-4hana-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA, with audit-trail entry and CPO notified of outcomes.

# Citations

- [Make-vs-Buy Analyzer Procurement Policy Guide](/documents/make-vs-buy-analyzer-policy-guide.md)
