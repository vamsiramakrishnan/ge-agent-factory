---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull network_alarms, cell_sites, and performance_counters from Ericsson Network Manager (query_ericsson_network_manager_network_alarms) to establish current PRB utilization, RSRP/SINR, and open-fault context for every site before any forecast is trusted.](/queries/alarm-counter-intake.md)
- [Compare current counters against historical_metrics, analytics_events, and cached_aggregates in BigQuery (query_bigquery_analytics_events) to separate real trend and seasonality from event-driven traffic spikes per sector.](/queries/baseline-seasonality-trending.md)
- [Forecast per-sector PRB and throughput demand and rank the augment backlog by predicted subscriber-experience impact and revenue at risk, using Looker dashboards and metric_definitions (query_looker_dashboards) for market-level KPI context.](/queries/sector-demand-forecasting-backlog-ranking.md)
- [Match each ranked cell to the cheapest sufficient remedy (parameter rebalancing, carrier add, new site build) and validate the choice against the Cell Congestion Forecasting Engine Service Assurance Runbook and the Capacity Augment Prioritization Playbook (lookup_cell_congestion_forecasting_engine_assurance_runbook) before it reaches the capacity board.](/queries/remedy-selection-runbook-validation.md)
- [Publish the ranked augment plan into Ericsson Network Manager (action_ericsson_network_manager_publish) with a full audit trail, and escalate any gated exceptions to the Capacity Planner or the capacity board.](/queries/capacity-board-publish-audit.md)
