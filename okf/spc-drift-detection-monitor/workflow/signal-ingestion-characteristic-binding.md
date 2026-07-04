---
type: Workflow Stage
title: "Signal Ingestion & Characteristic Binding"
description: "Stream in-line quality_checks measurements and machine_events from Siemens Opcenter MES alongside inspection_lots from SAP S/4HANA QM, binding each measured_value to its characteristic, production_order, and spec limits via query_siemens_opcenter_mes_production_orders and query_sap_s_4hana_qm_inspection_lots."
source_id: signal_ingestion_characteristic_binding
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Signal Ingestion & Characteristic Binding

Stream in-line quality_checks measurements and machine_events from Siemens Opcenter MES alongside inspection_lots from SAP S/4HANA QM, binding each measured_value to its characteristic, production_order, and spec limits via query_siemens_opcenter_mes_production_orders and query_sap_s_4hana_qm_inspection_lots.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_sap_s_4hana_qm_recommend](/tools/action-sap-s-4hana-qm-recommend.md)

Next: [Western Electric Run-Rule Evaluation](/workflow/western-electric-run-rule-evaluation.md)
