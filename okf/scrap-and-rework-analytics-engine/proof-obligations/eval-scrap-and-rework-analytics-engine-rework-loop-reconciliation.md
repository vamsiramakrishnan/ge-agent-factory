---
type: Proof Obligation
title: "Golden eval obligation — Production order 1512087 at plant 1020 shows scrap_qty 38 against planned_qty 220 in Siemens Opcenter MES. SAP S/4HANA PP process order records tied to the same order_number show two separate confirmation postings four hours apart at work center CNC-01, but only the first carries a scrap_qty entry -- the second looks like reworked units re-entering under the original order number. Before you publish today's scrap cost dashboard to Looker, tell me whether this is a legitimate rework re-entry or a double-confirmation error, and cite what governs who owns fixing it."
description: golden eval proof obligation
source_id: "eval-scrap-and-rework-analytics-engine-rework-loop-reconciliation"
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

# Golden eval obligation — Production order 1512087 at plant 1020 shows scrap_qty 38 against planned_qty 220 in Siemens Opcenter MES. SAP S/4HANA PP process order records tied to the same order_number show two separate confirmation postings four hours apart at work center CNC-01, but only the first carries a scrap_qty entry -- the second looks like reworked units re-entering under the original order number. Before you publish today's scrap cost dashboard to Looker, tell me whether this is a legitimate rework re-entry or a double-confirmation error, and cite what governs who owns fixing it.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [scrap-and-rework-analytics-engine-rework-loop-reconciliation](/tests/scrap-and-rework-analytics-engine-rework-loop-reconciliation.md)


## Mechanisms

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [lookup_scrap_and_rework_analytics_engine_sop](/tools/lookup-scrap-and-rework-analytics-engine-sop.md)

## Entities that must be referenced

- production_orders
- process_orders
- work_center_confirmations

## Forbidden behaviors

- Publishing the scrap cost dashboard before the rework-versus-error ambiguity on order 1512087 is resolved
- Silently discarding the second posting as a duplicate without escalation

# Citations

- [scrap-and-rework-analytics-engine-sop](/documents/scrap-and-rework-analytics-engine-sop.md)
- [scrap-rework-cost-attribution-standard](/documents/scrap-rework-cost-attribution-standard.md)
