---
type: Eval Scenario
title: "Run the What-If Scenario Simulator workflow for the current period. Cite the ..."
description: "Run the What-If Scenario Simulator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "what-if-scenario-simulator-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the What-If Scenario Simulator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [question-to-parameters](/queries/question-to-parameters.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_procurement_2_procurement_2_records](/tools/query-procurement-2-procurement-2-records.md)
- [query_procurement_3_procurement_3_records](/tools/query-procurement-3-procurement-3-records.md)
- [lookup_what_if_scenario_simulator_policy_guide](/tools/lookup-what-if-scenario-simulator-policy-guide.md)
- [action_procurement_2_recommend](/tools/action-procurement-2-recommend.md)

## Success rubric

Action recommend executed against PROCUREMENT 2, with audit-trail entry and Procurement Analytics Lead notified of outcomes.

# Citations

- [What-If Scenario Simulator Procurement Policy Guide](/documents/what-if-scenario-simulator-policy-guide.md)
