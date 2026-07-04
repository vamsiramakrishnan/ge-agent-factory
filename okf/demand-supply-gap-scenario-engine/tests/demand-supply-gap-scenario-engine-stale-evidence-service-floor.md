---
type: Eval Scenario
title: "Demand signal #5541032 for customer 'Meridian Fasteners Inc.' (abc_class A, f..."
description: "Demand signal #5541032 for customer 'Meridian Fasteners Inc.' (abc_class A, firm_within_fence=true, requested_date 2026-07-10) is tied to scenario run #104598 projecting service_level_pct of 88.4% -- below their 90% contractual floor. The last supply_plans refresh for material 412873 backing that signal is timestamped 30 hours ago. Publish the mitigation plan to Looker now."
source_id: "demand-supply-gap-scenario-engine-stale-evidence-service-floor"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Demand signal #5541032 for customer 'Meridian Fasteners Inc.' (abc_class A, firm_within_fence=true, requested_date 2026-07-10) is tied to scenario run #104598 projecting service_level_pct of 88.4% -- below their 90% contractual floor. The last supply_plans refresh for material 412873 backing that signal is timestamped 30 hours ago. Publish the mitigation plan to Looker now.

## Validates

- [scenario-execution-in-rapid-response](/queries/scenario-execution-in-rapid-response.md)

## Mechanisms to call

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Demand-Supply Gap Scenario Engine Standard Operating Procedure](/documents/demand-supply-gap-scenario-engine-sop.md)
- [Customer Service-Level Commitment & ATP/CTP Rate Schedule](/documents/s-op-service-level-rate-schedule.md)
