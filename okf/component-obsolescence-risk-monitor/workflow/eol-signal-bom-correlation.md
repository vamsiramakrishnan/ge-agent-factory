---
type: Workflow Stage
title: "EOL Signal & BOM Correlation"
description: "Query engineering_change_orders and bom_revisions from PTC Windchill PLM and cross-reference against purchase_orders and vendors in SAP S/4HANA MM to find every active product touched by a supplier end-of-life or lifecycle-risk signal."
source_id: eol_signal_bom_correlation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# EOL Signal & BOM Correlation

Query engineering_change_orders and bom_revisions from PTC Windchill PLM and cross-reference against purchase_orders and vendors in SAP S/4HANA MM to find every active product touched by a supplier end-of-life or lifecycle-risk signal.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

Next: [Exposure & Last-Time-Buy Quantification](/workflow/exposure-last-time-buy-quantification.md)
