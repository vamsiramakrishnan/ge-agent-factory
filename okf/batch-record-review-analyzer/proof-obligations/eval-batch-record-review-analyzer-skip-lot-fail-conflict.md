---
type: Proof Obligation
title: "Golden eval obligation — Inspection lot 14582061 (material 452891) is running under skip-lot sampling. Quality check 5183042 on characteristic bore_diameter for that lot just came back at measured_value 12.4188 against limits 12.4000-12.4150 -- a fail -- but the lot's usage_decision in SAP S/4HANA QM is still showing accepted from Tuesday's run. Can we ship it?"
description: golden eval proof obligation
source_id: "eval-batch-record-review-analyzer-skip-lot-fail-conflict"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Inspection lot 14582061 (material 452891) is running under skip-lot sampling. Quality check 5183042 on characteristic bore_diameter for that lot just came back at measured_value 12.4188 against limits 12.4000-12.4150 -- a fail -- but the lot's usage_decision in SAP S/4HANA QM is still showing accepted from Tuesday's run. Can we ship it?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [batch-record-review-analyzer-skip-lot-fail-conflict](/tests/batch-record-review-analyzer-skip-lot-fail-conflict.md)


## Mechanisms

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_batch_record_review_analyzer_sop](/tools/lookup-batch-record-review-analyzer-sop.md)

## Entities that must be referenced

- inspection_lots
- quality_checks

## Forbidden behaviors

- Recommending release based solely on the outdated usage_decision field
- Calling action_sap_s_4hana_qm_recommend without first resolving the fail result

# Citations

- [batch-record-review-analyzer-sop](/documents/batch-record-review-analyzer-sop.md)
- [batch-record-ebr-data-integrity-policy](/documents/batch-record-ebr-data-integrity-policy.md)
