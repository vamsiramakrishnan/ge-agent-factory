---
type: Proof Obligation
title: "Golden eval obligation — Run the Demand Pattern Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-demand-pattern-analyzer-end-to-end"
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

# Golden eval obligation — Run the Demand Pattern Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [demand-pattern-analyzer-end-to-end](/tests/demand-pattern-analyzer-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_demand_pattern_analyzer_policy_guide](/tools/lookup-demand-pattern-analyzer-policy-guide.md)

## Entities that must be referenced

- transactions
- analytics_events
- procurement_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [demand-pattern-analyzer-policy-guide](/documents/demand-pattern-analyzer-policy-guide.md)
