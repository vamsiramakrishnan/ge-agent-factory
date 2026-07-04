---
type: Workflow Stage
title: "Rework Loop & Order-Number Reconciliation"
description: "Reconcile work_center_confirmations yield_qty and scrap_qty against material_stagings and process_orders phase_status for the same order_number to surface reworked units re-entering the line under the original order, which the month-end SAP lump-cost variance otherwise hides."
source_id: rework_loop_order_number_reconciliation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Rework Loop & Order-Number Reconciliation

Reconcile work_center_confirmations yield_qty and scrap_qty against material_stagings and process_orders phase_status for the same order_number to surface reworked units re-entering the line under the original order, which the month-end SAP lump-cost variance otherwise hides.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [lookup_scrap_and_rework_analytics_engine_sop](/tools/lookup-scrap-and-rework-analytics-engine-sop.md)

Next: [Baseline Variance & Spike Detection](/workflow/baseline-variance-spike-detection.md)
