---
type: Proof Obligation
title: "Golden eval obligation — Run the Supplier Risk Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-supplier-risk-scoring-engine-end-to-end"
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

# Golden eval obligation — Run the Supplier Risk Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [supplier-risk-scoring-engine-end-to-end](/tests/supplier-risk-scoring-engine-end-to-end.md)


## Mechanisms

- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [query_rapidratings_rapidratings_records](/tools/query-rapidratings-rapidratings-records.md)
- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_moody_s_moody_s_records](/tools/query-moody-s-moody-s-records.md)
- [lookup_supplier_risk_scoring_engine_policy_guide](/tools/lookup-supplier-risk-scoring-engine-policy-guide.md)
- [action_d_b_generate](/tools/action-d-b-generate.md)

## Entities that must be referenced

- d_b_records
- rapidratings_records
- resilinc_records
- moody_s_records
- bitsight_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [supplier-risk-scoring-engine-policy-guide](/documents/supplier-risk-scoring-engine-policy-guide.md)
