---
type: Proof Obligation
title: "Golden eval obligation — Nonconformance NC 642187 (severity critical, mrb_required true) was detected against material 452216 eleven days ago. The linked CAPA 74381 is still sitting in containment status and effectiveness_verified is false. Production wants inspection lot 14577903, same material, released today -- walk me through whether it's clear."
description: golden eval proof obligation
source_id: "eval-batch-record-review-analyzer-capa-effectiveness-gap"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Nonconformance NC 642187 (severity critical, mrb_required true) was detected against material 452216 eleven days ago. The linked CAPA 74381 is still sitting in containment status and effectiveness_verified is false. Production wants inspection lot 14577903, same material, released today -- walk me through whether it's clear.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [batch-record-review-analyzer-capa-effectiveness-gap](/tests/batch-record-review-analyzer-capa-effectiveness-gap.md)


## Mechanisms

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_batch_record_review_analyzer_sop](/tools/lookup-batch-record-review-analyzer-sop.md)

## Entities that must be referenced

- nonconformance_records
- capa_actions
- inspection_lots

## Forbidden behaviors

- Calling action_sap_s_4hana_qm_recommend while the CAPA effectiveness check is unresolved
- Treating containment status as equivalent to a closed, verified corrective action

# Citations

- [batch-record-review-analyzer-sop](/documents/batch-record-review-analyzer-sop.md)
- [batch-record-ebr-data-integrity-policy](/documents/batch-record-ebr-data-integrity-policy.md)
