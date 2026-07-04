---
type: Workflow Stage
title: "Executive Briefing Publish & Escalation"
description: "Publishes the side-by-side scenario comparison to Looker dashboards via query_looker_dashboards, executes action_kinaxis_rapidresponse_publish in Kinaxis RapidResponse with a full audit trail, and escalates line-down, force-majeure, or service-floor breaches to the S&OP Manager, materials_manager, procurement_director, or sandop_process_owner before the meeting."
source_id: executive_briefing_publish_escalation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Executive Briefing Publish & Escalation

Publishes the side-by-side scenario comparison to Looker dashboards via query_looker_dashboards, executes action_kinaxis_rapidresponse_publish in Kinaxis RapidResponse with a full audit trail, and escalates line-down, force-majeure, or service-floor breaches to the S&OP Manager, materials_manager, procurement_director, or sandop_process_owner before the meeting.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)
- [action_kinaxis_rapidresponse_publish](/tools/action-kinaxis-rapidresponse-publish.md)
