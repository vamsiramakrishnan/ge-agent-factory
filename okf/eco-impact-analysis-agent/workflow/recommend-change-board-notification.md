---
type: Workflow Stage
title: "Recommend & Change-Board Notification"
description: "Execute action_ptc_windchill_plm_recommend in PTC Windchill PLM with a full audit trail, then draft the change-board impact summary and notify affected planners, buyers, and line engineers of the effectivity decision."
source_id: recommend_change_board_notification
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Recommend & Change-Board Notification

Execute action_ptc_windchill_plm_recommend in PTC Windchill PLM with a full audit trail, then draft the change-board impact summary and notify affected planners, buyers, and line engineers of the effectivity decision.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [lookup_eco_impact_analysis_agent_sop](/tools/lookup-eco-impact-analysis-agent-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)
