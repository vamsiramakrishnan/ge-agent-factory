---
type: Proof Obligation
title: "Golden eval obligation — Run the Concentration Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-concentration-risk-analyzer-end-to-end"
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

# Golden eval obligation — Run the Concentration Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [concentration-risk-analyzer-end-to-end](/tests/concentration-risk-analyzer-end-to-end.md)


## Mechanisms

- [query_spend_data_spend_data_records](/tools/query-spend-data-spend-data-records.md)
- [query_supplier_master_supplier_master_records](/tools/query-supplier-master-supplier-master-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_concentration_risk_analyzer_policy_guide](/tools/lookup-concentration-risk-analyzer-policy-guide.md)
- [action_spend_data_recommend](/tools/action-spend-data-recommend.md)

## Entities that must be referenced

- spend_data_records
- supplier_master_records
- contract_data_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [concentration-risk-analyzer-policy-guide](/documents/concentration-risk-analyzer-policy-guide.md)
