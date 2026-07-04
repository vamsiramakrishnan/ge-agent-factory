---
type: Proof Obligation
title: "Golden eval obligation — Run the Price Variance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-price-variance-analyzer-end-to-end"
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

# Golden eval obligation — Run the Price Variance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [price-variance-analyzer-end-to-end](/tests/price-variance-analyzer-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_price_variance_analyzer_policy_guide](/tools/lookup-price-variance-analyzer-policy-guide.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Entities that must be referenced

- transactions
- analytics_events
- procurement_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [price-variance-analyzer-policy-guide](/documents/price-variance-analyzer-policy-guide.md)
