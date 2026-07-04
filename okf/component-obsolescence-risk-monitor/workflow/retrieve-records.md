---
type: Workflow Stage
title: Retrieve Records
description: Query engineering change orders and bom revisions from PTC Windchill PLM and correlate with SAP S/4HANA MM for the Component Obsolescence Risk Monitor workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query engineering change orders and bom revisions from PTC Windchill PLM and correlate with SAP S/4HANA MM for the Component Obsolescence Risk Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
