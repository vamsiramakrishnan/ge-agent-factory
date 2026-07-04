---
type: Workflow Stage
title: "Disposition Recommendation & Change-Control Routing"
description: "Recommend last-time buy, alternate qualification, or redesign per part and, for Class 1 (form/fit/function) changes flagged on engineering_change_orders, route through the engineering change control board before calling action_ptc_windchill_plm_recommend."
source_id: disposition_recommendation_change_control_routing
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Disposition Recommendation & Change-Control Routing

Recommend last-time buy, alternate qualification, or redesign per part and, for Class 1 (form/fit/function) changes flagged on engineering_change_orders, route through the engineering change control board before calling action_ptc_windchill_plm_recommend.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

Next: [Action Execution, Audit Trail & Escalation](/workflow/action-execution-audit-trail-escalation.md)
