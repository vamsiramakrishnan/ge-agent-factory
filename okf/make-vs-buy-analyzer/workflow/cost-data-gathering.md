---
type: Workflow Stage
title: Cost Data Gathering
description: Pull BOM and routing cost data from SAP S/4HANA. Fetch external labor rate and material cost benchmarks by geography. Deliver structured cost inputs to modeling stage.
source_id: cost_data_gathering
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cost Data Gathering

Pull BOM and routing cost data from SAP S/4HANA. Fetch external labor rate and material cost benchmarks by geography. Deliver structured cost inputs to modeling stage.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_market_benchmarks_market_benchmarks_records](/tools/query-market-benchmarks-market-benchmarks-records.md)
- [lookup_make_vs_buy_analyzer_policy_guide](/tools/lookup-make-vs-buy-analyzer-policy-guide.md)
- [action_sap_s_4hana_recommend](/tools/action-sap-s-4hana-recommend.md)

Next: [Strategic Synthesis & Recommendation](/workflow/strategic-synthesis-recommendation.md)
