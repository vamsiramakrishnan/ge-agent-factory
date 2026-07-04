---
type: Workflow Stage
title: "Defect-elimination briefing and publish"
description: "Generate the defect-elimination candidate briefing with projected savings, publish the ranking to Looker dashboards, and execute action_ibm_maximo_publish in IBM Maximo with a full audit trail, escalating exceptions to the Reliability Engineer."
source_id: defect_elimination_briefing_and_publish
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Defect-elimination briefing and publish

Generate the defect-elimination candidate briefing with projected savings, publish the ranking to Looker dashboards, and execute action_ibm_maximo_publish in IBM Maximo with a full audit trail, escalating exceptions to the Reliability Engineer.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_ibm_maximo_publish](/tools/action-ibm-maximo-publish.md)
