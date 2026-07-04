---
type: Proof Obligation
title: "Golden eval obligation — Run the Tail Spend Classifier & Opportunity Finder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-tail-spend-classifier-opportunity-finder-end-to-end"
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

# Golden eval obligation — Run the Tail Spend Classifier & Opportunity Finder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [tail-spend-classifier-opportunity-finder-end-to-end](/tests/tail-spend-classifier-opportunity-finder-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_tail_spend_classifier_opportunity_finder_policy_guide](/tools/lookup-tail-spend-classifier-opportunity-finder-policy-guide.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Entities that must be referenced

- analytics_events
- transactions
- requisitions

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [tail-spend-classifier-opportunity-finder-policy-guide](/documents/tail-spend-classifier-opportunity-finder-policy-guide.md)
