---
type: Proof Obligation
title: "Golden eval obligation — Contract-4107 has a rebate tier: 90% volume commitment = $500K rebate. Current volume is at 88% with 45 days remaining in the term. Recommend action."
description: golden eval proof obligation
source_id: "eval-rebate-cliff-opportunity-narrative"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.1
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Contract-4107 has a rebate tier: 90% volume commitment = $500K rebate. Current volume is at 88% with 45 days remaining in the term. Recommend action.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.1
- **Eval:** [rebate-cliff-opportunity-narrative](/tests/rebate-cliff-opportunity-narrative.md)


## Mechanisms

- [query_icertis_rebate_tiers](/tools/query-icertis-rebate-tiers.md)
- [query_bigquery_rebate_threshold_status](/tools/query-bigquery-rebate-threshold-status.md)
- [evidence_pricing_formula_policy](/tools/evidence-pricing-formula-policy.md)

## Entities that must be referenced

- rebate_tiers
- invoice_actuals

## Forbidden behaviors

- do not guarantee a rebate will be triggered
- do not recommend purchase commitments

# Citations

- [procurement-contract-compliance-policy](/documents/procurement-contract-compliance-policy.md)
