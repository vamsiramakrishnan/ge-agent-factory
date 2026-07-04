---
type: Query Capability
title: Aggregate all open requisitions with business context from Workday. Enrich wi...
description: Aggregate all open requisitions with business context from Workday. Enrich with historical fill rates and difficulty metrics from BigQuery.
source_id: "req-pool-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate all open requisitions with business context from Workday. Enrich with historical fill rates and difficulty metrics from BigQuery.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_requisition_prioritization_agent_policy_handbook](/tools/lookup-requisition-prioritization-agent-policy-handbook.md)

## Runs in

- [req_pool_aggregation](/workflow/req-pool-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Requisition Prioritization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/requisition-prioritization-agent-end-to-end.md)

# Citations

- [Requisition Prioritization Agent Policy Handbook](/documents/requisition-prioritization-agent-policy-handbook.md)
