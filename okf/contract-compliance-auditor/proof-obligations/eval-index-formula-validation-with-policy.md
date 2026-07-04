---
type: Proof Obligation
title: "Golden eval obligation — Contract-3991 pricing: 'LME aluminum index ± 3% dead band, capped at 6%.' Current index moved 5% this quarter. Validate pricing adjustment against policy."
description: golden eval proof obligation
source_id: "eval-index-formula-validation-with-policy"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.2
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Contract-3991 pricing: 'LME aluminum index ± 3% dead band, capped at 6%.' Current index moved 5% this quarter. Validate pricing adjustment against policy.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.2
- **Eval:** [index-formula-validation-with-policy](/tests/index-formula-validation-with-policy.md)


## Mechanisms

- [query_icertis_pricing_schedules](/tools/query-icertis-pricing-schedules.md)
- [evidence_pricing_formula_policy](/tools/evidence-pricing-formula-policy.md)

## Entities that must be referenced

- pricing_schedules

## Forbidden behaviors

- do not reinterpret dead band or cap without policy citation
- do not approve out-of-policy adjustments

# Citations

- [procurement-contract-compliance-policy](/documents/procurement-contract-compliance-policy.md)
