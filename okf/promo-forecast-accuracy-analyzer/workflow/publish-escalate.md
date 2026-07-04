---
type: Workflow Stage
title: "Publish & Escalate"
description: "Publish the corrected lift factor into Blue Yonder Demand Planning via action_blue_yonder_demand_planning_publish with a full audit trail, or escalate repeatedly unprofitable event types and threshold breaches to the Promotions Manager, divisional_merchandise_manager, or pricing_director."
source_id: publish_escalate
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish & Escalate

Publish the corrected lift factor into Blue Yonder Demand Planning via action_blue_yonder_demand_planning_publish with a full audit trail, or escalate repeatedly unprofitable event types and threshold breaches to the Promotions Manager, divisional_merchandise_manager, or pricing_director.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)
