---
type: Proof Obligation
title: "Golden eval obligation — NC 642118 and NC 642305 both reference production order 1483207 but nonconformance_records shows defect_code dimensional for one and contamination for the other, both detected within the last two shifts. Reconcile these against inspection_lots and the Opcenter MES production_orders genealogy and tell me whether they're the same escape or two separate issues before I brief the plant manager."
description: golden eval proof obligation
source_id: "eval-nonconformance-triage-agent-conflicting-nc-reconciliation"
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

# Golden eval obligation — NC 642118 and NC 642305 both reference production order 1483207 but nonconformance_records shows defect_code dimensional for one and contamination for the other, both detected within the last two shifts. Reconcile these against inspection_lots and the Opcenter MES production_orders genealogy and tell me whether they're the same escape or two separate issues before I brief the plant manager.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [nonconformance-triage-agent-conflicting-nc-reconciliation](/tests/nonconformance-triage-agent-conflicting-nc-reconciliation.md)


## Mechanisms

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [lookup_nonconformance_triage_agent_sop](/tools/lookup-nonconformance-triage-agent-sop.md)

## Entities that must be referenced

- nonconformance_records
- inspection_lots
- production_orders

## Forbidden behaviors

- treating the two NCs as automatically the same escape without genealogy evidence
- closing or merging either nonconformance_records entry itself

# Citations

- [nonconformance-triage-agent-sop](/documents/nonconformance-triage-agent-sop.md)
- [mrb-disposition-authority-matrix](/documents/mrb-disposition-authority-matrix.md)
