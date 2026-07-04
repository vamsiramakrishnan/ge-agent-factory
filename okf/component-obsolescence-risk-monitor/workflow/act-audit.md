---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the recommend step in PTC Windchill PLM with a full audit trail, and escalate exceptions to the Component Engineer."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the recommend step in PTC Windchill PLM with a full audit trail, and escalate exceptions to the Component Engineer.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)
