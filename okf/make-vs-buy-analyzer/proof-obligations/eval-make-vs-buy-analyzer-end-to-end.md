---
type: Proof Obligation
title: "Golden eval obligation — Run the Make-vs-Buy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-make-vs-buy-analyzer-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Make-vs-Buy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [make-vs-buy-analyzer-end-to-end](/tests/make-vs-buy-analyzer-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_market_benchmarks_market_benchmarks_records](/tools/query-market-benchmarks-market-benchmarks-records.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_make_vs_buy_analyzer_policy_guide](/tools/lookup-make-vs-buy-analyzer-policy-guide.md)
- [action_sap_s_4hana_recommend](/tools/action-sap-s-4hana-recommend.md)

## Entities that must be referenced

- transactions
- market_benchmarks_records
- procurement_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [make-vs-buy-analyzer-policy-guide](/documents/make-vs-buy-analyzer-policy-guide.md)
