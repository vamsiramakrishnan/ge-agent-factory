---
type: Eval Scenario
title: Production order 1512087 at plant 1020 shows scrap_qty 38 against planned_qty...
description: "Production order 1512087 at plant 1020 shows scrap_qty 38 against planned_qty 220 in Siemens Opcenter MES. SAP S/4HANA PP process order records tied to the same order_number show two separate confirmation postings four hours apart at work center CNC-01, but only the first carries a scrap_qty entry -- the second looks like reworked units re-entering under the original order number. Before you publish today's scrap cost dashboard to Looker, tell me whether this is a legitimate rework re-entry or a double-confirmation error, and cite what governs who owns fixing it."
source_id: "scrap-and-rework-analytics-engine-rework-loop-reconciliation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Production order 1512087 at plant 1020 shows scrap_qty 38 against planned_qty 220 in Siemens Opcenter MES. SAP S/4HANA PP process order records tied to the same order_number show two separate confirmation postings four hours apart at work center CNC-01, but only the first carries a scrap_qty entry -- the second looks like reworked units re-entering under the original order number. Before you publish today's scrap cost dashboard to Looker, tell me whether this is a legitimate rework re-entry or a double-confirmation error, and cite what governs who owns fixing it.

## Validates

- [nightly-mes-sap-scrap-attribution-pull](/queries/nightly-mes-sap-scrap-attribution-pull.md)

## Mechanisms to call

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [lookup_scrap_and_rework_analytics_engine_sop](/tools/lookup-scrap-and-rework-analytics-engine-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Scrap and Rework Analytics Engine Standard Operating Procedure](/documents/scrap-and-rework-analytics-engine-sop.md)
- [Scrap and Rework Cost Attribution Standard](/documents/scrap-rework-cost-attribution-standard.md)
