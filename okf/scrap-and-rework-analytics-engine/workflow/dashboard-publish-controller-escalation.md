---
type: Workflow Stage
title: "Dashboard Publish & Controller Escalation"
description: "Execute action_siemens_opcenter_mes_publish to push the daily scrap cost dashboard to Looker's dashboards and metric_definitions, with a full audit trail, and escalate any single-day spike above threshold to the Plant Controller and production supervisor."
source_id: dashboard_publish_controller_escalation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Dashboard Publish & Controller Escalation

Execute action_siemens_opcenter_mes_publish to push the daily scrap cost dashboard to Looker's dashboards and metric_definitions, with a full audit trail, and escalate any single-day spike above threshold to the Plant Controller and production supervisor.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_scrap_and_rework_analytics_engine_sop](/tools/lookup-scrap-and-rework-analytics-engine-sop.md)
- [action_siemens_opcenter_mes_publish](/tools/action-siemens-opcenter-mes-publish.md)
