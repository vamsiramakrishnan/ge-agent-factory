---
type: Query Capability
title: Pull BOM and routing cost data from SAP S/4HANA. Fetch external labor rate an...
description: Pull BOM and routing cost data from SAP S/4HANA. Fetch external labor rate and material cost benchmarks by geography. Deliver structured cost inputs to modeling stage.
source_id: "cost-data-gathering"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull BOM and routing cost data from SAP S/4HANA. Fetch external labor rate and material cost benchmarks by geography. Deliver structured cost inputs to modeling stage.

## Tools used

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_market_benchmarks_market_benchmarks_records](/tools/query-market-benchmarks-market-benchmarks-records.md)
- [lookup_make_vs_buy_analyzer_policy_guide](/tools/lookup-make-vs-buy-analyzer-policy-guide.md)
- [action_sap_s_4hana_recommend](/tools/action-sap-s-4hana-recommend.md)

## Runs in

- [cost_data_gathering](/workflow/cost-data-gathering.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Make-vs-Buy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/make-vs-buy-analyzer-end-to-end.md)

# Citations

- [Make-vs-Buy Analyzer Procurement Policy Guide](/documents/make-vs-buy-analyzer-policy-guide.md)
