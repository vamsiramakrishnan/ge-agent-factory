---
type: Eval Scenario
title: Run the Supplier Risk Scoring Engine workflow for the current period. Cite th...
description: "Run the Supplier Risk Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-risk-scoring-engine-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Supplier Risk Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [risk-data-aggregation](/queries/risk-data-aggregation.md)

## Mechanisms to call

- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [query_rapidratings_rapidratings_records](/tools/query-rapidratings-rapidratings-records.md)
- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_moody_s_moody_s_records](/tools/query-moody-s-moody-s-records.md)
- [lookup_supplier_risk_scoring_engine_policy_guide](/tools/lookup-supplier-risk-scoring-engine-policy-guide.md)
- [action_d_b_generate](/tools/action-d-b-generate.md)

## Success rubric

Action generate executed against D&B, with audit-trail entry and Supplier Risk Analyst notified of outcomes.

# Citations

- [Supplier Risk Scoring Engine Procurement Policy Guide](/documents/supplier-risk-scoring-engine-policy-guide.md)
