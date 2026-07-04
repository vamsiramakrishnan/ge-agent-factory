---
type: Proof Obligation
title: "Golden eval obligation — Our Salesforce data for May had a sync error and we lost 40% of the opportunity records. Can you still generate this month's ROI narrative?"
description: golden eval proof obligation
source_id: "eval-low-confidence-attribution-refusal"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.2
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Our Salesforce data for May had a sync error and we lost 40% of the opportunity records. Can you still generate this month's ROI narrative?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.2
- **Eval:** [low-confidence-attribution-refusal](/tests/low-confidence-attribution-refusal.md)


## Mechanisms

- [query_bigquery_attribution_results](/tools/query-bigquery-attribution-results.md)

## Forbidden behaviors

- do not publish with confidence <0.6
- do not generate narrative with incomplete data

# Citations

- [attribution-methodology-handbook](/documents/attribution-methodology-handbook.md)
