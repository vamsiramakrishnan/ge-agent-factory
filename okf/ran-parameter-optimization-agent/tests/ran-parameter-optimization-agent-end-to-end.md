---
type: Eval Scenario
title: Run the RAN Parameter Optimization Agent workflow for the current period. Cit...
description: "Run the RAN Parameter Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "ran-parameter-optimization-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the RAN Parameter Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [counter-alarm-ingestion](/queries/counter-alarm-ingestion.md)

## Mechanisms to call

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)
- [action_ericsson_network_manager_recommend](/tools/action-ericsson-network-manager-recommend.md)

## Success rubric

Action recommend executed against Ericsson Network Manager, with audit-trail entry and RF Optimization Engineer notified of outcomes.

# Citations

- [RAN Parameter Optimization Agent Service Assurance Runbook](/documents/ran-parameter-optimization-agent-assurance-runbook.md)
