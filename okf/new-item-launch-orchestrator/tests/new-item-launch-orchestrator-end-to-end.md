---
type: Eval Scenario
title: Run the New Item Launch Orchestrator workflow for the current period. Cite th...
description: "Run the New Item Launch Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "new-item-launch-orchestrator-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the New Item Launch Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [launch-readiness-scorecard-escalation](/queries/launch-readiness-scorecard-escalation.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_new_item_launch_orchestrator_execution_playbook](/tools/lookup-new-item-launch-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_publish](/tools/action-oracle-retail-mfcs-publish.md)

## Success rubric

Action publish executed against Oracle Retail MFCS, with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [New Item Launch Orchestrator Retail Execution Playbook](/documents/new-item-launch-orchestrator-execution-playbook.md)
