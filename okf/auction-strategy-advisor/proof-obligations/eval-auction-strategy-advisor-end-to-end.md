---
type: Proof Obligation
title: "Golden eval obligation — Run the Auction Strategy Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-auction-strategy-advisor-end-to-end"
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

# Golden eval obligation — Run the Auction Strategy Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [auction-strategy-advisor-end-to-end](/tests/auction-strategy-advisor-end-to-end.md)


## Mechanisms

- [query_sap_ariba_e_auction_suppliers](/tools/query-sap-ariba-e-auction-suppliers.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_auction_strategy_advisor_policy_guide](/tools/lookup-auction-strategy-advisor-policy-guide.md)
- [action_sap_ariba_e_auction_generate](/tools/action-sap-ariba-e-auction-generate.md)

## Entities that must be referenced

- suppliers
- requisitions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [auction-strategy-advisor-policy-guide](/documents/auction-strategy-advisor-policy-guide.md)
