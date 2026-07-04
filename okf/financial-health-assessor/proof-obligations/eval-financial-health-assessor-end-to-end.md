---
type: Proof Obligation
title: "Golden eval obligation — Run the Financial Health Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-financial-health-assessor-end-to-end"
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

# Golden eval obligation — Run the Financial Health Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [financial-health-assessor-end-to-end](/tests/financial-health-assessor-end-to-end.md)


## Mechanisms

- [query_rapidratings_rapidratings_records](/tools/query-rapidratings-rapidratings-records.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [query_moody_s_moody_s_records](/tools/query-moody-s-moody-s-records.md)
- [query_sec_edgar_sec_edgar_records](/tools/query-sec-edgar-sec-edgar-records.md)
- [lookup_financial_health_assessor_policy_guide](/tools/lookup-financial-health-assessor-policy-guide.md)

## Entities that must be referenced

- rapidratings_records
- d_b_records
- moody_s_records
- sec_edgar_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [financial-health-assessor-policy-guide](/documents/financial-health-assessor-policy-guide.md)
