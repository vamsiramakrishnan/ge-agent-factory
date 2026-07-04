---
type: Workflow Stage
title: "Launch Readiness Scorecard & Escalation"
description: "Query Looker dashboards to publish the launch-readiness scorecard for the item and escalate any blocked setup, allocation, or GMROI step to the Category Manager queue."
source_id: launch_readiness_scorecard_escalation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Launch Readiness Scorecard & Escalation

Query Looker dashboards to publish the launch-readiness scorecard for the item and escalate any blocked setup, allocation, or GMROI step to the Category Manager queue.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_publish](/tools/action-oracle-retail-mfcs-publish.md)
